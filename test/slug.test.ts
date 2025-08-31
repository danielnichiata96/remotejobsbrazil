import { describe, it, expect } from "vitest";
import { getSlug, type Job } from "@/lib/jobs";

describe("slug", () => {
  it("generates a stable slug with title, company and id tail", () => {
    const job: Job = {
      id: "000000abcdef",
      title: "Senior React Developer",
      company: "Acme Inc",
      location: "Brazil (Remote)",
      applyUrl: "https://example.com",
      description: undefined,
      salary: undefined,
      type: "Full-time",
      createdAt: new Date().toISOString(),
      slug: undefined,
      tags: undefined,
    };
    const slug = getSlug(job);
    expect(slug).toBe("senior-react-developer-acme-inc-abcdef");
  });
});
