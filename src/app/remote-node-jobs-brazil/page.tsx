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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Vagas Remotas de Node.js no Brasil</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Vagas backend com Node.js totalmente remotas para profissionais no Brasil.
        </p>
        <ul className="space-y-3">
          {jobs.map((j) => (
            <li key={j.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:shadow-sm">
              <Link href={`/jobs/${getSlug(j)}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">{j.title}</Link>
              <div className="text-sm text-gray-600 dark:text-gray-400">{j.company} • {j.location} • {j.type}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
