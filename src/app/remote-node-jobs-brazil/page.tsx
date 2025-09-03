import { readJobsLightCached } from "@/lib/cache";
import { JobListItem } from "@/components/JobListItem";
import { Metadata } from "next";

// Enable ISR with revalidation every 10 minutes for landing pages
export const revalidate = 600; // 10 minutes

export const metadata: Metadata = {
  title: "Remote Node.js Jobs in Brazil | Remote Jobs Brazil",
  description: "Fully remote backend jobs with Node.js for professionals in Brazil.",
  alternates: { canonical: "/remote-node-jobs-brazil" },
  openGraph: {
    title: "Remote Node.js Jobs in Brazil",
    description: "Remote Node.js jobs for professionals in Brazil.",
    type: "website",
    url: "/remote-node-jobs-brazil",
  },
  twitter: { card: "summary", title: "Remote Node.js Jobs in Brazil", description: "Remote Node jobs" },
};

export default async function Page() {
  const jobs = await readJobsLightCached();
  const filtered = jobs.filter((j) =>
    (j.tags && (j.tags.includes("node") || j.tags.includes("node.js"))) || /(node|node\.js)/i.test(`${j.title} ${j.description || ""}`)
  );
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Remote Node.js Jobs in Brazil</h1>
        <p className="text-sm text-foreground/70 mb-6">
          Fully remote backend jobs with Node.js for professionals in Brazil.
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
