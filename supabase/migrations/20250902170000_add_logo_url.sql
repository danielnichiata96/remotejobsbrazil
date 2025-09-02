-- Add optional logo_url column for curated company logos
alter table jobs add column if not exists logo_url text;

-- Optional index if you plan to query by presence
-- create index if not exists jobs_logo_url_idx on jobs ((logo_url is not null));
