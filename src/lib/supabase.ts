import { createClient } from "@supabase/supabase-js";

// Generic client: prefers service role, falls back to anon. Use for read-only or tolerant writes.
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Service-only client: requires SUPABASE_SERVICE_ROLE. Use for RLS-protected writes.
export function getServiceSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE; // do not ever expose this in the client
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
