export function SiteFooter() {
  return (
  <footer className="mt-16 text-center text-xs text-[var(--color-foreground)]/60 space-x-4 py-10">
      <span>Built with Next.js & Supabase</span>
      <a className="hover:underline text-[var(--color-foreground)]/80" href="/feed.xml">RSS</a>
  <a className="hover:underline text-[var(--color-foreground)]/80" href="/feed/react.xml">React Feed</a>
  <a className="hover:underline text-[var(--color-foreground)]/80" href="/feed/node.xml">Node Feed</a>
  <a className="hover:underline text-[var(--color-foreground)]/80" href="/feed/qa.xml">QA Feed</a>
      <a className="hover:underline text-[var(--color-foreground)]/80" href="/sitemap.xml">Sitemap</a>
      <a className="hover:underline text-[var(--color-foreground)]/80" href="/admin">Admin</a>
    </footer>
  );
}
