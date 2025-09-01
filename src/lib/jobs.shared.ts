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
  slug?: string; // SEO-friendly slug
  tags?: string[]; // normalized, lowercase
};

function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

function computeSlug(job: Pick<Job, "title" | "company" | "id">): string {
  const tail = job.id.slice(-6);
  return `${slugify(job.title)}-${slugify(job.company)}-${tail}`.toLowerCase();
}

export function getSlug(job: Job): string {
  return job.slug || computeSlug(job);
}

export function normalizeTags(tags: unknown): string[] | undefined {
  if (!tags) return undefined;
  if (Array.isArray(tags)) {
    const list = tags
      .filter((t): t is string => typeof t === "string")
      .flatMap((t) => splitTags(t))
      .map((t) => t.toLowerCase())
      .map((t) => t.trim())
      .filter(Boolean);
    const unique = Array.from(new Set(list));
    return unique.length ? unique : undefined;
  }
  if (typeof tags === "string") {
    const list = splitTags(tags)
      .map((t) => t.toLowerCase().trim())
      .filter(Boolean);
    const unique = Array.from(new Set(list));
    return unique.length ? unique : undefined;
  }
  return undefined;
}

function splitTags(s: string): string[] {
  // Support comma or semicolon or whitespace separated
  return s.split(/[;\,\n\t ]+/g);
}
