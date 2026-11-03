alter table public.events
  add column if not exists start_time time,
  add column if not exists end_time time,
  add column if not exists location text,
  add column if not exists memo text;
