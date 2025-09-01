-- Enable RLS on leads
alter table leads enable row level security;

-- Remove any previous public read policy to keep leads private
drop policy if exists "Public read leads" on leads;

-- Insert restricted to service role (API routes use SUPABASE_SERVICE_ROLE)
drop policy if exists "Service role insert leads" on leads;
create policy "Service role insert leads" on leads
  for insert
  with check (auth.role() = 'service_role');

-- Optional: restrict SELECT to service role (safe server-side reads only)
-- Uncomment if you need to read leads from server code (never from client)
-- drop policy if exists "Service role select leads" on leads;
-- create policy "Service role select leads" on leads
--   for select using (auth.role() = 'service_role');

-- Notes:
-- - With no SELECT policy, reads are fully denied (most private).
-- - To allow admin-only reads without exposing publicly, use service_role only
--   or create a dedicated Postgres role and map it via JWT/claims.
