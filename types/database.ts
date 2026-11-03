export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
}

export interface Calendar {
  id: string;
  name: string;
  description: string;
  invite_code: string;
  created_by: string | null;
  created_at: string;
}

export interface CalendarMember {
  id: string;
  calendar_id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
  profiles?: Profile;
}

export interface CalendarEvent {
  id: string;
  calendar_id: string;
  date: string; // 'YYYY-MM-DD'
  title: string;
  icon_key: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  memo: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomIcon {
  id: string;
  calendar_id: string;
  key: string;
  label: string;
  created_at: string;
}

export interface IconItem {
  key: string;
  label: string;
  id?: string;
}
