export function SiteFooter() {
  return (
  <footer className="mt-16 text-center text-xs text-slate-500 space-x-4 py-10">
      <span>Feito com Next.js & Supabase</span>
      <a className="hover:underline" href="/feed.xml">RSS</a>
      <a className="hover:underline" href="/sitemap.xml">Sitemap</a>
      <a className="hover:underline" href="/admin">Admin</a>
    </footer>
  );
}
