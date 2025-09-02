import { describe, it, expect } from "vitest";
import { getClientIdentifier, createRateLimitResponse } from "@/lib/rate-limit";

function makeRequest(headers: Record<string, string>) {
  return new Request("http://localhost/api/x", { headers });
}

describe("rate-limit utils", () => {
  it("builds client id from x-forwarded-for and user-agent", () => {
    const req = makeRequest({
      "x-forwarded-for": "1.2.3.4, 5.6.7.8",
      "user-agent": "TestUA/1.0",
    });
    const id = getClientIdentifier(req as unknown as import("next/server").NextRequest);
    expect(id.startsWith("1.2.3.4-")).toBe(true);
  });

  it("falls back to unknown when headers missing", () => {
    const req = makeRequest({});
    const id = getClientIdentifier(req as unknown as import("next/server").NextRequest);
    expect(id.startsWith("unknown-")).toBe(true);
  });

  it("createRateLimitResponse returns 429 with headers", async () => {
    const reset = new Date(Date.now() + 5000);
    const res = createRateLimitResponse(60, 0, reset);
    expect(res.status).toBe(429);
    expect(res.headers.get("X-RateLimit-Limit")).toBe("60");
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(res.headers.get("X-RateLimit-Reset")).toBe(reset.toISOString());
    const body = await res.json();
    expect(body.error).toBe("Rate limit exceeded");
    expect(typeof body.retryAfter).toBe("number");
  });
});
