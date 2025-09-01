import Link from "next/link";

export function SiteHeader() {
  return (
  <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-white">
      {/* thin brand bar */}
      <div className="h-0.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-[var(--color-foreground)]">Remote Jobs Brazil</Link>
        <nav className="flex items-center gap-4 text-sm text-[var(--color-foreground)]">
          <Link href="/remote-react-jobs-brazil" className="hover:text-[var(--color-foreground)]/80">React</Link>
          <Link href="/remote-node-jobs-brazil" className="hover:text-[var(--color-foreground)]/80">Node.js</Link>
          <Link href="/remote-qa-jobs-brazil" className="hover:text-[var(--color-foreground)]/80">QA</Link>
          <Link href="/employers" className="hover:text-[var(--color-foreground)]/80">For Employers</Link>
          <Link href="/post" className="inline-flex items-center rounded-md px-3 py-1.5 font-medium bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:brightness-95">Post a Job</Link>
        </nav>
      </div>
    </header>
  );
}
