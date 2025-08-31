import Link from "next/link";
import { readJobs, getSlug } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export default async function Page() {
  const all = await readJobs();
  const jobs = all.filter((j) =>
    (j.tags && (j.tags.includes("qa") || j.tags.includes("testing") || j.tags.includes("quality"))) ||
    /(qa|quality|test)/i.test(`${j.title} ${j.description || ""}`)
  );
  return (
    <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Remote QA Jobs in Brazil</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        QA and testing roles fully remote for professionals in Brazil.
      </p>
      <ul className="space-y-3">
        {jobs.map((j) => (
          <li key={j.id} className="border rounded-md p-3">
            <Link href={`/jobs/${getSlug(j)}`} className="font-medium hover:underline">{j.title}</Link>
            <div className="text-sm text-zinc-600">{j.company} • {j.location} • {j.type}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
