import Link from "next/link";
import { readJobs, type Job } from "@/lib/jobs";

export default async function Home() {
  const jobs: Job[] = await readJobs();
  return (
    <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Remote Jobs Brazil</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Trabalhos 100% remotos para o Brasil</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/import"
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Import
          </Link>
          <Link
            href="/post"
            className="inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            + Post a Job
          </Link>
        </div>
      </header>

      {jobs.length === 0 ? (
        <p className="text-zinc-600">No jobs yet. Be the first to post!</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {job.company} • {job.location} • {job.type}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {job.salary && (
                    <span className="text-xs rounded-full bg-zinc-100 dark:bg-zinc-900 px-2 py-1">{job.salary}</span>
                  )}
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline"
                  >
                    Apply →
                  </a>
                </div>
              </div>
              {job.description && (
                <p className="text-sm mt-2 text-zinc-700 dark:text-zinc-300 line-clamp-3">{job.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-12 text-xs text-zinc-500">
        Built with Next.js • Data stored in local JSON for simplicity
      </footer>
    </div>
  );
}
