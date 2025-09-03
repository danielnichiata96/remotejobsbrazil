-- Indexes to speed up common filters and array lookups on jobs

-- Array contains/overlap queries on tags benefit from GIN
create index if not exists jobs_tags_gin_idx on public.jobs using gin (tags);

-- Simple filter columns
create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists jobs_type_idx on public.jobs (type);
create index if not exists jobs_location_idx on public.jobs (location);
