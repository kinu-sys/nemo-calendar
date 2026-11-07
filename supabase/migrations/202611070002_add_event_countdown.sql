alter table public.events
  add column if not exists countdown_enabled boolean not null default false;
