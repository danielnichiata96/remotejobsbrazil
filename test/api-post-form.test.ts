import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";
import { POST } from "@/app/api/jobs/route";

vi.mock("next/headers", () => ({ cookies: vi.fn(async () => ({ get: () => ({ value: "good.token" }) })) }));
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

function formReq(body: Record<string, string>) {
  const form = new URLSearchParams(body);
  return new Request("http://localhost/api/jobs", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
}

describe("POST /api/jobs (form)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulate admin gate enabled
  vi.stubEnv("ADMIN_KEY", "secret");
  });

  it("accepts urlencoded form and creates job", async () => {
    const req = formReq({
      title: "QA Engineer",
      company: "Acme",
      applyUrl: "https://example.com/apply",
      location: "Brazil (Remote)",
      type: "Contract",
      salary: "R$ 10k",
      description: "Test stuff",
      tags: "QA, Cypress",
    });
  const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.job).toMatchObject({ title: "QA Engineer", company: "Acme" });
  });
});
