create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  company text,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);
