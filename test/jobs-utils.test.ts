import { describe, it, expect } from "vitest";
import { validateJob, createJob, type Job } from "@/lib/jobs";

describe("jobs utils", () => {
  it("validateJob requires mandatory fields and valid URL", () => {
    expect(validateJob({ title: "a" }).ok).toBe(false);
    expect(validateJob({ title: "a", company: "b", applyUrl: "bad" }).ok).toBe(false);
    expect(validateJob({ title: "a", company: "b", applyUrl: "https://ok" }).ok).toBe(true);
  });

  it("createJob fills defaults, slug, and roleCategory", () => {
    const job: Job = createJob({
      title: "React Developer",
      company: "ACME",
      applyUrl: "https://acme.com",
      tags: ["React"],
    });
    expect(job.id).toBeTruthy();
    expect(job.location).toBe("Brazil (Remote)");
    expect(job.type).toBe("Full-time");
    expect(job.slug).toMatch(/react-developer-acme-/);
    expect(job.roleCategory).toBe("engineering");
  });
});
