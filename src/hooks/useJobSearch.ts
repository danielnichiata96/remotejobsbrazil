"use client";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import type { Job } from "@/lib/jobs";

export default function useJobSearch(allJobs: Job[]) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(allJobs, {
      includeScore: true,
      threshold: 0.35,
      keys: [
        { name: "title", weight: 0.5 },
        { name: "company", weight: 0.3 },
        { name: "tags", weight: 0.2 },
        { name: "type", weight: 0.2 },
        { name: "location", weight: 0.2 },
      ],
    });
  }, [allJobs]);

  const results: Job[] = useMemo(() => {
    const q = query.trim();
    if (!q) return allJobs;
    return fuse.search(q).map((r) => r.item);
  }, [allJobs, fuse, query]);

  return { query, setQuery, results };
}
