import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@sentry/nextjs", () => ({
  withScope: (cb: (s: any) => void) => cb({ setTag: vi.fn(), setContext: vi.fn() }),
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

import { withErrorHandling, logApiCall } from "@/lib/error-handling";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

function makeRequest(url = "http://localhost/api/test", headers?: Record<string, string>) {
  const h = new Headers(headers || {});
  return new Request(url, { method: "GET", headers: h });
}

describe("error-handling", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("withErrorHandling returns handler response on success", async () => {
    const handler = withErrorHandling(async () => NextResponse.json({ ok: true }, { status: 200 }));
  const res = await handler(makeRequest() as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it("withErrorHandling captures exception and returns JSON error", async () => {
    const boom = new Error("boom");
    const spyCapture = vi.spyOn(Sentry, "captureException");
    const handler = withErrorHandling(async () => { throw boom; });
  const res = await handler(makeRequest() as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("boom");
    expect(json.code).toBe("API_ERROR");
    expect(typeof json.timestamp).toBe("string");
    expect(spyCapture).toHaveBeenCalledWith(boom);
  });

  it("logApiCall logs and adds breadcrumb with duration", () => {
    const sentrySpy = vi.spyOn(Sentry, "addBreadcrumb");
    const req = makeRequest("http://localhost/api/test", { "x-request-start": String(Date.now() - 5) });
    const res = new NextResponse(null, { status: 204 });
    logApiCall(req as any, res as any);
    expect(sentrySpy).toHaveBeenCalled();
  });
});
