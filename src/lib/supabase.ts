import { createClient } from "@supabase/supabase-js";

// Generic client: prefers service role, falls back to anon. Use for read-only or tolerant writes.
/**
 * Returns a Supabase client if environment variables are configured.
 * For local development, this will return undefined when SUPABASE_URL or keys are missing.
 */
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return undefined;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Service-only client: requires SUPABASE_SERVICE_ROLE. Use for RLS-protected writes.
/**
 * Returns a Supabase service-role client when the service role key is available.
 * Returns undefined in development when the service role is not configured.
 */
export function getServiceSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE; // do not ever expose this in the client
  if (!url || !key) return undefined;
  return createClient(url, key, { auth: { persistSession: false } });
}
