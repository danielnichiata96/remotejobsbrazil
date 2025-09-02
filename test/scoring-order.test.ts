import { describe, it, expect } from "vitest";
import { filterJobsByScore, sortJobsByRelevance } from "@/lib/scoring";
import type { Job } from "@/lib/jobs";

function makeJob(id: string, score: number, isFeatured = false, createdAt = "2024-01-01T00:00:00Z"): Job {
  return {
    id,
    title: `Job ${id}`,
    company: "ACME",
    applyUrl: "https://acme.com",
    createdAt,
    score,
    isFeatured,
    location: "Brazil (Remote)",
  } as unknown as Job; // minimal shape for these funcs
}

describe("scoring helpers", () => {
  it("filterJobsByScore keeps only >= threshold", () => {
    const jobs = [makeJob("a", 10), makeJob("b", 30), makeJob("c", 50)];
    const out = filterJobsByScore(jobs as Job[], 30);
    expect(out.map(j => j.id)).toEqual(["b", "c"]);
  });

  it("sortJobsByRelevance: featured first, then by score, then createdAt desc", () => {
    const jobs = [
      makeJob("a", 60, false, "2024-01-01T00:00:00Z"),
      makeJob("b", 90, false, "2024-01-02T00:00:00Z"),
      makeJob("c", 70, true,  "2024-01-01T12:00:00Z"),
      makeJob("d", 90, false, "2024-01-01T23:00:00Z"),
    ];
    const out = sortJobsByRelevance(jobs as Job[]);
    // c (featured), then b (score 90, newer), then d (score 90, older), then a
    expect(out.map(j => j.id)).toEqual(["c", "b", "d", "a"]);
  });
});
