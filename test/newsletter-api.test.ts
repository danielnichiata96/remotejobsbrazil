import { describe, it, expect } from "vitest";
import { POST, DELETE, GET } from "@/app/api/newsletter/route";

function mkRequest(body: any) {
  return new Request("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("newsletter api", () => {
  it("accepts valid subscription", async () => {
    const res = await POST(mkRequest({ email: "john@doe.com", tags: ["react"], frequency: "weekly" } as any) as any);
    const json: any = await (res as Response).json();
    expect(json.success).toBe(true);
  });

  it("rejects invalid email", async () => {
    const res = await POST(mkRequest({ email: "invalid" } as any) as any);
    const json: any = await (res as Response).json();
    expect(json.success).toBe(false);
  });

  it("GET returns stats", async () => {
    const res = await GET();
    const json: any = await (res as Response).json();
    expect(json.success).toBe(true);
    expect(json.stats).toBeDefined();
  });

  it("DELETE works without token for now", async () => {
    const url = new URL("http://localhost/api/newsletter?email=john@doe.com");
    const res = await DELETE({ url: url.toString() } as any);
    const json: any = await (res as Response).json();
    expect(json.success).toBe(true);
  });
});
