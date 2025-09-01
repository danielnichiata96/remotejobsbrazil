import { readJobs, type Job } from "@/lib/jobs";
import { Hero } from "@/components/Hero";
import JobList from "@/components/JobList";

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
          <aside className="md:col-span-3 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--color-foreground)]">Filters</h3>
            <div className="mt-4 space-y-3 text-sm text-[var(--color-foreground)]/70">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="size-4"/> Full-time</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="size-4"/> Part-time</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="size-4"/> Internship</label>
              <div className="pt-3 border-t border-[var(--color-border)]" />
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="size-4"/> Design</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="size-4"/> Front-end</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="size-4"/> Back-end</label>
            </div>
          </aside>

          {/* Jobs list */}
          <div className="md:col-span-9">
            <JobList jobs={jobs} />
          </div>
        </div>
      </section>
    </>
  );
}
