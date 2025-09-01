import { NextRequest, NextResponse } from "next/server";
import { createJob, readJobs, writeJobs, type Job, normalizeTags } from "@/lib/jobs";
import { JobInputSchema } from "@/lib/schema";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { logApiCall } from "@/lib/error-handling";
import { revalidateJobs } from "@/lib/cache";

export async function GET(request: NextRequest) {
  const jobs = await readJobs();
  
  const response = NextResponse.json(
    { jobs },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400', // Enhanced caching
        'Content-Type': 'application/json',
        'CDN-Cache-Control': 'public, max-age=600', // Vercel Edge Cache
      },
    }
  );

  logApiCall(request, response);
  return response;
}

export async function POST(request: NextRequest) {
  try {
    // Support both JSON and form submissions
    let data: Partial<Job> = {};
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = (await request.json()) as unknown;
      if (json && typeof json === "object") {
        const o = json as Record<string, unknown>;
        data = {
          title: typeof o.title === "string" ? o.title : undefined,
          company: typeof o.company === "string" ? o.company : undefined,
          location: typeof o.location === "string" ? o.location : undefined,
          type: typeof o.type === "string" ? o.type : undefined,
          salary: typeof o.salary === "string" ? o.salary : undefined,
          applyUrl: typeof o.applyUrl === "string" ? o.applyUrl : undefined,
          description: typeof o.description === "string" ? o.description : undefined,
          tags: normalizeTags(o.tags as unknown),
        };
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
  const obj: Partial<Job> = {};
  const title = form.get("title");
  const company = form.get("company");
  const location = form.get("location");
  const type = form.get("type");
  const salary = form.get("salary");
  const applyUrl = form.get("applyUrl");
  const description = form.get("description");
  const tagsRaw = form.get("tags");
  if (typeof title === "string") obj.title = title;
  if (typeof company === "string") obj.company = company;
  if (typeof location === "string") obj.location = location;
  if (typeof type === "string") obj.type = type;
  if (typeof salary === "string") obj.salary = salary;
  if (typeof applyUrl === "string") obj.applyUrl = applyUrl;
  if (typeof description === "string") obj.description = description;
  if (typeof tagsRaw === "string") obj.tags = normalizeTags(tagsRaw);
  data = obj;
    } else {
      const json = await request.json().catch<unknown>(() => ({}));
      if (json && typeof json === "object") {
        const o = json as Record<string, unknown>;
        data = {
          title: typeof o.title === "string" ? o.title : undefined,
          company: typeof o.company === "string" ? o.company : undefined,
          location: typeof o.location === "string" ? o.location : undefined,
          type: typeof o.type === "string" ? o.type : undefined,
          salary: typeof o.salary === "string" ? o.salary : undefined,
          applyUrl: typeof o.applyUrl === "string" ? o.applyUrl : undefined,
          description: typeof o.description === "string" ? o.description : undefined,
          tags: normalizeTags(o.tags as unknown),
        };
      }
    }

  // If ADMIN_KEY is configured, require admin cookie for creation (protects admin page)
    if (process.env.ADMIN_KEY) {
      const c = await cookies();
      const token = c.get(ADMIN_COOKIE)?.value;
      const ok = verifyAdminToken(token);
      if (!ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    // Zod validation and normalization
    const parsed = JobInputSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const jobs = await readJobs();
    const job = createJob(parsed.data);
    // Try DB insert first
    const sb = getSupabase();
    if (sb) {
      const { error } = await sb.from("jobs").insert({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type ?? null,
        salary: job.salary ?? null,
        apply_url: job.applyUrl,
        description: job.description ?? null,
        created_at: job.createdAt,
        slug: job.slug ?? null,
        tags: job.tags ?? null,
      });
      if (!error) {
        // Revalidate cache after successful job creation
        await revalidateJobs();
        return NextResponse.json({ job }, { status: 201 });
      }
    }

    // Fallback to JSON persistence
    const updated = [job, ...jobs];
    const res = await writeJobs(updated);
    if (!res.ok) {
      // Still return created job but indicate persistence issue
      return NextResponse.json(
        { job, warning: "Job created in memory only: " + res.error },
        { status: 201 }
      );
    }
    
    // Revalidate cache after successful job creation
    await revalidateJobs();
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Job creation error:', error);
    
    // Track error in Sentry
    const Sentry = await import('@sentry/nextjs');
    Sentry.withScope((scope) => {
      scope.setTag('api', true);
      scope.setContext('request', {
        url: request.url,
        method: request.method,
      });
      Sentry.captureException(error);
    });

    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { 
        error: errorMessage,
        code: 'JOB_CREATION_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
