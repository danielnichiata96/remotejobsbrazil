import { readJobsLightCached } from "@/lib/cache";
import { JobListItem } from "@/components/JobListItem";
import { Metadata } from "next";

// Enable ISR with revalidation every 10 minutes for landing pages
export const revalidate = 600; // 10 minutes

export const metadata: Metadata = {
  title: "Remote QA Jobs in Brazil | Remote Jobs Brazil",
  description: "Fully remote QA and testing opportunities in Brazil.",
  alternates: { canonical: "/remote-qa-jobs-brazil" },
  openGraph: {
    title: "Remote QA Jobs in Brazil",
    description: "Software testing and QA in 100% remote jobs.",
    type: "website",
    url: "/remote-qa-jobs-brazil",
  },
  twitter: { card: "summary", title: "Remote QA Jobs in Brazil", description: "Remote QA jobs" },
};

export default async function Page() {
  const jobs = await readJobsLightCached();
  const filtered = jobs.filter((j) =>
    (j.tags && (j.tags.includes("qa") || j.tags.includes("testing") || j.tags.includes("quality"))) || /(qa|quality|test)/i.test(`${j.title} ${j.description || ""}`)
  );
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Remote QA Jobs in Brazil</h1>
        <p className="text-sm text-foreground/70 mb-6">
          Fully remote QA and testing opportunities in Brazil.
        </p>
        <ul className="space-y-3">
          {filtered.map((j) => (
            <JobListItem key={j.id} job={j} />
          ))}
        </ul>
      </div>
    </div>
  );
}
