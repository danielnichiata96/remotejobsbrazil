import type { Metadata } from "next";
import Link from "next/link";
import { readJobs, type Job, getSlug } from "@/lib/jobs";
import { notFound } from "next/navigation";

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
  const title = `${job.title} — ${job.company} (Remote in Brazil)`;
  const description = job.description?.slice(0, 160) || `${job.company} hiring ${job.title}.`;
  const url = siteUrl(`/jobs/${getSlug(job)}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await findBySlugOrId(slug);
  if (!job) return notFound();

  const jsonLd = jobToJsonLd(job);

  return (
    <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm">
        <Link href="/" className="underline">← Back to jobs</Link>
      </nav>
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {job.company} • {job.location} • {job.type}
      </p>
      {job.salary && (
        <p className="mt-2 text-sm"><strong>Salary:</strong> {job.salary}</p>
      )}
      {job.description && (
        <article className="prose dark:prose-invert mt-4 whitespace-pre-wrap">{job.description}</article>
      )}
      <div className="mt-6">
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Apply on company site →
        </a>
      </div>
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
  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.title,
    datePosted: job.createdAt,
    employmentType: job.type || "Full-time",
    hiringOrganization: { "@type": "Organization", name: job.company },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "Brazil" },
    directApply: true,
    validThrough: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    identifier: { "@type": "PropertyValue", value: job.id },
    hiringOrganizationUrl: job.applyUrl,
  };
}
