import Link from "next/link";
import type { Job } from "@/lib/jobs.shared";
import { getSlug } from "@/lib/jobs.shared";

export function JobListItem({ job }: { job: Job }) {
  return (
    <li className="rounded-md p-4 hover:shadow-sm bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 transition-colors">
      <Link href={`/jobs/${getSlug(job)}`} className="font-medium text-[var(--color-accent)] hover:underline">
        {job.title}
      </Link>
      <div className="text-sm text-[var(--color-foreground)]/70">
        {job.company} • {job.location} • {job.type}
      </div>
    </li>
  );
}
