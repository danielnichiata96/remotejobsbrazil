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

## 📊 Current Status (v1.0)

### ✅ Completed
- [x] **MVP Job Board**: Full CRUD operations with admin auth
- [x] **Supabase Integration**: Production-ready database with fallback
- [x] **SEO Infrastructure**: Slug URLs, JSON-LD, sitemap, RSS
- [x] **Landing Pages**: React, Node.js, QA specialized pages
- [x] **Tags System**: Categorization and filtering
- [x] **Import Tools**: Bulk job import from JSON/NDJSON
- [x] **Testing Suite**: Unit tests with CI/CD pipeline
- [x] **Production Build**: Optimized bundle, type-safe, lint-free

### 📈 Quality Metrics
- **Tests**: 4/4 passing (slug generation, tag normalization, API)
- **Build**: Zero TypeScript/ESLint errors
- **Bundle**: ~118kB optimized
- **Pages**: 14 routes (dynamic + static)
- **SEO**: Schema.org JobPosting compliance

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

## 📋 Next Steps & Roadmap

### Phase 2: Growth & SEO (Next 30 days)
- [ ] **Content Scale**: Add 50+ real remote jobs for Brazil market
- [ ] **Landing Pages**: Expand to 10+ tech stacks (Python, Java, DevOps, etc.)
- [ ] **SEO Content**: Rich job descriptions with salary ranges
- [ ] **Social Media**: Share landing pages and top jobs
- [ ] **Analytics**: Google Analytics + Search Console integration

### Phase 3: Advanced Features (30-60 days)  
- [ ] **Job Alerts**: Email subscriptions by tags/keywords
- [ ] **Advanced Filtering**: Salary range, company size, tech stack
- [ ] **Company Profiles**: Dedicated pages for recurring employers
- [ ] **Favorites System**: User job bookmarking
- [ ] **RSS by Category**: Tag-specific feeds

### Phase 4: Monetization (60-90 days)
- [ ] **Sponsored Posts**: Promoted job listings
- [ ] **Premium Job Alerts**: Advanced notification system
- [ ] **API Access**: Paid developer API with rate limiting
- [ ] **Newsletter**: Curated weekly job digest
- [ ] **Company Dashboard**: Self-service job posting portal

### Phase 5: Scale & Expansion (90+ days)
- [ ] **Multi-language**: Portuguese version for Brazilian companies
- [ ] **Location Expansion**: LATAM remote-friendly jobs
- [ ] **Mobile App**: React Native companion
- [ ] **Community Features**: Company reviews, salary insights
- [ ] **Integration**: Slack bot, Chrome extension

## 🔧 Architecture & Tech Stack

### Frontend
- **Next.js 15**: App Router, server components, dynamic rendering
- **React 19**: Latest features and performance improvements  
- **Tailwind CSS v4**: Utility-first styling with dark mode
- **TypeScript**: Full type safety across the application

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
