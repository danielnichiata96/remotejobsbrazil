-- Make array default explicit to avoid ambiguity in some Postgres tooling
-- Safe, no data rewrite; only adjusts the default expression.

alter table if exists subscriptions
  alter column tags set default '{}'::text[];
