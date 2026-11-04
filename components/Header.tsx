'use client';

import React from 'react';
import { Calendar } from '@/types/database';
import Image from 'next/image';
import { Users, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  currentCalendar: Calendar | null;
  calendars: Calendar[];
  onSelectCalendar: (cal: Calendar) => void;
  onOpenCalendarManager: () => void;
  userEmail?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentCalendar,
  calendars,
  onSelectCalendar,
  onOpenCalendarManager,
  userEmail,
}) => {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_310px] gap-4 md:gap-5 mb-5 px-1">
      <div className="min-w-0">
        <div className="flex items-start justify-start min-h-[135px] gap-3">
          {/* 左端の猫イラスト */}
          <Image
            src="/title-cat.png?v=2"
            alt=""
            width={135}
            height={135}
            className="w-[135px] h-[135px] object-contain flex-shrink-0"
          />

          {/* 猫画像の右側にタイトル */}
          <Image
            src="/leaf-logo.png"
            alt="Nemo Calendar"
            width={300}
            height={99}
            className="w-[300px] max-w-[calc(100vw_-_180px)] h-auto object-contain flex-shrink-0"
          />
        </div>

        {/* カレンダー切り替えセレクター */}
        {currentCalendar && (
          <div className="hidden inline-flex items-center gap-1.5 bg-white border border-card-border px-3 py-1.5 rounded-2xl shadow-subtle text-xs font-bold text-text-main">
            <Users className="hidden w-3.5 h-3.5 text-pink-accent" />
            <select
              className="hidden bg-transparent outline-none cursor-pointer pr-1"
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
      <div className="flex items-center flex-wrap gap-2 justify-end md:content-start">
        {currentCalendar && (
          <button
            onClick={onOpenCalendarManager}
            className="bg-white hover:bg-pink-soft border border-card-border hover:border-pink-border text-text-main hover:text-pink-accent px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-subtle flex items-center gap-1.5"
            title="カレンダーの参加者を確認"
          >
            <Users className="w-3.5 h-3.5 text-pink-accent" />
            <span>参加者</span>
          </button>
        )}

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
