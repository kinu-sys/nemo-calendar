alter table public.daily_journal
  add constraint daily_journal_body_150_check
  check (char_length(body) between 1 and 150 and body ~ '[^[:space:]]');

alter table public.daily_journal
  drop constraint daily_journal_body_check;
