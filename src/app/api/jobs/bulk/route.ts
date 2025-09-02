import { NextRequest, NextResponse } from "next/server";
import { createJob, readJobs, validateJob, writeJobs, writeJobsFile, type Job } from "@/lib/jobs";
import { getSupabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import { JobStatus } from "@/lib/jobs.shared";

type BulkCreateBody = {
  jobs: Array<Partial<Job>>;
};

type BulkUpdateStatusBody = {
  action: 'update_status';
  jobIds: string[];
  status: JobStatus;
};

type BulkBody = BulkCreateBody | BulkUpdateStatusBody;

export const runtime = "nodejs";

type BulkUpdateCuratedBody = {
  action: 'update_curated';
  jobId: string;
  curatedDescription: string | null;
};

async function handleUpdateCuratedDescription(body: BulkUpdateCuratedBody): Promise<NextResponse> {
  const { jobId, curatedDescription } = body;
  if (!jobId || typeof jobId !== 'string') {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  try {
    const sb = getSupabase();
    if (sb) {
      const { error } = await sb
        .from('jobs')
        .update({ curated_description: curatedDescription ?? null })
        .eq('id', jobId);

      if (!error) {
        return NextResponse.json({ success: true, jobId, curatedDescription });
      }

      console.error('Supabase update_curated error:', error);
      if ((error as { message?: string }).message?.includes("Could not find the 'curated_description' column")) {
        const allJobs = await readJobs();
        const updatedJobs = allJobs.map(j => j.id === jobId ? { ...j, curatedDescription: curatedDescription ?? undefined } : j);
        const res = await writeJobsFile(updatedJobs);
        if (res.ok) {
          return NextResponse.json({ success: true, jobId, curatedDescription, note: 'file-only fallback' });
        }
        return NextResponse.json({ error: res.error ?? 'File write failed' }, { status: 500 });
      }

      throw error;
    }

    // Fallback to JSON file
    const allJobs = await readJobs();
    const updatedJobs = allJobs.map(j => j.id === jobId ? { ...j, curatedDescription: curatedDescription ?? undefined } : j);
    const writeResult = await writeJobs(updatedJobs);
    if (!writeResult.ok) {
      throw new Error(writeResult.error);
    }
    return NextResponse.json({ success: true, jobId, curatedDescription });
  } catch (error) {
    console.error('Failed to update curated description:', error);
    return NextResponse.json(
      { error: "Failed to update curated description" },
      { status: 500 }
    );
  }
}

async function handleUpdateStatus(body: BulkUpdateStatusBody): Promise<NextResponse> {
  const { jobIds, status } = body;

  if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
    return NextResponse.json({ error: "jobIds array is required" }, { status: 400 });
  }

  if (!['pending', 'approved', 'rejected', 'featured'].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    // Try updating in Supabase first
    const sb = getSupabase();
    if (sb) {
      const { error } = await sb
        .from('jobs')
        .update({ status })
        .in('id', jobIds);

      if (!error) {
        return NextResponse.json({
          success: true,
          updated: jobIds.length,
          message: `Updated ${jobIds.length} jobs to ${status}`
        });
      }

      // If column doesn't exist yet, fall back to file write without failing the request
      console.error('Supabase update error:', error);
      {
        const code = (error as { code?: string }).code;
        const msg = (error as { message?: string }).message;
        if (code === 'PGRST204' || msg?.includes("Could not find the 'status' column")) {
        const allJobs = await readJobs();
        const updatedJobs = allJobs.map(job => jobIds.includes(job.id) ? { ...job, status } : job);
        const res = await writeJobsFile(updatedJobs);
        if (res.ok) {
          return NextResponse.json({
            success: true,
            updated: jobIds.length,
            message: `Updated ${jobIds.length} jobs to ${status} (file-only fallback)`,
          });
        }
        return NextResponse.json({ error: res.error ?? 'File write failed' }, { status: 500 });
        }
      }

      throw error;
    }

    // Fallback to JSON file
    const allJobs = await readJobs();
    const updatedJobs = allJobs.map(job => 
      jobIds.includes(job.id) ? { ...job, status } : job
    );

  const writeResult = await writeJobs(updatedJobs);
    if (!writeResult.ok) {
      throw new Error(writeResult.error);
    }

    return NextResponse.json({
      success: true,
      updated: jobIds.length,
      message: `Updated ${jobIds.length} jobs to ${status}`
    });

  } catch (error) {
    console.error('Failed to update job status:', error);
    return NextResponse.json(
      { error: "Failed to update job status" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  let body: BulkBody | BulkUpdateCuratedBody;
  try {
    body = (await req.json()) as BulkBody | BulkUpdateCuratedBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Handle different bulk actions
  if ('action' in body) {
    // Admin-only actions
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    switch (body.action) {
      case 'update_status':
        return await handleUpdateStatus(body);
      case 'update_curated':
        return await handleUpdateCuratedDescription(body as BulkUpdateCuratedBody);
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  }

  // Original bulk create functionality
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
  logo_url: (j as unknown as Record<string, unknown>).logoUrl as string | null ?? null,
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
