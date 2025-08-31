import Link from "next/link";
import { readJobs, getSlug } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export default async function Page() {
  const all = await readJobs();
  const jobs = all.filter((j) =>
    (j.tags && (j.tags.includes("node") || j.tags.includes("node.js"))) ||
    /(node|node\.js)/i.test(`${j.title} ${j.description || ""}`)
  );
  return (
    <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Remote Node.js Jobs in Brazil</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Remote backend roles using Node.js for candidates in Brazil.
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
