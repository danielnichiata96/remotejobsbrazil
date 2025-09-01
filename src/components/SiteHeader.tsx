import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-slate-900">Remote Jobs Brazil</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/remote-react-jobs-brazil" className="text-slate-700 hover:underline">React</Link>
          <Link href="/remote-node-jobs-brazil" className="text-slate-700 hover:underline">Node.js</Link>
          <Link href="/remote-qa-jobs-brazil" className="text-slate-700 hover:underline">QA</Link>
          <Link href="/employers" className="text-slate-700 hover:underline">Para Empresas</Link>
          <Link href="/post" className="inline-flex items-center rounded-md bg-slate-900 text-white px-3 py-1.5 font-medium hover:bg-slate-700">Postar Vaga</Link>
        </nav>
      </div>
    </header>
  );
}
