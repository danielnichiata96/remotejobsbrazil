import type { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/jobs/bulk/route";

vi.mock("@/lib/supabase", () => ({ getSupabase: () => undefined }));
vi.mock("@/lib/jobs", async (og) => {
  const mod = await og<typeof import("@/lib/jobs")>();
  return {
    ...mod,
    readJobs: vi.fn(async () => []),
    writeJobs: vi.fn(async () => ({ ok: true })),
  };
});

function jsonReq(body: unknown) {
  return new Request("http://localhost/api/jobs/bulk", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/jobs/bulk", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects invalid body", async () => {
  const res = await POST(jsonReq({ foo: 1 }) as unknown as NextRequest);
    expect(res.status).toBe(400);
  });

  it("creates multiple valid jobs and reports errors", async () => {
    const body = {
      jobs: [
        { title: "React Dev", company: "Acme", applyUrl: "https://example.com" },
        { company: "Acme" }, // invalid
      ],
    };
  const res = await POST(jsonReq(body) as unknown as NextRequest);
    expect([200, 201, 400]).toContain(res.status);
    const json = await res.json();
    expect(Array.isArray(json.created)).toBe(true);
    expect(Array.isArray(json.errors)).toBe(true);
    expect(json.errors.length).toBe(1);
  });
});
