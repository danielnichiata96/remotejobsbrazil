import { describe, it, expect } from "vitest";
import { JobInputSchema } from "@/lib/schema";

describe("JobInputSchema", () => {
  it("trims optional strings and normalizes tags (array)", () => {
    const parsed = JobInputSchema.parse({
      title: " Senior Dev ",
      company: " ACME ",
      applyUrl: "https://acme.com/jobs/1",
      location: "  Brazil (Remote)  ",
      type: " Full-time ",
      salary: " 100k ",
      description: "  desc  ",
      tags: [" React ", "react", " Node "],
    });
    expect(parsed.location).toBe("Brazil (Remote)");
    expect(parsed.type).toBe("Full-time");
    expect(parsed.salary).toBe("100k");
    expect(parsed.description).toBe("desc");
    expect(parsed.tags).toEqual(["react", "node"]);
  });

  it("normalizes tags (string)", () => {
    const parsed = JobInputSchema.parse({
      title: "Dev",
      company: "ACME",
      applyUrl: "https://acme.com",
      tags: "React,  Node; QA",
    });
    expect(parsed.tags).toEqual(["react", "node", "qa"]);
  });
});
