# Remote Jobs Brazil 🇧🇷

Remote Jobs Brazil — a lean, production-ready job board built with Next.js 15 + React 19 + Supabase.

## ✨ Features

### Core Functionality
- **Job Listings**: Dynamic homepage with real-time job updates
- **Slug-based URLs**: SEO-friendly job detail pages (`/jobs/react-developer-company-abc123`)
- **Tags & Filtering**: Categorization system with normalized tags
- **Bulk Import**: Import jobs from other boards (JSON/NDJSON format)
- **Admin Panel**: Protected manual job posting with authentication

### Data & Persistence  
- **Supabase Integration**: Production database with JSON fallback
- **Real-time Updates**: Dynamic rendering for fresh content
- **Data Validation**: Zod schema validation for all inputs

### SEO & Discovery
- **Rich SEO**: JSON-LD schema, meta tags, canonical URLs
- **Landing Pages**: Specialized pages for React, Node.js, QA roles
- **XML Sitemap**: Auto-generated at `/sitemap.xml`
- **RSS Feed**: Syndication at `/feed.xml`
- **Robots.txt**: Search engine directives

### Quality & Testing
- **Unit Tests**: Vitest test suite with alias support
- **CI/CD**: GitHub Actions for automated testing and builds
- **Type Safety**: Full TypeScript coverage
- **Code Quality**: ESLint with strict rules

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/pnpm/yarn

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Database Setup (Recommended)
1. Create a [Supabase](https://supabase.com) project
2. Run the schema in SQL Editor:
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

3. Configure environment variables in `.env.local`:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=your-service-role-key
ADMIN_KEY=your-secure-admin-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📊 Current Status (v1.3)

### ✅ Completed
- [x] **MVP Job Board**: Full CRUD operations with admin auth
- [x] **Supabase Integration**: Production-ready database with fallback
- [x] **SEO Infrastructure**: Slug URLs, JSON-LD, sitemap, RSS
- [x] **Landing Pages**: React, Node.js, QA specialized pages
- [x] **Tags System**: Categorization and filtering
- [x] **Import Tools**: Bulk job import from JSON/NDJSON
- [x] **Testing Suite**: Unit tests with CI/CD pipeline
- [x] **Production Build**: Optimized bundle, type-safe, lint-free
- [x] **Design System**: Brazilian-themed reusable UI components with CSS tokens
- [x] **Dark Mode**: Automatic theme switching via `prefers-color-scheme`
- [x] **Error Monitoring**: Sentry integration with client/server/edge tracking
- [x] **Analytics**: Vercel Analytics and Speed Insights for performance insights
- [x] **Error Boundaries**: React error boundaries with graceful fallbacks
- [x] **API Error Handling**: Centralized error tracking and logging
- [x] **Rate Limiting**: Upstash Redis-based API protection with fallback
- [x] **ISR Caching**: Incremental Static Regeneration for better performance
- [x] **Cache Management**: Smart invalidation and background revalidation
- [x] **Client-side Search**: Instant job search with Fuse.js

### 📈 Quality Metrics
 **Tests**: 12 files / 19 testes passando (slug generation, tag normalization, API, pages)
 **Build**: sem erros de TypeScript/ESLint no build; avisos tratados
 **Bundle (First Load)**: ~127 kB (build atual)
 **Pages**: 14+ rotas (dinâmicas + estáticas)
- **SEO**: Schema.org JobPosting compliance
- **Design**: 100% consistent theme application across all components

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

## 🧱 Client vs Server architecture

- `src/lib/jobs.shared.ts`: client-safe helpers (Job, getSlug, normalizeTags). Safe to import in components with "use client".
- `src/lib/jobs.ts`: server-only functions (readJobs/writeJobs with fs/Supabase) and re-exports of helpers. Only import in server code (routes, RSC).

This prevents bundling Node APIs into the browser and keeps SSR/ISR working. Use `@/lib/jobs.shared` on the client and `@/lib/jobs` on the server.

### Testing notes
- In unit tests, `server-only` is aliased to a no-op stub to avoid runtime throws. See `vitest.config.ts` (alias to `test/mocks/server-only.ts`).

## 🎨 Design System

### Brazilian Theme
- **Colors**: Brazil flag-inspired palette (green, yellow, blue) with neutral grays
- **Typography**: Clean, accessible font stack with proper contrast ratios
- **Components**: Reusable Button, Input, Card, Badge, Table primitives
- **Dark Mode**: Automatic switching via CSS `prefers-color-scheme`

### Theme Tokens (CSS Variables)
```css
/* Brand colors */
--color-primary: #009b3a;    /* Brazil green */
--color-secondary: #ffdf00;  /* Brazil yellow */
--color-accent: #002776;     /* Brazil blue */

/* Neutrals */
--color-background: #ffffff;
--color-foreground: #0f172a;
--color-muted: #f1f5f9;
--color-border: #e2e8f0;
```

### Component Usage
```tsx
import { Button, Input, Card, Badge } from "@/components/ui";

// Themed buttons
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="ghost">Ghost</Button>

// Consistent inputs
<Input placeholder="Themed input" />
<Label>Accessible labels</Label>

// Themed containers
<Card>
  <CardHeader>Header</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## 📋 Next Steps & Roadmap

### Phase 2A: Infrastructure & Performance (Next 7 days) 🚀
- [ ] **Error Monitoring**: Add Sentry for production error tracking
- [ ] **Analytics**: Implement Vercel Analytics or Google Analytics 4
- [ ] **Performance**: Add `loading.tsx` skeletons for remaining routes
- [ ] **Caching**: Implement ISR (Incremental Static Regeneration) for job pages
- [ ] **Rate Limiting**: Add API route protection against spam/abuse

### Phase 2B: Content & SEO (Next 14 days) 📈
- [ ] **Rich Content**: Add 20+ real Brazilian remote jobs
- [ ] **Meta Improvements**: Enhanced Open Graph images for social sharing  
- [ ] **Structured Data**: Expand JSON-LD with company/salary details
- [ ] **Sitemap**: Include lastModified dates for better crawling
- [ ] **robots.txt**: Fine-tune crawler directives

### Phase 2C: User Experience (Next 21 days) ⚡
- [ ] **Search Enhancements**: Add advanced filters and ranking; search across descriptions
- [ ] **Filtering**: Interactive filters (salary range, company size, remote level)
- [ ] **Pagination**: Handle 50+ jobs with server-side pagination  
- [ ] **Bookmarks**: Local storage job favorites (no auth required)
- [ ] **Share**: Social sharing buttons for individual jobs

### Phase 3: Advanced Features (30-60 days) 🔧
- [ ] **Job Alerts**: Email subscriptions by tags/keywords (with unsubscribe)
- [ ] **Company Profiles**: Dedicated pages for recurring employers
- [ ] **Advanced Search**: Boolean operators, location radius, salary ranges
- [ ] **Job Application Tracking**: Simple funnel analytics for employers
- [ ] **RSS Feeds**: Category-specific feeds (/feed/react.xml, /feed/node.xml)

### Phase 4: Business Features (60-90 days) 💼
- [ ] **Sponsored Posts**: Promoted job listings with payment integration
- [ ] **Employer Dashboard**: Self-service job posting with Stripe billing
- [ ] **Job Packages**: Bulk posting discounts for agencies
- [ ] **Premium Features**: Priority support, featured placements
- [ ] **API Access**: Developer API with tiered rate limiting

### Phase 5: Scale & Expansion (90+ days) 🌍
- [ ] **Multi-language**: Portuguese localization for Brazilian companies  
- [ ] **Geographic Expansion**: Argentina, Chile, Colombia remote jobs
- [ ] **Mobile App**: React Native companion with push notifications
- [ ] **Community**: Company reviews, salary transparency, team insights
- [ ] **Integrations**: Slack bot, browser extension, ATS partnerships

## 🔧 Architecture & Tech Stack

### Frontend
- **Next.js 15**: App Router, server components, dynamic rendering
- **React 19**: Latest features and performance improvements  
- **Tailwind CSS v4**: Utility-first styling with Brazilian theme tokens
- **TypeScript**: Full type safety across the application
- **Design System**: Reusable UI components with CSS custom properties

### Backend & Data
- **Supabase**: PostgreSQL database with real-time capabilities
- **API Routes**: Next.js server functions for CRUD operations
- **Zod Validation**: Runtime type checking and data sanitization
- **HMAC Auth**: Secure admin authentication with cookies

### SEO & Performance
- **Dynamic SSR**: Fresh data on every page load
- **JSON-LD**: Schema.org structured data for rich snippets  
- **Optimized Bundle**: ~118kB total with code splitting
- **Progressive Enhancement**: Works without JavaScript

### Quality Assurance
- **Vitest**: Fast unit testing with module mocking
- **GitHub Actions**: Automated CI/CD pipeline
- **ESLint**: Strict code quality enforcement
- **Type Safety**: Zero `any` types in production code

## 🔍 Data Sources & Import Guide

### Supported Formats
- **JSON Array**: `[{"title":"...","company":"...","applyUrl":"https://..."}]`
- **NDJSON**: One JSON object per line (newline-delimited)

### Common Job Board APIs
- **Greenhouse**: `https://boards.greenhouse.io/<company>?format=json`
- **Lever**: `https://jobs.lever.co/<company>?mode=json`
- **Ashby**: Use their API or export tools
- **AngelList**: Jobs API for startups
- **Remote OK**: API available for remote jobs

### Field Mapping
```javascript
// Required fields
{
  "title": "Senior React Developer",
  "company": "TechCorp", 
  "applyUrl": "https://company.com/jobs/123"
}

// Optional enrichment
{
  "location": "Brazil (Remote)",
  "type": "Full-time",
  "salary": "$60k-90k",
  "description": "Job description...",
  "tags": ["react", "typescript", "remote"]
}
```

## � Quick Implementation Guide

### Priority 1: Infrastructure (This Week) ✅ COMPLETED
```bash
# ✅ Add error monitoring
npm install @sentry/nextjs @upstash/ratelimit @upstash/redis
# ✅ Configured Sentry with client/server/edge tracking
# ✅ Implemented rate limiting with Redis fallback
# ✅ Added ISR caching with smart revalidation

# ✅ Add analytics  
npm install @vercel/analytics @vercel/speed-insights
# ✅ Added Vercel Analytics and Speed Insights
# ✅ Performance monitoring with Core Web Vitals
```

### Priority 2: Content & Discovery (Next Week)
```bash
# Add job schema validation
# Expand existing Zod schemas in src/lib/schema.ts

# Implement search functionality
npm install fuse.js  # For fuzzy search
# Create search hook: src/hooks/useJobSearch.ts

# Add more landing pages
# Create: src/app/remote-python-jobs-brazil/page.tsx
# Create: src/app/remote-devops-jobs-brazil/page.tsx
```

### Priority 3: User Experience Enhancements
```bash
# Client-side job filtering
# Create: src/components/JobFilters.tsx
# Add to home page with URLSearchParams state sync

# Job bookmarking (localStorage)
# Create: src/hooks/useBookmarks.ts
# Add bookmark buttons to JobListItem.tsx

# Social sharing
# Create: src/components/ShareButtons.tsx
# Add Open Graph image generation: src/app/api/og/route.tsx
```

## 📊 Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm start           # Production server

# Quality Assurance  
npm test            # Run test suite
npm run lint        # Code quality check

# Database (Supabase CLI)
supabase login      # Authenticate with Supabase
supabase link       # Link to project
supabase db push    # Apply migrations
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Run tests: `npm test`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push branch: `git push origin feature/amazing-feature`
6. Open Pull Request

### Code Standards
- TypeScript strict mode
- ESLint compliance
- Unit tests for utilities
- Responsive design
- Semantic HTML
- WCAG accessibility guidelines

## 🗄️ Database Schema (Supabase)

### Jobs Table
## 🔧 Quick Implementation Guide
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

### Optional Security (RLS)
```sql
-- Enable Row Level Security
alter table jobs enable row level security;

-- Allow public read access
create policy "Public read" on jobs for select using (true);

-- Restrict writes to service role only (handled by app logic)
```

### Environment Variables
```bash
# Required for Supabase integration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=your-service-role-key

# Optional for development
SUPABASE_ANON_KEY=your-anon-key

# Required for admin features  
ADMIN_KEY=your-secure-admin-key

# Required for SEO
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/danielnichiata96/remotejobsbrazil/issues)
- **Discussions**: [GitHub Discussions](https://github.com/danielnichiata96/remotejobsbrazil/discussions)
- **Updates**: Watch the repository for releases

Built with ❤️ for the Brazilian remote work community.
