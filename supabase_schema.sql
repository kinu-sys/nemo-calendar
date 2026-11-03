-- ==============================================================================
-- Nemo Calendar - Supabase Database Schema
-- 複数メンバー共有・リアルタイム同期対応
-- ==============================================================================

-- 1. profiles テーブル（ユーザープロフィール）
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- サインアップ時に自動で profiles にレコードを追加する関数とトリガー
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. calendars テーブル（カレンダー）
create table if not exists public.calendars (
  id uuid default gen_random_uuid() primary key,
  name text not null default 'マイカレンダー',
  description text default '',
  invite_code text unique not null default upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  created_by uuid references auth.users on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. calendar_members テーブル（カレンダーのメンバーと権限）
create table if not exists public.calendar_members (
  id uuid default gen_random_uuid() primary key,
  calendar_id uuid references public.calendars on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (calendar_id, user_id)
);

-- カレンダー作成時に作成者を自動で owner メンバーに追加するトリガー
create or replace function public.handle_new_calendar()
returns trigger as $$
begin
  if new.created_by is not null then
    insert into public.calendar_members (calendar_id, user_id, role)
    values (new.id, new.created_by, 'owner');
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_calendar_created on public.calendars;
create trigger on_calendar_created
  after insert on public.calendars
  for each row execute procedure public.handle_new_calendar();

-- 4. events テーブル（予定）
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  calendar_id uuid references public.calendars on delete cascade not null,
  date text not null, -- 'YYYY-MM-DD'
  title text not null default '予定',
  icon_key text not null default 'cat',
  start_time time,
  end_time time,
  location text,
  memo text,
  created_by uuid references auth.users on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. custom_icons テーブル（カレンダーごとのアイコン設定）
create table if not exists public.custom_icons (
  id uuid default gen_random_uuid() primary key,
  calendar_id uuid references public.calendars on delete cascade not null,
  key text not null,
  label text not null default '予定',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 招待コードからカレンダーに参加するための安全なRPC関数
create or replace function public.join_calendar_by_code(code text)
returns json as $$
declare
  target_cal record;
  current_user_id uuid;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    return json_build_object('success', false, 'message', 'ログインが必要です');
  end if;

  select * into target_cal from public.calendars where upper(invite_code) = upper(trim(code));
  if not found then
    return json_build_object('success', false, 'message', '無効な招待コードです');
  end if;

  if exists (
    select 1 from public.calendar_members
    where calendar_id = target_cal.id and user_id = current_user_id
  ) then
    return json_build_object('success', true, 'calendar_id', target_cal.id, 'message', 'すでに参加しています');
  end if;

  insert into public.calendar_members (calendar_id, user_id, role)
  values (target_cal.id, current_user_id, 'member');

  return json_build_object('success', true, 'calendar_id', target_cal.id, 'message', 'カレンダーに参加しました');
end;
$$ language plpgsql security definer;

-- ==============================================================================
-- Row Level Security (RLS) ポリシー設定
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.calendars enable row level security;
alter table public.calendar_members enable row level security;
alter table public.events enable row level security;
alter table public.custom_icons enable row level security;

-- profiles ポリシー
create policy "誰でもプロフィールを閲覧可能"
  on public.profiles for select
  using (auth.uid() is not null);

create policy "ユーザー自身のみプロファイル更新可能"
  on public.profiles for update
  using (auth.uid() = id);

-- calendar_members ポリシー
create policy "メンバーは所属メンバー一覧を閲覧可能"
  on public.calendar_members for select
  using (
    exists (
      select 1 from public.calendar_members cm
      where cm.calendar_id = calendar_members.calendar_id and cm.user_id = auth.uid()
    )
  );

create policy "オーナーはメンバーを削除可能"
  on public.calendar_members for delete
  using (
    exists (
      select 1 from public.calendar_members cm
      where cm.calendar_id = calendar_members.calendar_id and cm.user_id = auth.uid() and cm.role = 'owner'
    ) or user_id = auth.uid()
  );

-- calendars ポリシー
create policy "所属メンバーのみカレンダーを閲覧可能"
  on public.calendars for select
  using (
    exists (
      select 1 from public.calendar_members
      where calendar_members.calendar_id = calendars.id and calendar_members.user_id = auth.uid()
    )
  );

create policy "ログインユーザーは新しいカレンダーを作成可能"
  on public.calendars for insert
  with check (auth.uid() is not null);

create policy "オーナーのみカレンダー情報を変更可能"
  on public.calendars for update
  using (
    exists (
      select 1 from public.calendar_members
      where calendar_members.calendar_id = calendars.id and calendar_members.user_id = auth.uid() and calendar_members.role = 'owner'
    )
  );

create policy "オーナーのみカレンダーを削除可能"
  on public.calendars for delete
  using (
    exists (
      select 1 from public.calendar_members
      where calendar_members.calendar_id = calendars.id and calendar_members.user_id = auth.uid() and calendar_members.role = 'owner'
    )
  );

-- events ポリシー
create policy "カレンダーメンバーは予定を閲覧可能"
  on public.events for select
  using (
    exists (
      select 1 from public.calendar_members
      where calendar_members.calendar_id = events.calendar_id and calendar_members.user_id = auth.uid()
    )
  );

create policy "カレンダーメンバーは予定を追加可能"
  on public.events for insert
  with check (
    exists (
      select 1 from public.calendar_members
      where calendar_members.calendar_id = events.calendar_id and calendar_members.user_id = auth.uid()
    )
  );

create policy "カレンダーメンバーは予定を更新可能"
  on public.events for update
  using (
    exists (
      select 1 from public.calendar_members
      where calendar_members.calendar_id = events.calendar_id and calendar_members.user_id = auth.uid()
    )
  );

create policy "カレンダーメンバーは予定を削除可能"
  on public.events for delete
  using (
    exists (
      select 1 from public.calendar_members
      where calendar_members.calendar_id = events.calendar_id and calendar_members.user_id = auth.uid()
    )
  );

-- custom_icons ポリシー
create policy "カレンダーメンバーはアイコンを閲覧可能"
  on public.custom_icons for select
  using (
    exists (
      select 1 from public.calendar_members
      where calendar_members.calendar_id = custom_icons.calendar_id and calendar_members.user_id = auth.uid()
    )
  );

create policy "カレンダーメンバーはアイコンを追加可能"
  on public.custom_icons for insert
  with check (
    exists (
      select 1 from public.calendar_members
      where calendar_members.calendar_id = custom_icons.calendar_id and calendar_members.user_id = auth.uid()
    )
  );

create policy "カレンダーメンバーはアイコンを削除可能"
  on public.custom_icons for delete
  using (
    exists (
      select 1 from public.calendar_members
      where calendar_members.calendar_id = custom_icons.calendar_id and calendar_members.user_id = auth.uid()
    )
  );

-- Realtime の有効化（events テーブル）
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.custom_icons;
