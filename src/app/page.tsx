import { type Job } from "@/lib/jobs";
import { readJobsLightCached } from "@/lib/cache";
import { Hero } from "@/components/Hero";
import JobList from "@/components/JobList";
import Pagination from "@/components/Pagination";
import SidebarFilters from "@/components/SidebarFilters";

// Enable ISR with revalidation every 5 minutes
export const revalidate = 300; // 5 minutes

type HomePageProps = {
  // Next.js 15: searchParams should be awaited
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home(props: unknown = {}) {
  const { searchParams } = (props as HomePageProps) ?? {};
  const jobsAll: Job[] = await readJobsLightCached();
  const sp = searchParams ? await searchParams : undefined;
  
  // Base: only approved & featured
  let approved = jobsAll.filter(j => j.status === 'approved' || j.status === 'featured');
  
  // Server-side filtering from URL
  if (sp) {
    const text = typeof sp.search === 'string' ? sp.search.trim().toLowerCase() : '';
    const type = typeof sp.type === 'string' ? sp.type : '';
    const location = typeof sp.location === 'string' ? sp.location : '';
    const salary = typeof sp.salary === 'string' ? sp.salary : '';
    const tagsCsv = typeof sp.tags === 'string' ? sp.tags : '';
    const tags = tagsCsv ? tagsCsv.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];

    if (text) {
      approved = approved.filter(j =>
        (j.title?.toLowerCase().includes(text)) ||
        (j.company?.toLowerCase().includes(text)) ||
        (j.description?.toLowerCase().includes(text)) ||
        (j.tags?.some(t => t.toLowerCase().includes(text)))
      );
    }
    if (type) {
      approved = approved.filter(j => (j.type || '').toLowerCase().includes(type.toLowerCase()));
    }
    if (location) {
      approved = approved.filter(j => (j.location || '').toLowerCase().includes(location.toLowerCase()));
    }
    if (salary) {
      // naive ranges like 0-3000, 3000-6000, etc.
      const [minS, maxS] = salary.includes('-') ? salary.split('-') : [salary.replace('+', ''), ''];
      const min = Number(minS) || 0;
      const max = maxS ? Number(maxS) : Infinity;
      approved = approved.filter(j => {
        // assume salaries like "R$ 10.000" or "$60k-90k" => try to extract a number
        const s = (j.salary || '').replace(/[^0-9]/g, '');
        const n = Number(s) || 0;
        return n >= min && n <= max;
      });
    }
    if (tags.length > 0) {
      approved = approved.filter(j => {
        const jobTags = (j.tags || []).map(t => t.toLowerCase());
        return tags.every(t => jobTags.includes(t));
      });
    }
  }

  // Sort by featured, then newest
  approved = approved.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured));
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
          {/* Sidebar filters (interactive) */}
          <aside className="md:col-span-3 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <SidebarFilters />
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
