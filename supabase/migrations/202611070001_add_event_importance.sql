alter table public.events
  add column if not exists importance text not null default 'normal'
  check (importance in ('normal', 'slight', 'important'));
