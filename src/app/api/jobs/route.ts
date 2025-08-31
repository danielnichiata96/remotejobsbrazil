import { NextResponse } from "next/server";
import { createJob, readJobs, validateJob, writeJobs } from "@/lib/jobs";

export async function GET() {
  const jobs = await readJobs();
  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const valid = validateJob(data);
    if (!valid.ok) {
      return NextResponse.json({ error: valid.message }, { status: 400 });
    }
    const jobs = await readJobs();
    const job = createJob(data);
    const updated = [job, ...jobs];
    const res = await writeJobs(updated);
    if (!res.ok) {
      // Still return created job but indicate persistence issue
      return NextResponse.json(
        { job, warning: "Job created in memory only: " + res.error },
        { status: 201 }
      );
    }
    return NextResponse.json({ job }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Invalid JSON";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
