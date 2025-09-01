import 'server-only';
import { promises as fs } from "fs";
import path from "path";
import { getSupabase } from "./supabase";
import { type Job as SharedJob, getSlug as sharedGetSlug, normalizeTags as sharedNormalizeTags } from "./jobs.shared";

export type Job = SharedJob;

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "jobs.json");

// Read jobs from JSON file; if not found, return empty array
export async function readJobs(): Promise<Job[]> {
  // Try DB first
  const sb = getSupabase();
  if (sb) {
    type DbJobRow = {
      id: string;
      title: string;
      company: string;
      location: string | null;
      type: string | null;
      salary: string | null;
      apply_url: string;
      description: string | null;
      created_at: string;
      slug: string | null;
      tags: string[] | null;
    };
    const { data, error } = await sb
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
  if (!error && data && data.length) {
      // Map columns from DB to Job shape
      return (data as DbJobRow[]).map((r) => ({
        id: r.id,
        title: r.title,
        company: r.company,
        location: r.location ?? "Brazil (Remote)",
        type: r.type ?? undefined,
        salary: r.salary ?? undefined,
        applyUrl: r.apply_url,
        description: r.description ?? undefined,
        createdAt: r.created_at,
        slug: r.slug ?? undefined,
        tags: r.tags ?? undefined,
      }));
  }
  // If DB returned empty in dev, continue to file fallback below
  }

  // Fallback to JSON file
  try {
    const raw = await fs.readFile(dataFile, "utf-8");
    const jobs = JSON.parse(raw) as Job[];
    // Sort newest first
    return jobs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    // File may not exist on first run or be read-only in some environments
    return [];
  }
}

// Write jobs to JSON file; safe no-op if not possible (e.g., read-only FS)
export async function writeJobs(
  jobs: Job[]
): Promise<{ ok: boolean; error?: string }> {
  // Prefer DB bulk upsert if available
  const sb = getSupabase();
  if (sb) {
    const payload = jobs.map((j) => ({
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
    if (!error) return { ok: true };
  }

  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(
      dataFile,
      JSON.stringify(jobs, null, 2) + "\n",
      "utf-8"
    );
    return { ok: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown FS error";
    return { ok: false, error: message };
  }
}

export function validateJob(input: Partial<Job>): { ok: boolean; message?: string } {
  if (!input.title || !input.company || !input.applyUrl) {
    return { ok: false, message: "Missing required fields: title, company, applyUrl" };
  }
  // Basic URL check
  try {
    new URL(input.applyUrl!);
  } catch {
    return { ok: false, message: "applyUrl must be a valid URL" };
  }
  return { ok: true };
}

export function createJob(input: Partial<Job>): Job {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const base: Job = {
    id,
    title: input.title!,
    company: input.company!,
    location: input.location ?? "Brazil (Remote)",
    type: input.type ?? "Full-time",
    salary: input.salary ?? undefined,
    applyUrl: input.applyUrl!,
    description: input.description ?? undefined,
    createdAt: new Date().toISOString(),
  };
  const withSlugAndTags = {
    ...base,
  slug: input.slug ?? computeSlug(base),
  tags: normalizeTags(input.tags),
  } satisfies Job;
  return withSlugAndTags;
}

// Create a deterministic slug based on title, company, and the last 6 chars of id
function computeSlug(job: Pick<Job, "title" | "company" | "id">): string {
  const tail = job.id.slice(-6);
  return `${slugify(job.title)}-${slugify(job.company)}-${tail}`.toLowerCase();
}

export const getSlug = (job: Job) => sharedGetSlug(job);

function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

export const normalizeTags = (tags: unknown) => sharedNormalizeTags(tags);
