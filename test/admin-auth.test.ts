import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as loginPost } from "@/app/api/admin/login/route";
import { POST as logoutPost } from "@/app/api/admin/logout/route";

describe("admin auth endpoints", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_KEY", "super-secret");
  });

  it("rejects invalid key", async () => {
    const req = new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: "nope" }),
    });
    const res = await loginPost(req);
    expect(res.status).toBe(401);
  });

  it("sets cookie on valid key", async () => {
    const req = new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: "super-secret" }),
    });
  const res = await loginPost(req);
    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
  });

  it("clears cookie on logout", async () => {
  const res = await logoutPost();
    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("Max-Age=0");
  });
});
