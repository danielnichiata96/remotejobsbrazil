-- Secure the search_path for the trigger function and schema-qualify trigger

CREATE OR REPLACE FUNCTION public.set_jobs_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Rebind trigger to the schema-qualified function to avoid search_path resolution
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'trg_jobs_set_updated_at' AND n.nspname = 'public' AND c.relname = 'jobs'
  ) THEN
    DROP TRIGGER trg_jobs_set_updated_at ON public.jobs;
  END IF;

  CREATE TRIGGER trg_jobs_set_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_jobs_updated_at();
END $$;
