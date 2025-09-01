import Link from "next/link";
import { readJobs, type Job, getSlug } from "@/lib/jobs";
import { TagChip } from "@/components/TagChip";
import { Hero } from "@/components/Hero";

// Enable ISR with revalidation every 5 minutes
export const revalidate = 300; // 5 minutes

export default async function Home() {
  const jobs: Job[] = await readJobs();
  return (
    <>
      <Hero />

      {/* Trusted by row */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-foreground)]/60 shadow-sm">
          <div>Jonanzing UI</div>
          <div>Acme Inc.</div>
          <div>Globex</div>
          <div>Umbrella</div>
        </div>
      </section>

      {/* Main content: filters + list */}
      <section id="jobs" className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar filters (placeholder to match visual) */}
          <aside className="md:col-span-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--color-foreground)]">Filtros</h3>
            <div className="mt-4 space-y-3 text-sm text-[var(--color-foreground)]/70">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="size-4"/> Tempo integral</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="size-4"/> Meio período</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="size-4"/> Estágio</label>
              <div className="pt-3 border-t border-[var(--color-border)]" />
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="size-4"/> Design</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="size-4"/> Front-end</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="size-4"/> Back-end</label>
            </div>
          </aside>

          {/* Jobs list */}
          <div className="md:col-span-9">
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-foreground)]">Últimas vagas</h2>
            {jobs.length === 0 ? (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center text-[var(--color-foreground)]/70">
                Nenhuma vaga encontrada. Seja o primeiro a postar!
                <div className="mt-4">
                  <Link href="/post" className="inline-flex items-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] hover:brightness-95">Postar vaga</Link>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                {jobs.map((job) => (
                  <li key={job.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <Link href={`/jobs/${getSlug(job)}`} className="group flex-grow">
                        <h3 className="text-base font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-foreground)]/80">{job.title}</h3>
                        <p className="text-sm text-[var(--color-foreground)]/70">
                          {job.company} • <span className="text-[var(--color-primary)]">{job.type}</span>
                        </p>
                      </Link>
                      <div className="flex items-center gap-3">
                        {job.salary && (
                          <span className="text-xs font-medium rounded-full bg-[var(--color-muted)] text-[var(--color-foreground)] px-3 py-1">{job.salary}</span>
                        )}
                        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md bg-[var(--color-accent)] text-[var(--color-accent-foreground)] px-3 py-1.5 text-sm hover:brightness-95">Candidatar-se</a>
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
          </div>
        </div>
      </section>
    </>
  );
}
