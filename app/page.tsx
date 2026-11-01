'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Calendar, CalendarEvent, IconItem } from '@/types/database';
import { DEFAULT_ICONS } from '@/lib/constants';
import { Header } from '@/components/Header';
import { CalendarView } from '@/components/CalendarView';
import { SidePanel } from '@/components/SidePanel';
import { EventModal } from '@/components/EventModal';
import { IconManageModal } from '@/components/IconManageModal';
import { CalendarManagerModal } from '@/components/CalendarManagerModal';

// 日付キーフォーマット YYYY-MM-DD
function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function CalendarAppPage() {
  const supabase = createClient();
  const router = useRouter();

  // ユーザー & カレンダー状態
  const [user, setUser] = useState<any>(null);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [currentCalendar, setCurrentCalendar] = useState<Calendar | null>(null);

  // カレンダー表示状態
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(formatDateKey(new Date()));

  // データ状態
  const [events, setEvents] = useState<Record<string, CalendarEvent[]>>({});
  const [customIcons, setCustomIcons] = useState<IconItem[]>(DEFAULT_ICONS);
  const [loading, setLoading] = useState<boolean>(true);
  const [calendarLoadError, setCalendarLoadError] = useState<string | null>(null);
  const calendarInitStarted = useRef(false);

  // モーダル状態
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  const [eventModalIconKey, setEventModalIconKey] = useState<string | undefined>(undefined);
  const [isIconManagerOpen, setIsIconManagerOpen] = useState<boolean>(false);
  const [isCalendarManagerOpen, setIsCalendarManagerOpen] = useState<boolean>(false);

  // 1. 初期化: ユーザーとカレンダー一覧取得
  useEffect(() => {
    if (calendarInitStarted.current) return;
    calendarInitStarted.current = true;

    async function initUserAndCalendars() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // ユーザーの所属カレンダーを取得
      const { data: memberRows, error: memberErr } = await supabase
        .from('calendar_members')
        .select('calendar_id, calendars (*)')
        .eq('user_id', user.id);

      if (memberErr) {
        console.error('カレンダー取得エラー:', memberErr);
        setCalendarLoadError(`カレンダーを読み込めませんでした: ${memberErr.message}`);
        setCalendars([]);
        setCurrentCalendar(null);
        setLoading(false);
        return;
      }

      let calList: Calendar[] = [];
      if (memberRows && memberRows.length > 0) {
        calList = memberRows
          .map((r: any) => r.calendars)
          .filter(Boolean) as Calendar[];
      }

      // カレンダーが1つもない場合はデフォルトの「マイカレンダー」を作成
      if (calList.length === 0) {
        const { error: createErr } = await supabase
          .from('calendars')
          .insert({
            name: 'マイカレンダー',
            description: '個人・共有の予定',
            created_by: user.id,
          });

        if (createErr) {
          console.error('カレンダー作成エラー:', createErr);
          setCalendarLoadError(`カレンダーを作成できませんでした: ${createErr.message}`);
        }
      }

      // If the calendar was inserted, load it through the membership row
      // created by the database trigger rather than INSERT ... RETURNING.
      if (calList.length === 0) {
        const { data: refreshedMembers, error: refreshErr } = await supabase
          .from('calendar_members')
          .select('calendar_id, calendars (*)')
          .eq('user_id', user.id);

        if (refreshErr) {
          console.error('Calendar lookup after create failed:', refreshErr);
          setCalendarLoadError(`作成したカレンダーを読み込めませんでした: ${refreshErr.message}`);
        } else if (refreshedMembers) {
          calList = refreshedMembers
            .map((r: any) => r.calendars)
            .filter(Boolean) as Calendar[];
        }
      }

      setCalendars(calList);
      if (calList.length > 0) {
        setCurrentCalendar(calList[0]);
      }
      setLoading(false);
    }

    initUserAndCalendars();
  }, [router, supabase]);

  // 2. カレンダー切替時のイベント & アイコン取得 & Realtime購読
  const loadCalendarData = useCallback(async (calId: string) => {
    // イベント取得
    const { data: eventRows, error: eventErr } = await supabase
      .from('events')
      .select('*')
      .eq('calendar_id', calId);

    if (eventErr) {
      console.error('イベント取得エラー:', eventErr);
    } else if (eventRows) {
      const grouped: Record<string, CalendarEvent[]> = {};
      eventRows.forEach((ev: CalendarEvent) => {
        if (!grouped[ev.date]) grouped[ev.date] = [];
        grouped[ev.date].push(ev);
      });
      setEvents(grouped);
    }

    // アイコン取得
    const { data: iconRows, error: iconErr } = await supabase
      .from('custom_icons')
      .select('*')
      .eq('calendar_id', calId);

    if (iconErr) {
      console.error('アイコン取得エラー:', iconErr);
    } else if (iconRows && iconRows.length > 0) {
      const dbIcons: IconItem[] = iconRows.map((ic: any) => ({
        id: ic.id,
        key: ic.key,
        label: ic.label,
      }));
      setCustomIcons([...DEFAULT_ICONS, ...dbIcons]);
    } else {
      setCustomIcons(DEFAULT_ICONS);
    }
  }, [supabase]);

  useEffect(() => {
    if (!currentCalendar) return;

    loadCalendarData(currentCalendar.id);

    // Supabase Realtimeチャンネルの購読（予定の即時同期）
    const channel = supabase
      .channel(`calendar-${currentCalendar.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `calendar_id=eq.${currentCalendar.id}`,
        },
        () => {
          // 他メンバーによる追加・更新・削除を即時再同期
          loadCalendarData(currentCalendar.id);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custom_icons',
          filter: `calendar_id=eq.${currentCalendar.id}`,
        },
        () => {
          loadCalendarData(currentCalendar.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentCalendar, loadCalendarData, supabase]);

  // ナビゲーション操作
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(formatDateKey(today));
  };

  // 予定の追加
  const handleSaveEvent = async (dateStr: string, title: string, iconKey: string) => {
    if (!currentCalendar) {
      throw new Error('保存先のカレンダーが選択されていません。カレンダーを選び直してください。');
    }
    if (!user) {
      throw new Error('ログイン状態を確認できません。いったんログアウトして、もう一度ログインしてください。');
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        calendar_id: currentCalendar.id,
        date: dateStr,
        title,
        icon_key: iconKey,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('予定の保存エラー:', error);
      throw new Error(error.message);
    }

    if (data) {
      setEvents((prev) => {
        const next = { ...prev };
        if (!next[dateStr]) next[dateStr] = [];
        next[dateStr] = [...next[dateStr], data];
        return next;
      });
      return;
    }

    throw new Error('保存結果を確認できませんでした。画面を更新して予定一覧を確認してください。');
  };

  // 予定の削除
  const handleDeleteEvent = async (eventId: string) => {
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) {
      alert(`削除に失敗しました: ${error.message}`);
      return;
    }
    setEvents((prev) => {
      const next = { ...prev };
      if (next[selectedDateStr]) {
        next[selectedDateStr] = next[selectedDateStr].filter((ev) => ev.id !== eventId);
      }
      return next;
    });
  };

  // アイコン操作
  const handleAddCustomIcon = async (char: string, label: string) => {
    if (!currentCalendar) return;
    const { data, error } = await supabase
      .from('custom_icons')
      .insert({
        calendar_id: currentCalendar.id,
        key: char,
        label,
      })
      .select()
      .single();

    if (error) {
      alert(`アイコン追加に失敗しました: ${error.message}`);
      return;
    }
    if (data) {
      setCustomIcons((prev) => [
        ...prev,
        { id: data.id, key: data.key, label: data.label },
      ]);
    }
  };

  const handleDeleteCustomIcon = async (item: IconItem) => {
    if (!item.id) {
      // 初期アイコンはローカル配列から非表示にするか、確認
      if (customIcons.length <= 1) {
        alert('アイコンは最低1つ残してください');
        return;
      }
      setCustomIcons((prev) => prev.filter((i) => i.key !== item.key));
      return;
    }
    const { error } = await supabase.from('custom_icons').delete().eq('id', item.id);
    if (error) {
      alert(`アイコン削除に失敗しました: ${error.message}`);
      return;
    }
    setCustomIcons((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleResetIcons = async () => {
    if (!currentCalendar) return;
    await supabase.from('custom_icons').delete().eq('calendar_id', currentCalendar.id);
    setCustomIcons(DEFAULT_ICONS);
  };

  // カレンダー操作
  const handleCreateCalendar = async (name: string, description: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('calendars')
      .insert({
        name,
        description,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setCalendars((prev) => [...prev, data]);
      setCurrentCalendar(data);
    }
  };

  const handleJoinCalendar = async (code: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('join_calendar_by_code', { code });
    if (error || !data || !data.success) {
      return false;
    }
    // カレンダー再読み込み
    const { data: memberRows } = await supabase
      .from('calendar_members')
      .select('calendar_id, calendars (*)')
      .eq('user_id', user.id);

    if (memberRows) {
      const cals = memberRows.map((r: any) => r.calendars).filter(Boolean) as Calendar[];
      setCalendars(cals);
      const target = cals.find((c) => c.id === data.calendar_id);
      if (target) setCurrentCalendar(target);
    }
    return true;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-text-muted gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-accent" />
        <p className="text-xs font-bold">Nemo Calendar を読み込み中...</p>
      </div>
    );
  }

  if (calendarLoadError) {
    return (
      <div className="app-container flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-xl rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-bold">カレンダーを開けませんでした</p>
          <p className="mt-2 break-words">{calendarLoadError}</p>
          <p className="mt-3 text-red-600">管理者にSupabaseのカレンダー権限設定を確認してもらってください。</p>
        </div>
      </div>
    );
  }

  const selectedDayEvents = events[selectedDateStr] || [];

  return (
    <div className="app-container">
      {/* ヘッダー */}
      <Header
        currentCalendar={currentCalendar}
        calendars={calendars}
        onSelectCalendar={(cal) => setCurrentCalendar(cal)}
        onOpenCalendarManager={() => setIsCalendarManagerOpen(true)}
        onOpenIconManager={() => setIsIconManagerOpen(true)}
        userEmail={user?.email}
      />

      {/* メインコンテンツ（2カラム） */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_310px] gap-5 items-start">
        {/* 左: カレンダー */}
        <CalendarView
          currentDate={currentDate}
          selectedDateStr={selectedDateStr}
          events={events}
          onSelectDate={(d) => setSelectedDateStr(d)}
          onOpenAddModal={(d) => {
            setSelectedDateStr(d);
            setEventModalIconKey(undefined);
            setIsEventModalOpen(true);
          }}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />

        {/* 右: サイドパネル */}
        <SidePanel
          selectedDateStr={selectedDateStr}
          dayEvents={selectedDayEvents}
          quickIcons={customIcons}
          onOpenAddModal={(iconKey) => {
            setEventModalIconKey(iconKey);
            setIsEventModalOpen(true);
          }}
          onDeleteEvent={handleDeleteEvent}
          onOpenIconManager={() => setIsIconManagerOpen(true)}
        />
      </div>

      {/* 予定追加モーダル */}
      <EventModal
        isOpen={isEventModalOpen}
        dateStr={selectedDateStr}
        initialIconKey={eventModalIconKey}
        icons={customIcons}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
      />

      {/* アイコン管理モーダル */}
      <IconManageModal
        isOpen={isIconManagerOpen}
        icons={customIcons}
        onClose={() => setIsIconManagerOpen(false)}
        onAddIcon={handleAddCustomIcon}
        onDeleteIcon={handleDeleteCustomIcon}
        onResetIcons={handleResetIcons}
      />

      {/* カレンダー管理・共有モーダル */}
      <CalendarManagerModal
        isOpen={isCalendarManagerOpen}
        calendars={calendars}
        currentCalendar={currentCalendar}
        onClose={() => setIsCalendarManagerOpen(false)}
        onSelectCalendar={(cal) => setCurrentCalendar(cal)}
        onCreateCalendar={handleCreateCalendar}
        onJoinCalendar={handleJoinCalendar}
      />
    </div>
  );
}
