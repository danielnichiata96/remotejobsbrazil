import 'server-only';
import { promises as fs } from "fs";
import path from "path";
import { getSupabase } from "./supabase";
import { type Job as SharedJob, getSlug as sharedGetSlug, normalizeTags as sharedNormalizeTags, JobSource, JobStatus, ScoringFactors, RoleCategory } from "./jobs.shared";
import { inferRoleCategory } from "./scoring";

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
  curated_description: string | null;
      created_at: string;
      slug: string | null;
      tags: string[] | null;
    logo_url?: string | null;
      score: number | null;
      source: string;
      status: string | null;
      keywords_matched: string[] | null;
      scoring_factors: unknown | null;
      is_featured: boolean | null;
      crawled_at: string | null;
      curator_notes: string | null;
      original_url: string | null;
      company_size: string | null;
      experience_level: string | null;
  role_category: string | null;
    };
    const { data, error } = await sb
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length) {
      // If the table hasn't been migrated yet (columns missing), fall back to JSON file
      const sample = data[0] as Record<string, unknown>;
      const required = ["status", "curated_description", "role_category"];
      const missingColumns = required.some((c) => !(c in sample));
      if (missingColumns) {
        // proceed to file fallback below
      } else {
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
  logoUrl: (r as unknown as Record<string, unknown>).logo_url as string | undefined ?? undefined,
        curatedDescription: r.curated_description ?? undefined,
        createdAt: r.created_at,
        updatedAt: (r as any).updated_at ?? r.created_at,
        slug: r.slug ?? undefined,
        tags: r.tags ?? undefined,
        source: (r.source as JobSource) ?? 'manual',
        status: (r.status as JobStatus) ?? 'approved',
        score: r.score ?? undefined,
        keywordsMatched: r.keywords_matched ?? undefined,
        scoringFactors: r.scoring_factors as ScoringFactors ?? undefined,
        isFeatured: r.is_featured ?? false,
        crawledAt: r.crawled_at ?? undefined,
        curatorNotes: r.curator_notes ?? undefined,
        originalUrl: r.original_url ?? undefined,
        companySize: r.company_size ?? undefined,
        experienceLevel: r.experience_level ?? undefined,
        roleCategory: (r.role_category ?? undefined) as RoleCategory | undefined,
        }));
      }
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
  curated_description: j.curatedDescription ?? null,
      created_at: j.createdAt,
  updated_at: j.updatedAt ?? j.createdAt,
      slug: j.slug ?? null,
      tags: j.tags ?? null,
  logo_url: (j as unknown as Record<string, unknown>).logoUrl as string | null ?? null,
      score: j.score ?? null,
      source: j.source,
      status: j.status ?? null,
      keywords_matched: j.keywordsMatched ?? null,
      scoring_factors: j.scoringFactors ?? null,
      is_featured: j.isFeatured ?? null,
      crawled_at: j.crawledAt ?? null,
      curator_notes: j.curatorNotes ?? null,
      original_url: j.originalUrl ?? null,
      company_size: j.companySize ?? null,
      experience_level: j.experienceLevel ?? null,
  role_category: j.roleCategory ?? null,
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

// Force writing jobs to the JSON file only (used when DB schema is missing columns)
export async function writeJobsFile(jobs: Job[]): Promise<{ ok: boolean; error?: string }> {
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
  logoUrl: (input as unknown as Record<string, unknown>).logoUrl as string | undefined ?? undefined,
  curatedDescription: input.curatedDescription ?? undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: input.source ?? 'manual',
    status: input.status ?? 'approved',
    score: input.score ?? undefined,
    keywordsMatched: input.keywordsMatched ?? undefined,
    scoringFactors: input.scoringFactors ?? undefined,
    isFeatured: input.isFeatured ?? false,
    crawledAt: input.crawledAt ?? undefined,
    curatorNotes: input.curatorNotes ?? undefined,
    originalUrl: input.originalUrl ?? undefined,
    companySize: input.companySize ?? undefined,
    experienceLevel: input.experienceLevel ?? undefined,
  roleCategory: input.roleCategory ?? inferRoleCategory(input),
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
