export function SiteFooter() {
  return (
    <footer className="mt-12 text-center text-xs text-gray-500 dark:text-gray-400 space-x-4 py-8">
      <span>Feito com Next.js & Supabase</span>
      <a className="hover:underline" href="/feed.xml">RSS</a>
      <a className="hover:underline" href="/sitemap.xml">Sitemap</a>
      <a className="hover:underline" href="/admin">Admin</a>
    </footer>
  );
}
