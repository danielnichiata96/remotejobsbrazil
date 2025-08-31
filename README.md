Remote Jobs Brazil — a lean job board built with Next.js 15 + React 19.

Features
 - Home page lists jobs from a simple JSON file.
 - Post Job page with a form that writes to /api/jobs.
 - No database required; ideal for quick deployment to Vercel.
 - Import page to bulk add jobs from other boards (JSON/NDJSON).
 - Admin page with protected manual posting (optional, via ADMIN_KEY).
 - SEO: Job detail pages with JSON-LD, dynamic sitemap.xml, robots.txt, and RSS feed.

Quick start
1) Install dependencies
```bash
pnpm install || npm install || yarn
```
2) Run locally
```bash
npm run dev
```
3) Open http://localhost:3000

Add a job
 - Go to /post and submit the form. Jobs are saved to data/jobs.json (when the filesystem is writable). On serverless read-only FS, the job still posts in-memory for that request.

Bulk import jobs
- Go to /import and paste:
	- JSON array: `[{"title":"...","company":"...","applyUrl":"https://..."}]`
	- Or NDJSON (one JSON per line)
- Required fields: title, company, applyUrl. Optional: location, type, salary, description.

Tips for common sources
- Greenhouse: Many companies expose jobs JSON at `https://boards.greenhouse.io/<company>?format=json`. Map fields to this app’s format and paste into /import.
- Ashby: Use their Job Board API or export tools to get JSON, then map to { title, company, applyUrl, location?, type?, salary?, description? }.

API
 - GET /api/jobs → { jobs: Job[] }
 - POST /api/jobs { title, company, applyUrl, location?, type?, salary?, description? } → { job }

Deploy to Vercel
 - Push this repo to GitHub and import it in Vercel. No extra config needed.
	- Set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` for correct sitemap/OG/RSS absolute URLs.

Launch checklist
- [ ] Configure `NEXT_PUBLIC_SITE_URL` e `ADMIN_KEY` em Vercel
- [ ] Adicione 10–20 vagas reais (em inglês) via `/admin` ou `/import`
- [ ] Atualize títulos/descrições com stack + senioridade + salary range
- [ ] Teste `/sitemap.xml`, `/robots.txt`, `/feed.xml`
- [ ] Conecte Google Search Console e Bing Webmaster Tools (submeta o sitemap)
- [ ] Linke as landing pages na home (já feito) e em redes sociais

Notes
 - For persistent data in production, consider a hosted DB (e.g., Vercel Postgres, Supabase) later. The lib is isolated in src/lib/jobs.ts so you can swap the storage.
 - Import endpoint: POST /api/jobs/bulk with `{ jobs: Partial<Job>[] }`.
 - Admin manual posting: set `ADMIN_KEY` in your `.env.local` (and Vercel env). Then use `/admin` to login and create jobs. When `ADMIN_KEY` is set, the POST `/api/jobs` requires an admin cookie.
	- RSS feed at `/feed.xml` for syndication. Sitemap at `/sitemap.xml`. Robots at `/robots.txt`.

Supabase (opcional, recomendado para produção)
1) Crie um projeto no Supabase e copie as chaves/URL.
2) Crie a tabela `jobs` (SQL):
```sql
create table if not exists jobs (
	id text primary key,
	title text not null,
	company text not null,
	location text,
	type text,
	salary text,
	apply_url text not null,
	description text,
	created_at timestamptz not null default now(),
	slug text,
	tags text[]
);
create index if not exists jobs_created_at_idx on jobs (created_at desc);
create index if not exists jobs_slug_idx on jobs (slug);
```
3) Defina variáveis de ambiente:
	 - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE` (server) e/ou `SUPABASE_ANON_KEY` (dev)
4) O app tenta usar Supabase primeiro e cai para JSON se não estiver configurado.
  
 Políticas (opcional, produção):
 - Ative RLS na tabela `jobs` e crie policy de leitura pública se quiser expor leitura no cliente:
 ```sql
 alter table jobs enable row level security;
 create policy "Public read" on jobs for select using (true);
 ```
 - Mantenha `SUPABASE_SERVICE_ROLE` apenas no backend (não use no cliente).


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:


You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
