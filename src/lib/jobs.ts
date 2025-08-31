import { promises as fs } from "fs";
import path from "path";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string; // e.g., "Brazil (Remote)"
  type?: string; // e.g., Full-time, Contract
  salary?: string; // free text
  applyUrl: string;
  description?: string;
  createdAt: string; // ISO string
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "jobs.json");

// Read jobs from JSON file; if not found, return empty array
export async function readJobs(): Promise<Job[]> {
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
  return {
    id,
    title: input.title!,
    company: input.company!,
    location: input.location ?? "Brazil (Remote)",
    type: input.type ?? "Full-time",
    salary: input.salary ?? undefined,
    applyUrl: input.applyUrl!,
    description: input.description ?? undefined,
    createdAt: new Date().toISOString(),
  } satisfies Job;
}
