import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { signAdminToken, verifyAdminToken } from "@/lib/auth";

describe("auth utils", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_KEY", "k");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("signs and verifies a fresh token", () => {
    const now = 1_000_000; // fixed time
    // Keep current time close to token timestamp
    vi.spyOn(Date, "now").mockReturnValue(now + 1_000);
    const token = signAdminToken(now)!;
    expect(token).toBeTruthy();
    expect(verifyAdminToken(token, 10_000)).toBe(true);
  });

  it("rejects expired token", () => {
    const now = 1_000_000;
    // Move time far ahead so it expires quickly
    vi.spyOn(Date, "now").mockReturnValue(now + 10_000);
    const token = signAdminToken(now)!;
    // Too small TTL
    expect(verifyAdminToken(token, 1)).toBe(false);
  });

  it("rejects with missing key", () => {
    vi.unstubAllEnvs();
    const token = signAdminToken(Date.now());
    expect(token).toBeNull();
    expect(verifyAdminToken("abc.def", 1000)).toBe(false);
  });
});
