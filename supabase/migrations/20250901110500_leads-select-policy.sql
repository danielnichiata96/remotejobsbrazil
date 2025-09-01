-- Ensure RLS is enabled (idempotent)
alter table leads enable row level security;

-- Allow admin-only reads using the service_role
-- Safe: only server-side with SUPABASE_SERVICE_ROLE can read
-- This preserves privacy while enabling admin views and server processes

-- Clean up if it exists
DROP POLICY IF EXISTS "Service role select leads" ON leads;

-- Create secure SELECT policy
CREATE POLICY "Service role select leads" ON leads
  FOR SELECT
  USING (auth.role() = 'service_role');
