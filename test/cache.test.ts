import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => {
  return {
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
  };
});

import { createRevalidateResponse, revalidateJobs } from "@/lib/cache";
import { revalidatePath } from "next/cache";

describe("cache utils", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("createRevalidateResponse returns success payload", async () => {
    const res = createRevalidateResponse(["/"], ["jobs"]);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.paths).toEqual(["/"]);
    expect(json.tags).toEqual(["jobs"]);
  });

  it("createRevalidateResponse handles errors", async () => {
    (revalidatePath as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("boom");
    });
    const res = createRevalidateResponse(["/oops"], []);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain("boom");
  });

  it("revalidateJobs skips during tests or without NEXT_RUNTIME", async () => {
    delete (process.env as any).NEXT_RUNTIME;
    const out = await revalidateJobs();
    expect(out).toEqual({ success: true, skipped: true });
  });
});
