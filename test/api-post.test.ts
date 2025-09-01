import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/jobs/route";

// Mock cookies/auth and supabase to bypass auth/DB in tests
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

describe("POST /api/jobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a job on valid payload", async () => {
    const req = jsonReq({
      title: "Senior React Dev",
      company: "Acme",
      applyUrl: "https://example.com/apply",
      location: "Brazil (Remote)",
      type: "Full-time",
      salary: "R$ 10k",
      description: "Great role",
      tags: ["react", "node"],
    });
  const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.job).toMatchObject({ title: "Senior React Dev", company: "Acme" });
  });

  it("returns 400 on invalid payload (missing fields)", async () => {
    const req = jsonReq({ company: "Acme" });
  const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeTruthy();
  });
});
