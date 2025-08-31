import { readJobs } from "@/lib/jobs";
import { JobListItem } from "@/components/JobListItem";

export const dynamic = "force-dynamic";

export default async function Page() {
  const jobs = await readJobs();
  const filtered = jobs.filter((j) =>
    (j.tags && (j.tags.includes("qa") || j.tags.includes("testing") || j.tags.includes("quality"))) || /(qa|quality|test)/i.test(`${j.title} ${j.description || ""}`)
  );
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Vagas Remotas de QA no Brasil</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Oportunidades de QA e testes totalmente remotas no Brasil.
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
