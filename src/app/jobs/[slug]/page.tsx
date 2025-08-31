import type { Metadata } from "next";
import Link from "next/link";
import { readJobs, type Job, getSlug } from "@/lib/jobs";
import { notFound } from "next/navigation";
import { TagChip } from "@/components/TagChip";

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
    <div className="px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
            ← Voltar
          </Link>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-gray-800 dark:text-gray-200">{job.company}</span>
          {job.location && <> • {job.location}</>}
          {job.type && (
            <> • <span className="text-green-600 dark:text-green-400">{job.type}</span></>
          )}
        </p>
        {job.salary && (
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1">{job.salary}</span>
          </p>
        )}
        {job.tags && job.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.slice(0, 8).map((t) => (
              <TagChip key={t} label={t} />
            ))}
          </div>
        )}
        {job.description && (
          <article className="prose dark:prose-invert mt-6">
            <pre className="whitespace-pre-wrap font-sans text-base leading-7">
              {job.description}
            </pre>
          </article>
        )}
        <div className="mt-8">
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-brand text-white px-5 py-2 text-sm font-medium hover:bg-brand-700"
          >
            Candidatar-se →
          </a>
        </div>
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
