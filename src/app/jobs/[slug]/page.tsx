import type { Metadata } from "next";
import Link from "next/link";
import { readJobs, type Job, getSlug } from "@/lib/jobs";
import { notFound } from "next/navigation";
import { TagChip } from "@/components/TagChip";
import { CompanyLogo } from "@/components/CompanyLogo";

type Props = { params: Promise<{ slug: string }> };

function siteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return base.replace(/\/$/, "") + path;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await findBySlugOrId(slug);
  if (!job) return {};
  const title = `${job.title} — ${job.company} (Remoto para Brasil)`;
  const description = job.curatedDescription?.slice(0, 160) || job.description?.slice(0, 160) || `${job.company} contratando ${job.title}.`;
  const url = siteUrl(`/jobs/${getSlug(job)}`);
  
  // Generate OG image URL with job details
  const ogImageUrl = `/api/og?${new URLSearchParams({
    title: job.title,
    company: job.company,
    location: job.location || 'Brazil (Remote)',
    type: job.type || 'Full-time',
    ...(job.salary && { salary: job.salary }),
  }).toString()}`;
  
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { 
      title, 
      description, 
      url, 
    type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
      alt: `${job.title} na ${job.company} - Vaga remota para Brasil`,
        },
      ],
    },
    twitter: { 
      card: "summary_large_image", 
      title, 
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await findBySlugOrId(slug);
  if (!job) return notFound();

  const jsonLd = jobToJsonLd(job);
  const { related } = await getRelatedJobs(job);
  const safeDescription = sanitizeDescription(job.description);

  return (
    <div className="px-6 py-10 bg-background text-foreground">
      <div className="max-w-3xl mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-[var(--color-accent)] hover:underline">
            ← Back
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <CompanyLogo job={job} size={44} className="shrink-0" />
          <h1 className="text-3xl font-bold">{job.title}</h1>
        </div>
        <p className="mt-2 text-sm text-foreground/70">
          <span className="font-medium text-foreground">{job.company}</span>
          {job.location && <> • {job.location}</>}
          {job.type && (
            <> • <span className="text-[var(--color-primary)]">{job.type}</span></>
          )}
        </p>
        {job.salary && (
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-foreground/80">
            <span className="rounded-full bg-[var(--color-muted)] px-2 py-1">{job.salary}</span>
          </p>
        )}
        {job.tags && job.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.slice(0, 8).map((t) => (
              <TagChip key={t} label={t} />
            ))}
          </div>
        )}
        {/* Curadoria em PT-BR (se disponível) */}
    {job.curatedDescription && (
          <section className="prose dark:prose-invert mt-6">
            <h2>Resumo da Vaga (PT-BR)</h2>
      <p className="whitespace-pre-wrap">{job.curatedDescription}</p>
          </section>
        )}
        {/* Trecho da descrição original (inglês) */}
    {safeDescription && (
          <section className="prose dark:prose-invert mt-6">
            <h3>Descrição original (EN)</h3>
            <pre className="whitespace-pre-wrap font-sans text-base leading-7">
      {safeDescription.slice(0, 1400)}{safeDescription.length > 1400 ? '…' : ''}
            </pre>
          </section>
        )}
    <div className="mt-8">
          <a
            href={withUtm(job.applyUrl)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              try {
                // Lazy import to avoid affecting SSR
                import("@vercel/analytics").then(({ track }) => {
                  try {
                    track("apply_click", {
                      job_id: job.id,
                      company: job.company,
                      title: job.title,
                      roleCategory: job.roleCategory || "unknown",
                    });
                  } catch {}
                }).catch(() => {});
              } catch {}
            }}
      className="inline-flex items-center justify-center rounded-md bg-[var(--color-accent)] text-[var(--color-accent-foreground)] px-5 py-2 text-sm font-medium hover:brightness-95"
          >
            Apply →
          </a>
        </div>
      </div>
      {/* Related jobs */}
      {related.length > 0 && (
        <div className="max-w-3xl mx-auto mt-8">
          <h3 className="text-lg font-semibold mb-3">Vagas relacionadas</h3>
          <ul className="space-y-2">
            {related.slice(0, 6).map((r) => (
              <li key={r.id}>
                <Link className="underline" href={`/jobs/${getSlug(r)}`}>
                  {r.title} — {r.company}
                </Link>
                {r.location && <span className="text-sm text-foreground/70"> • {r.location}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

async function findBySlugOrId(slugOrId: string): Promise<Job | undefined> {
  const jobs = await readJobs();
  return (
    jobs.find((j) => getSlug(j) === slugOrId) || jobs.find((j) => j.id === slugOrId)
  );
}

function jobToJsonLd(job: Job) {
  const base: any = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
  description: job.curatedDescription || job.description || job.title,
    inLanguage: "pt-BR",
    datePosted: job.createdAt,
    employmentType: job.type || "Full-time",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: job.applyUrl,
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "BR" },
    directApply: true,
    validThrough: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    identifier: { "@type": "PropertyValue", value: job.id, name: job.company },
    // Provide a canonical URL for the job posting
    url: siteUrl(`/jobs/${getSlug(job)}`),
  };
  if (job.salary) {
    // Use a safe schema property to include free-form salary text
    base.estimatedSalary = job.salary;
  }
  if (job.roleCategory) {
    base.occupationalCategory = job.roleCategory;
  }
  return base;
}
function sanitizeDescription(desc?: string): string {
  if (!desc) return '';
  try {
    // Very simple sanitize: strip script/style tags and collapse whitespace
    const cleaned = desc
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned;
  } catch {
    return desc;
  }
}

async function getRelatedJobs(job: Job): Promise<{ related: Job[]; all: Job[] }> {
  const all = await readJobs();
  const tagSet = new Set((job.tags || []).map((t) => t.toLowerCase()));
  const related = all
    .filter((j) => j.id !== job.id)
    .filter((j) => {
      if (job.roleCategory && j.roleCategory === job.roleCategory) return true;
      if (!tagSet.size) return false;
      return (j.tags || []).some((t) => tagSet.has(String(t).toLowerCase()));
    })
    .slice(0, 12);
  return { related, all };
}

function withUtm(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.get('utm_source')) u.searchParams.set('utm_source', 'remotejobsbrazil');
    if (!u.searchParams.get('utm_medium')) u.searchParams.set('utm_medium', 'job_board');
    if (!u.searchParams.get('utm_campaign')) u.searchParams.set('utm_campaign', 'apply_button');
    return u.toString();
  } catch {
    return url;
  }
}
