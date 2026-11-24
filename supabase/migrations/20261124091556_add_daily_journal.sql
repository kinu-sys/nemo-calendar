create table public.daily_journal (
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  body text not null check (char_length(body) between 1 and 300 and body ~ '[^[:space:]]'),
  primary key (user_id, entry_date)
);

alter table public.daily_journal enable row level security;

revoke all on table public.daily_journal from public, anon, authenticated;
grant select, insert, update on table public.daily_journal to authenticated;

create policy "Read own journal entries"
  on public.daily_journal for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Create own journal entries"
  on public.daily_journal for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Update own journal entries"
  on public.daily_journal for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
