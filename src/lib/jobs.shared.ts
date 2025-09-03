export type JobSource = 'manual' | 'greenhouse' | 'lever' | 'ashby' | 'workable' | 'other';

export type JobStatus = 'pending' | 'approved' | 'rejected' | 'featured';

export type ScoringFactors = {
  keywordMatch: number;
  locationRelevance: number;
  companyRelevance: number;
  salaryPresent: boolean;
  descriptionQuality: number;
};

export type RoleCategory =
  | 'engineering'
  | 'product'
  | 'design'
  | 'qa'
  | 'data'
  | 'marketing'
  | 'ops'
  | 'sales'
  | 'support'
  | 'other';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string; // e.g., "Brazil (Remote)"
  type?: string; // e.g., Full-time, Contract
  salary?: string; // free text
  applyUrl: string;
  description?: string;
  curatedDescription?: string; // short curated summary in PT-BR
  logoUrl?: string; // optional curated logo URL
  // Small derived field for UI: inferred company website domain (e.g., acme.com)
  companyDomain?: string;
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string for when the job was last updated
  slug?: string; // SEO-friendly slug
  tags?: string[]; // normalized, lowercase
  
  // Scoring and curation metadata
  score?: number; // 0-100, higher = more relevant
  source: JobSource; // where this job came from
  status?: JobStatus; // curation status
  keywordsMatched?: string[]; // matched keywords that boosted score
  scoringFactors?: ScoringFactors; // detailed scoring breakdown
  isFeatured?: boolean; // manually promoted jobs
  crawledAt?: string; // when it was automatically collected
  curatorNotes?: string; // manual notes from curators
  originalUrl?: string; // original job posting URL (different from apply URL)
  companySize?: string; // startup, mid-size, enterprise
  experienceLevel?: string; // junior, mid, senior, staff
  roleCategory?: RoleCategory; // primary role classification
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

// Try to infer a company domain from the original/apply URL

// Excluded host suffixes for logo fetching (covers subdomains via endsWith)
// Avoids picking ATS/crawler logos like Greenhouse/Lever/etc.
const EXCLUDED_LOGO_SUFFIXES: string[] = [
  // ATS & job boards
  "greenhouse.io",
  "lever.co",
  "ashbyhq.com",
  "workable.com",
  "myworkdayjobs.com",
  "bamboohr.com",
  "smartrecruiters.com",
  "recruitee.com",
  "jobvite.com",
  "breezy.hr",
  "applytojob.com",
  "gupy.io",
  "join.com",
  "notion.so",
  "google.com",
  // Social/shorteners often used in postings
  "linkedin.com",
  "grnh.se",
  // Local/dev/placeholder
  "localhost",
  "127.0.0.1",
  "example.com",
];

function isExcludedHost(hostname: string): boolean {
  const h = hostname.replace(/^www\./, "").toLowerCase();
  return EXCLUDED_LOGO_SUFFIXES.some((suf) => h === suf || h.endsWith(`.${suf}`));
}

export function getCompanyDomain(job: Job): string | undefined {
  // If domain is already provided, prefer it (and ensure it's not an excluded host)
  if ((job as unknown as { companyDomain?: string }).companyDomain) {
    const d = (job as unknown as { companyDomain?: string }).companyDomain!.replace(/^www\./, "").toLowerCase();
    if (d && !isExcludedHost(d)) return d;
  }

  const candidates: string[] = [];
  if (job.originalUrl) candidates.push(job.originalUrl);
  if (job.applyUrl) candidates.push(job.applyUrl);

  for (const url of candidates) {
    try {
      const u = new URL(url);
  const hostname = u.hostname.replace(/^www\./, "");
  // Exclude known ATS/crawler/placeholder hosts (handles subdomains via suffix check)
  if (!isExcludedHost(hostname)) return hostname;
    } catch {}
  }

  // 2nd pass: try to extract a company website from descriptions
  const blob = `${job.curatedDescription || ""}\n${job.description || ""}`;
  if (blob) {
    const urlRe = /https?:\/\/([a-z0-9.-]+\.[a-z]{2,})(?:[\/#?]|$)/gi;
    let m: RegExpExecArray | null;
    while ((m = urlRe.exec(blob)) !== null) {
      const host = (m[1] || "").toLowerCase();
      if (host && !isExcludedHost(host)) {
        return host.replace(/^www\./, "");
      }
    }
  }

  return undefined;
}

// Build a list of candidate logo URLs (highest quality first)
export function getLogoCandidates(job: Job): string[] {
  const list: string[] = [];
  // Curated URL has precedence if provided
  if (job.logoUrl) list.push(job.logoUrl);
  const domain = getCompanyDomain(job);
  if (domain) {
    // Clearbit Logo API (commonly used). Returns PNG/SVG depending on company.
    list.push(`https://logo.clearbit.com/${domain}?size=128`);
    // DuckDuckGo icons (ICO → browser scales fine for small sizes)
    list.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
  // Site favicon fallbacks
  list.push(`https://${domain}/favicon.ico`);
  list.push(`https://${domain}/favicon.png`);
  list.push(`https://${domain}/favicon.svg`);
  }
  return list;
}
