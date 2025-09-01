import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[color:oklch(1_0_0_/_0.7)] backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* thin brand bar */}
      <div className="h-0.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-[var(--color-foreground)]">Remote Jobs Brazil</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/remote-react-jobs-brazil" className="text-[var(--color-foreground)]/80 hover:text-[var(--color-foreground)]">React</Link>
          <Link href="/remote-node-jobs-brazil" className="text-[var(--color-foreground)]/80 hover:text-[var(--color-foreground)]">Node.js</Link>
          <Link href="/remote-qa-jobs-brazil" className="text-[var(--color-foreground)]/80 hover:text-[var(--color-foreground)]">QA</Link>
          <Link href="/employers" className="text-[var(--color-foreground)]/80 hover:text-[var(--color-foreground)]">For Employers</Link>
          <Link href="/post" className="inline-flex items-center rounded-md px-3 py-1.5 font-medium bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:brightness-95">Post a Job</Link>
        </nav>
      </div>
    </header>
  );
}
