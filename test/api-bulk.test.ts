import type { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/jobs/bulk/route";

vi.mock("@/lib/supabase", () => ({ getSupabase: () => undefined }));
vi.mock("@/lib/jobs", async (og) => {
  const mod = await og<typeof import("@/lib/jobs")>();
  return {
    ...mod,
    readJobs: vi.fn(async () => [
      { id: 'x', title: 'React Dev', company: 'Acme', applyUrl: 'https://example.com', createdAt: '2024-01-01T00:00:00.000Z', source: 'manual', status: 'approved' }
    ] as any),
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
        { title: "React Dev 2", company: "Acme", applyUrl: "https://example.com/2" },
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

  it("skips duplicate jobs by (applyUrl,title,company)", async () => {
    const body = {
      jobs: [
        { title: "React Dev", company: "Acme", applyUrl: "https://example.com" }, // duplicate of existing
      ],
    };
    const res = await POST(jsonReq(body) as unknown as NextRequest);
    const json = await res.json();
    expect(json.created.length).toBe(0);
    expect(json.errors.some((e: any) => /Duplicate job/.test(e.message))).toBe(true);
  });
});
