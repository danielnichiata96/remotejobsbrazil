import { type Job } from "@/lib/jobs";
import { readJobsLightCached } from "@/lib/cache";
import { Hero } from "@/components/Hero";
import JobList from "@/components/JobList";
import Pagination from "@/components/Pagination";

// Enable ISR with revalidation every 5 minutes
export const revalidate = 300; // 5 minutes

type HomePageProps = {
  // Next.js 15: searchParams should be awaited
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home(props: unknown = {}) {
  const { searchParams } = (props as HomePageProps) ?? {};
  const jobsAll: Job[] = await readJobsLightCached();
  const approved = jobsAll
    .filter(j => j.status === 'approved' || j.status === 'featured')
    .sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured));

  const sp = searchParams ? await searchParams : undefined;
  const pageParam = sp?.page;
  const perPageParam = sp?.perPage;
  const perPage = Math.min(Math.max(Number(perPageParam) || 20, 5), 50); // clamp 5..50
  const total = approved.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(Number(pageParam) || 1, 1), totalPages);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageItems = approved.slice(start, end);
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
            <JobList jobs={pageItems} />
            <div className="mt-8">
              <Pagination total={total} page={page} perPage={perPage} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
