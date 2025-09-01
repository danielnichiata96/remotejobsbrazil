-- Enable RLS on leads
alter table leads enable row level security;

-- Public read (optional, remove if leads must be private)
drop policy if exists "Public read leads" on leads;
create policy "Public read leads" on leads
  for select using (true);

-- Insert restricted to service role
drop policy if exists "Service role insert leads" on leads;
create policy "Service role insert leads" on leads
  for insert
  with check (auth.role() = 'service_role');
