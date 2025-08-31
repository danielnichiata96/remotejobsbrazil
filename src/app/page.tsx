import Link from "next/link";
import { readJobs, type Job, getSlug } from "@/lib/jobs";
import { TagChip } from "@/components/TagChip";

export const dynamic = "force-dynamic";

export default async function Home() {
  const jobs: Job[] = await readJobs();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Remote Jobs Brazil</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Encontre as melhores vagas 100% remotas no Brasil.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/post"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Postar Vaga
          </Link>
        </div>
      </header>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma vaga encontrada. Seja o primeiro a postar!</p>
          <Link
            href="/post"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Postar Vaga
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all hover:shadow-md hover:border-blue-500">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href={`/jobs/${getSlug(job)}`} className="group flex-grow">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand">{job.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {job.company} • <span className="text-green-600 dark:text-green-400">{job.type}</span>
                  </p>
                </Link>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {job.salary && (
                    <span className="text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1">{job.salary}</span>
                  )}
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </a>
                </div>
              </div>
              {job.tags && job.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.tags.slice(0, 5).map((t) => (
                    <TagChip key={t} label={t} />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <section className="mt-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Buscas Populares</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link className="text-brand hover:underline dark:text-brand-400" href="/remote-react-jobs-brazil">Vagas React</Link>
          <Link className="text-brand hover:underline dark:text-brand-400" href="/remote-node-jobs-brazil">Vagas Node.js</Link>
          <Link className="text-brand hover:underline dark:text-brand-400" href="/remote-qa-jobs-brazil">Vagas QA</Link>
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
        <span>Feito com Next.js & Supabase</span>
        <a className="hover:underline" href="/feed.xml">RSS</a>
        <a className="hover:underline" href="/sitemap.xml">Sitemap</a>
        <a className="hover:underline" href="/admin">Admin</a>
      </footer>
    </div>
  );
}
