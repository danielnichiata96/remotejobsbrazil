-- Jobs table schema for Remote Jobs Brazil
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
