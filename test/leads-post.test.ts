import { describe, it, expect, vi } from "vitest";
import { POST } from "@/app/api/leads/route";

vi.mock("@/lib/supabase", () => ({ getSupabase: () => undefined }));

function jsonReq(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/leads", () => {
  it("accepts lead and returns 201 even without DB", async () => {
    const req = jsonReq({ email: "test@example.com", name: "Test", company: "Co", message: "Need devs" });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });
});
