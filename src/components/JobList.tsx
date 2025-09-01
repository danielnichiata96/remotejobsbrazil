"use client";
import Link from "next/link";
import { getSlug, type Job } from "@/lib/jobs";
import { TagChip } from "@/components/TagChip";
import useJobSearch from "@/hooks/useJobSearch";

export default function JobList({ jobs }: { jobs: Job[] }) {
  const { query, setQuery, results } = useJobSearch(jobs);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs, companies, tags…"
          className="w-full md:w-2/3 border border-[var(--color-border)] rounded-md px-3 py-2 bg-transparent"
        />
        <span className="text-sm text-[var(--color-foreground)]/70">{results.length} results</span>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-[var(--color-foreground)]">Latest jobs</h2>
      {results.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center text-[var(--color-foreground)]/70">
          No jobs found. Be the first to post!
          <div className="mt-4">
            <Link
              href="/post"
              className="inline-flex items-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] hover:brightness-95"
            >
              Post a job
            </Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {results.map((job: Job) => (
            <li
              key={job.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href={`/jobs/${getSlug(job)}`} className="group flex-grow">
                  <h3 className="text-base font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-foreground)]/80">
                    {job.title}
                  </h3>
                  <p className="text-sm text-[var(--color-foreground)]/70">
                    {job.company} • <span className="text-[var(--color-primary)]">{job.type}</span>
                  </p>
                </Link>
                <div className="flex items-center gap-3">
                  {job.salary && (
                    <span className="text-xs font-medium rounded-full bg-[var(--color-muted)] text-[var(--color-foreground)] px-3 py-1">
                      {job.salary}
                    </span>
                  )}
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-[var(--color-accent)] text-[var(--color-accent-foreground)] px-3 py-1.5 text-sm hover:brightness-95"
                  >
                    Apply
                  </a>
                </div>
              </div>
              {job.tags && job.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.tags.slice(0, 5).map((t: string) => (
                    <TagChip key={t} label={t} />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
