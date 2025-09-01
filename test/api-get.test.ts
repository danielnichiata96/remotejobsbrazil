import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";
import { GET } from "@/app/api/jobs/route";

vi.mock("@/lib/jobs", async (og) => {
  const mod = await og<typeof import("@/lib/jobs")>();
  return {
    ...mod,
    readJobs: vi.fn(async () => []),
  };
});

// Avoid noisy Sentry logs in tests
vi.mock("@/lib/error-handling", () => ({
  logApiCall: () => {},
}));

describe("GET /api/jobs", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns jobs array with cache headers", async () => {
    const req = new Request("http://localhost/api/jobs", { method: "GET", headers: { "x-request-start": String(Date.now()) } });
  const res = await GET(req as unknown as NextRequest);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(res.headers.get("cache-control")).toBeTruthy();
    const json = await res.json();
    expect(Array.isArray(json.jobs)).toBe(true);
  });
});
