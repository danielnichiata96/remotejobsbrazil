import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { isAdmin } from "@/lib/auth";
import { writeJobs, type Job } from "@/lib/jobs";
import { revalidateJobs } from "@/lib/cache";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Protect this endpoint
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dataFile = path.join(process.cwd(), "data", "jobs.json");
    const raw = await fs.readFile(dataFile, "utf-8");
    const jobs = JSON.parse(raw) as Job[];

    if (!Array.isArray(jobs)) {
      return NextResponse.json({ error: "jobs.json is not an array" }, { status: 400 });
    }

    // Upsert all jobs into Supabase (writeJobs prefers DB when configured)
    const res = await writeJobs(jobs);
    if (!res.ok) {
      return NextResponse.json({ error: res.error ?? "Failed to write jobs" }, { status: 500 });
    }

    // Revalidate caches
    await revalidateJobs();

    return NextResponse.json({ ok: true, count: jobs.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
