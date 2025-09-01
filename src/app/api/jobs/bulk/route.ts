import { NextResponse } from "next/server";
import { createJob, readJobs, validateJob, writeJobs, type Job } from "@/lib/jobs";
import { getSupabase } from "@/lib/supabase";

type BulkBody = {
  jobs: Array<Partial<Job>>;
};

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: BulkBody;
  try {
    body = (await req.json()) as BulkBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.jobs)) {
    return NextResponse.json({ error: "Expected 'jobs' array" }, { status: 400 });
  }

  const existing = await readJobs();
  const created: Job[] = [];
  const errors: Array<{ index: number; message: string }> = [];

  body.jobs.forEach((raw, index) => {
    const valid = validateJob(raw);
    if (!valid.ok) {
      errors.push({ index, message: valid.message ?? "Invalid job" });
      return;
    }
    const job = createJob(raw);
    created.push(job);
  });

  // Try DB bulk insert
  const sb = getSupabase();
  if (sb && created.length) {
    const payload = created.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      type: j.type ?? null,
      salary: j.salary ?? null,
      apply_url: j.applyUrl,
      description: j.description ?? null,
      created_at: j.createdAt,
      slug: j.slug ?? null,
      tags: j.tags ?? null,
    }));
    const { error } = await sb.from("jobs").upsert(payload, { onConflict: "id" });
    if (!error) {
      return NextResponse.json(
        { created: created.map((j) => j.id), errors },
        { status: created.length ? 201 : 400 }
      );
    }
  }

  // Fallback to JSON
  const updated = [...created, ...existing];
  const res = await writeJobs(updated);
  return NextResponse.json(
    { created: created.map((j) => j.id), errors, warning: res.ok ? undefined : `Persistence warning: ${res.error}` },
    { status: created.length ? 201 : 400 }
  );
}
