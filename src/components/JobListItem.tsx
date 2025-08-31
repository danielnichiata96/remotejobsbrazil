import Link from "next/link";
import type { Job } from "@/lib/jobs";
import { getSlug } from "@/lib/jobs";

export function JobListItem({ job }: { job: Job }) {
  return (
    <li className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:shadow-sm">
      <Link href={`/jobs/${getSlug(job)}`} className="font-medium text-brand dark:text-brand-400 hover:underline">
        {job.title}
      </Link>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {job.company} • {job.location} • {job.type}
      </div>
    </li>
  );
}
