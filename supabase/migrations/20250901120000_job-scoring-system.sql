-- Add new columns for job scoring and curation metadata
ALTER TABLE jobs 
ADD COLUMN score INTEGER DEFAULT NULL,
ADD COLUMN source VARCHAR(50) DEFAULT 'manual',
ADD COLUMN status VARCHAR(20) DEFAULT 'approved',
ADD COLUMN keywords_matched TEXT[] DEFAULT NULL,
ADD COLUMN scoring_factors JSONB DEFAULT NULL,
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN crawled_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN curator_notes TEXT DEFAULT NULL,
ADD COLUMN original_url TEXT DEFAULT NULL,
ADD COLUMN company_size VARCHAR(50) DEFAULT NULL,
ADD COLUMN experience_level VARCHAR(50) DEFAULT NULL;
-- Curated Portuguese summary
ALTER TABLE jobs ADD COLUMN curated_description TEXT DEFAULT NULL;
-- role category (engineering, product, design, etc.)
ALTER TABLE jobs ADD COLUMN role_category VARCHAR(30) DEFAULT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS jobs_score_idx ON jobs(score DESC);
CREATE INDEX IF NOT EXISTS jobs_source_idx ON jobs(source);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE INDEX IF NOT EXISTS jobs_is_featured_idx ON jobs(is_featured);
CREATE INDEX IF NOT EXISTS jobs_crawled_at_idx ON jobs(crawled_at DESC);
CREATE INDEX IF NOT EXISTS jobs_role_category_idx ON jobs(role_category);

-- Add check constraints
ALTER TABLE jobs ADD CONSTRAINT jobs_score_range CHECK (score IS NULL OR (score >= 0 AND score <= 100));
ALTER TABLE jobs ADD CONSTRAINT jobs_source_valid CHECK (source IN ('manual', 'greenhouse', 'lever', 'ashby', 'workable', 'other'));
ALTER TABLE jobs ADD CONSTRAINT jobs_status_valid CHECK (status IN ('pending', 'approved', 'rejected', 'featured'));
-- Optional: constrain role categories to known values (commented out to avoid breaking existing data)
-- ALTER TABLE jobs ADD CONSTRAINT jobs_role_category_valid CHECK (role_category IN ('engineering','product','design','qa','data','marketing','ops','sales','support','other'));

-- Update existing manual jobs
UPDATE jobs SET source = 'manual', status = 'approved' WHERE source IS NULL;
