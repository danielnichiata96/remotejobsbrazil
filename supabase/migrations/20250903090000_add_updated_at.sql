-- Add updated_at column and auto-update trigger for jobs table
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Backfill updated_at from created_at when null (older rows)
UPDATE jobs SET updated_at = created_at WHERE updated_at IS NULL;

-- Create or replace trigger function to set updated_at on update
CREATE OR REPLACE FUNCTION set_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_jobs_set_updated_at'
  ) THEN
    CREATE TRIGGER trg_jobs_set_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION set_jobs_updated_at();
  END IF;
END $$;

-- Index for queries by recency
CREATE INDEX IF NOT EXISTS jobs_updated_at_idx ON jobs(updated_at DESC);
