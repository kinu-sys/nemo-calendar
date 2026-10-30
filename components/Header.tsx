'use client';

import React from 'react';
import { HandDrawnSvg } from './HandDrawnSvg';
import { Calendar } from '@/types/database';
import { Settings, Users, LogOut, Share2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  currentCalendar: Calendar | null;
  calendars: Calendar[];
  onSelectCalendar: (cal: Calendar) => void;
  onOpenCalendarManager: () => void;
  onOpenIconManager: () => void;
  userEmail?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentCalendar,
  calendars,
  onSelectCalendar,
  onOpenCalendarManager,
  onOpenIconManager,
  userEmail,
}) => {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const copyInviteCode = () => {
    if (currentCalendar?.invite_code) {
      navigator.clipboard.writeText(currentCalendar.invite_code);
      alert(`招待コード【 ${currentCalendar.invite_code} 】をクリップボードにコピーしました！仲間に共有してください。`);
    }
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 px-1">
      {/* ロゴ & カレンダー選択 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-11 h-11 bg-white border border-card-border rounded-full flex items-center justify-center shadow-subtle">
            <HandDrawnSvg iconKey="cat" className="w-7 h-7" />
          </span>
          <h1 className="font-quicksand font-bold text-2xl tracking-wide text-pink-accent">
            Nemo Calendar
          </h1>
        </div>

        {/* カレンダー切り替えセレクター */}
        {currentCalendar && (
          <div className="flex items-center gap-1.5 ml-1 sm:ml-4 bg-white border border-card-border px-3 py-1.5 rounded-2xl shadow-subtle text-xs font-bold text-text-main">
            <Users className="w-3.5 h-3.5 text-pink-accent" />
            <select
              className="bg-transparent outline-none cursor-pointer pr-1"
              value={currentCalendar.id}
              onChange={(e) => {
                const found = calendars.find((c) => c.id === e.target.value);
                if (found) onSelectCalendar(found);
              }}
            >
              {calendars.map((cal) => (
                <option key={cal.id} value={cal.id}>
                  {cal.name}
                </option>
              ))}
            </select>
            <button
              onClick={onOpenCalendarManager}
              className="ml-1 text-[11px] text-pink-accent hover:underline px-1 py-0.5"
              title="カレンダーの管理・共有・新規追加"
            >
              管理
            </button>
          </div>
        )}
      </div>

      {/* アクションボタン群 */}
      <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
        {currentCalendar && (
          <button
            onClick={copyInviteCode}
            className="bg-white hover:bg-pink-soft border border-card-border hover:border-pink-border text-text-main hover:text-pink-accent px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-subtle flex items-center gap-1.5"
            title="招待コードをコピーしてメンバーを招待"
          >
            <Share2 className="w-3.5 h-3.5 text-pink-accent" />
            <span>招待: {currentCalendar.invite_code}</span>
          </button>
        )}

        <button
          onClick={onOpenIconManager}
          className="bg-white hover:bg-pink-soft border border-card-border hover:border-pink-border text-text-main hover:text-pink-accent px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-subtle flex items-center gap-1.5"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>アイコン管理</span>
        </button>

        <button
          onClick={handleLogout}
          className="bg-white hover:bg-red-50 border border-card-border hover:border-red-200 text-text-muted hover:text-red-500 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-subtle flex items-center gap-1"
          title={`ログイン中: ${userEmail || ''}`}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ログアウト</span>
        </button>
      </div>
    </header>
  );
};
