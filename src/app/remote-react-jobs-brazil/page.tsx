import { readJobsLightCached } from "@/lib/cache";
import { JobListItem } from "@/components/JobListItem";
import { Metadata } from "next";

// Enable ISR with revalidation every 10 minutes for landing pages
export const revalidate = 600; // 10 minutes

export const metadata: Metadata = {
  title: "Remote React Jobs in Brazil | Remote Jobs Brazil",
  description: "Find 100% remote React opportunities for professionals in Brazil.",
  alternates: { canonical: "/remote-react-jobs-brazil" },
  openGraph: {
    title: "Remote React Jobs in Brazil",
    description: "The best fully remote React jobs for Brazil.",
    type: "website",
    url: "/remote-react-jobs-brazil",
  },
  twitter: { card: "summary", title: "Remote React Jobs in Brazil", description: "Remote React jobs" },
};

export default async function Page() {
  const jobs = await readJobsLightCached();
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Remote React Jobs in Brazil</h1>
        <p className="text-sm text-foreground/70 mb-6">
          Find fully remote React opportunities for professionals in Brazil.
        </p>
        <ul className="space-y-3">
          {jobs
            .filter((j) => (j.tags && j.tags.includes("react")) || /react/i.test(`${j.title} ${j.description || ""}`))
            .map((j) => (
              <JobListItem key={j.id} job={j} />
            ))}
        </ul>
      </div>
    </div>
  );
}
