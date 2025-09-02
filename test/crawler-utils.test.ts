import { describe, it, expect } from "vitest";
import { cleanText, isValidUrl, extractDomain } from "@/lib/crawlers/base";

describe("crawler utils", () => {
  it("cleanText collapses whitespace", () => {
    expect(cleanText("  Hello\n world  ")).toBe("Hello world");
    expect(cleanText(undefined)).toBe("");
  });
  it("isValidUrl validates URLs", () => {
    expect(isValidUrl("https://example.com/x")).toBe(true);
    expect(isValidUrl("not-a-url")).toBe(false);
  });
  it("extractDomain returns hostname sans www", () => {
    expect(extractDomain("https://www.example.com/x")).toBe("example.com");
    expect(extractDomain("bad url")).toBeUndefined();
  });
});
