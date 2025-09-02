import { describe, it, expect } from "vitest";
import { cn } from "@/lib/cn";

describe("cn()", () => {
  it("joins truthy classes and skips falsy", () => {
    expect(cn("a", false, null, undefined, "b", "", "c")).toBe("a b c");
  });
});
