import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/jobs/route";
import type { NextRequest } from "next/server";

vi.mock("next/headers", () => ({ cookies: vi.fn(async () => ({ get: () => undefined })) }));
vi.mock("@/lib/auth", () => ({ ADMIN_COOKIE: "admin", verifyAdminToken: () => true }));
vi.mock("@/lib/supabase", () => ({ getSupabase: () => undefined }));
vi.mock("@/lib/jobs", async (og) => {
  const mod = await og<typeof import("@/lib/jobs")>();
  return {
    ...mod,
    readJobs: vi.fn(async () => []),
    writeJobs: vi.fn(async () => ({ ok: true })),
  };
});

function jsonReq(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/jobs", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/jobs with logoUrl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("persists logoUrl when provided", async () => {
    const req = jsonReq({
      title: "Senior React Dev",
      company: "Acme",
      applyUrl: "https://acme.com/jobs/123",
      logoUrl: "https://cdn.acme.com/logo.png",
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.job.logoUrl).toBe("https://cdn.acme.com/logo.png");
  });
});
