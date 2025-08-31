import { describe, it, expect } from "vitest";
import { normalizeTags } from "@/lib/jobs";

describe("tags normalization", () => {
  it("splits by comma/space/line and lowercases", () => {
    const out = normalizeTags("React, Node; QA\nAWS  ");
    expect(out).toEqual(["react", "node", "qa", "aws"]);
  });
  it("dedupes and trims", () => {
    const out = normalizeTags(["React", "react ", "  NODE "]);
    expect(out).toEqual(["react", "node"]);
  });
});
