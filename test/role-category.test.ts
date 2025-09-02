import { describe, it, expect } from "vitest";
import { inferRoleCategory } from "@/lib/scoring";

describe("inferRoleCategory", () => {
  it("maps frontend keywords to engineering", () => {
    expect(inferRoleCategory({ title: "React Developer" })).toBe("engineering");
  });
  it("maps QA keywords to qa", () => {
    expect(inferRoleCategory({ title: "QA Engineer" })).toBe("qa");
  });
  it("falls back to other", () => {
    expect(inferRoleCategory({ title: "Office Manager" })).toBe("other");
  });
});
