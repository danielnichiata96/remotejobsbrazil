import { readJobs } from "@/lib/jobs";
import { JobListItem } from "@/components/JobListItem";
import { Metadata } from "next";

// Enable ISR with revalidation every 10 minutes for landing pages
export const revalidate = 600; // 10 minutes

export const metadata: Metadata = {
  title: "Vagas Remotas de React no Brasil | Remote Jobs Brazil",
  description: "Encontre oportunidades React 100% remotas para profissionais no Brasil.",
  alternates: { canonical: "/remote-react-jobs-brazil" },
  openGraph: {
    title: "Vagas Remotas de React no Brasil",
    description: "As melhores vagas React totalmente remotas para o Brasil.",
    type: "website",
    url: "/remote-react-jobs-brazil",
  },
  twitter: { card: "summary", title: "Vagas Remotas de React no Brasil", description: "Vagas React remotas" },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const jobs = await readJobs();
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Vagas Remotas de React no Brasil</h1>
        <p className="text-sm text-foreground/70 mb-6">
          Encontre oportunidades React totalmente remotas para profissionais no Brasil.
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
