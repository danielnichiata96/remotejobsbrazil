import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 dark:text-white">Remote Jobs Brazil</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/remote-react-jobs-brazil" className="text-gray-700 hover:underline dark:text-gray-300">React</Link>
          <Link href="/remote-node-jobs-brazil" className="text-gray-700 hover:underline dark:text-gray-300">Node.js</Link>
          <Link href="/remote-qa-jobs-brazil" className="text-gray-700 hover:underline dark:text-gray-300">QA</Link>
          <Link href="/post" className="inline-flex items-center rounded-md bg-brand text-white px-3 py-1.5 font-medium hover:bg-brand-700">Postar Vaga</Link>
        </nav>
      </div>
    </header>
  );
}
