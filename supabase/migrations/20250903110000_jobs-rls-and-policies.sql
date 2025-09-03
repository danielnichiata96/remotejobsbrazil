-- Enable Row Level Security for jobs and add read-only public policy
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can select)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'jobs' AND policyname = 'Public read'
  ) THEN
    CREATE POLICY "Public read" ON jobs FOR SELECT USING (true);
  END IF;
END $$;

-- Optional: restrict inserts/updates/deletes to service role (handled at app level)
-- You can also add policies that check auth.jwt() when using anon keys.
