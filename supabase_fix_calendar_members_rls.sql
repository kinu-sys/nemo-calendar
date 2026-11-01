-- Fix recursive RLS checks on public.calendar_members.
-- Run this in Supabase Dashboard > SQL Editor for the nemo-calendar project.

create or replace function public.is_calendar_member(target_calendar_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.calendar_members as cm
    where cm.calendar_id = target_calendar_id
      and cm.user_id = (select auth.uid())
  );
$$;

create or replace function public.is_calendar_owner(target_calendar_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.calendar_members as cm
    where cm.calendar_id = target_calendar_id
      and cm.user_id = (select auth.uid())
      and cm.role = 'owner'
  );
$$;

revoke all on function public.is_calendar_member(uuid) from public, anon;
revoke all on function public.is_calendar_owner(uuid) from public, anon;
grant execute on function public.is_calendar_member(uuid) to authenticated;
grant execute on function public.is_calendar_owner(uuid) to authenticated;

do $$
declare
  policy_row record;
begin
  for policy_row in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'calendar_members'
      and cmd in ('SELECT', 'DELETE')
  loop
    execute format('drop policy %I on public.calendar_members', policy_row.policyname);
  end loop;
end;
$$;

create policy "Members can view calendar members"
  on public.calendar_members for select
  using (public.is_calendar_member(calendar_id));

create policy "Owners can remove calendar members"
  on public.calendar_members for delete
  using (
    public.is_calendar_owner(calendar_id)
    or user_id = (select auth.uid())
  );

-- Replace calendar policies with an explicit, consistent set. This also
-- removes any older FOR ALL policy that could still reject calendar creation.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'calendars'
  loop
    execute format('drop policy %I on public.calendars', policy_row.policyname);
  end loop;
end;
$$;

create policy "Calendar members can view their calendars"
  on public.calendars for select
  using (public.is_calendar_member(id));

create policy "Users can create calendars for themselves"
  on public.calendars for insert
  with check (
    (select auth.uid()) is not null
    and created_by = (select auth.uid())
  );

create policy "Calendar owners can update their calendars"
  on public.calendars for update
  using (public.is_calendar_owner(id))
  with check (public.is_calendar_owner(id));

create policy "Calendar owners can delete their calendars"
  on public.calendars for delete
  using (public.is_calendar_owner(id));
