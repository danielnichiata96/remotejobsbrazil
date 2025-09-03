-- Ensure UUID generation is available
create extension if not exists pgcrypto;

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  tags text[] default '{}',
  location text,
  frequency text not null default 'weekly',
  token text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

-- Helpful indexes
create index if not exists subscriptions_created_at_idx on subscriptions (created_at desc);
create index if not exists subscriptions_is_active_idx on subscriptions (is_active);

-- Optional RLS
alter table subscriptions enable row level security;
create policy "Public read stats" on subscriptions
  for select using (true);
-- Writes restricted to service role (no insert/update/delete policy)
