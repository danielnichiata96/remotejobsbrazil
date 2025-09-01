import { readJobs } from "@/lib/jobs";
import { JobListItem } from "@/components/JobListItem";
import { Metadata } from "next";

// Enable ISR with revalidation every 10 minutes for landing pages
export const revalidate = 600; // 10 minutes

export const metadata: Metadata = {
  title: "Vagas Remotas de Node.js no Brasil | Remote Jobs Brazil",
  description: "Vagas backend com Node.js totalmente remotas para profissionais no Brasil.",
  alternates: { canonical: "/remote-node-jobs-brazil" },
  openGraph: {
    title: "Vagas Remotas de Node.js no Brasil",
    description: "Trabalhos Node.js remotos para profissionais no Brasil.",
    type: "website",
    url: "/remote-node-jobs-brazil",
  },
  twitter: { card: "summary", title: "Vagas Remotas de Node.js no Brasil", description: "Vagas Node remotas" },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const jobs = await readJobs();
  const filtered = jobs.filter((j) =>
    (j.tags && (j.tags.includes("node") || j.tags.includes("node.js"))) || /(node|node\.js)/i.test(`${j.title} ${j.description || ""}`)
  );
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Vagas Remotas de Node.js no Brasil</h1>
        <p className="text-sm text-foreground/70 mb-6">
          Vagas backend com Node.js totalmente remotas para profissionais no Brasil.
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
