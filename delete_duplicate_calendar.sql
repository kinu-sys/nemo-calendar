-- Delete only the second duplicate calendar shown in the app (invite code A5D6F7).
-- This is guarded so it will not delete the calendar if it contains any events.
delete from public.calendars as c
where c.invite_code = 'A5D6F7'
  and not exists (
    select 1
    from public.events as e
    where e.calendar_id = c.id
  )
returning c.name, c.invite_code;
