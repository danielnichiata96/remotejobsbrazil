import Link from "next/link";
import type { Job } from "@/lib/jobs.shared";
import { getSlug } from "@/lib/jobs.shared";
import { CompanyLogo } from "@/components/CompanyLogo";

export function JobListItem({ job }: { job: Job }) {
  return (
    <li className="rounded-md p-4 hover:shadow-sm bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 transition-colors">
      <div className="flex items-start gap-3">
        <CompanyLogo job={job} size={36} className="shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link href={`/jobs/${getSlug(job)}`} className="font-medium text-[var(--color-accent)] hover:underline line-clamp-1">
              {job.title}
            </Link>
            {job.isFeatured ? (
              <span className="inline-flex items-center rounded-full bg-[var(--color-secondary)]/20 text-[var(--color-foreground)] text-[10px] px-2 py-0.5 border border-[var(--color-secondary)]/40 uppercase tracking-wide">
                Featured
              </span>
            ) : null}
          </div>
          <div className="text-sm text-[var(--color-foreground)]/70 truncate">
            {job.company} • {job.location} • {job.type}
          </div>
        </div>
      </div>
    </li>
  );
}
