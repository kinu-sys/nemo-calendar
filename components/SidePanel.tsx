'use client';

import React from 'react';
import { CalendarEvent, IconItem } from '@/types/database';
import { HandDrawnSvg } from './HandDrawnSvg';
import { Plus, Trash2, CalendarDays, Sparkles } from 'lucide-react';

interface SidePanelProps {
  selectedDateStr: string;
  dayEvents: CalendarEvent[];
  quickIcons: IconItem[];
  onOpenAddModal: (iconKey?: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onOpenIconManager: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  selectedDateStr,
  dayEvents,
  quickIcons,
  onOpenAddModal,
  onDeleteEvent,
  onOpenIconManager,
}) => {
  // 日付の表示文字列を整形 (例: 10月30日(金))
  const formatHeaderDate = (str: string) => {
    const parts = str.split('-');
    if (parts.length !== 3) return '選択した日';
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = dayNames[d.getDay()];
    return `${parseInt(parts[1], 10)}月${parseInt(parts[2], 10)}日(${dayOfWeek})の予定`;
  };

  return (
    <aside className="flex flex-col gap-4">
      {/* 選択日の予定カード */}
      <div className="bg-white rounded-3xl border border-card-border shadow-soft p-4">
        <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-dashed border-card-border">
          <div className="flex items-center gap-1.5 text-sm font-bold text-text-main">
            <CalendarDays className="w-4 h-4 text-pink-accent" />
            <span>{formatHeaderDate(selectedDateStr)}</span>
          </div>
          <button
            onClick={() => onOpenAddModal()}
            className="bg-pink-accent hover:bg-pink-hover active:scale-95 text-white font-bold px-3 py-1.5 rounded-full text-xs shadow-pink transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>予定を追加</span>
          </button>
        </div>

        {/* 予定一覧 */}
        <div className="space-y-2 min-h-[70px]">
          {dayEvents.length === 0 ? (
            <div className="text-center py-5 text-text-muted text-xs">
              <div>予定はまだありません ☕</div>
              <div className="mt-1 text-[11px] text-text-light">
                「+ 予定を追加」やアイコンから登録できます
              </div>
            </div>
          ) : (
            dayEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between bg-bg-soft border border-card-border rounded-xl p-2 text-xs"
              >
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <HandDrawnSvg iconKey={ev.icon_key} className="w-4 h-4" />
                  </span>
                  <span className="font-medium text-text-main truncate">{ev.title}</span>
                </div>
                <button
                  onClick={() => onDeleteEvent(ev.id)}
                  className="text-text-muted hover:text-sun hover:bg-red-50 p-1 rounded-md transition-all flex-shrink-0"
                  title="削除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* よく使うアイコン */}
      <div className="bg-white rounded-3xl border border-card-border shadow-soft p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1 text-xs font-bold text-text-muted">
            <Sparkles className="w-3.5 h-3.5 text-pink-accent" />
            <span>登録アイコン</span>
          </div>
          <button
            onClick={onOpenIconManager}
            className="text-[11px] font-bold text-pink-accent hover:underline"
          >
            編集
          </button>
        </div>

        <div className="grid grid-cols-5 auto-rows-[52px] gap-1.5 h-[226px] overflow-y-auto overscroll-contain pr-1">
          {quickIcons.map((item) => (
            <button
              key={item.key}
              onClick={() => onOpenAddModal(item.key)}
              className="aspect-square bg-bg-soft hover:bg-pink-soft border border-card-border hover:border-pink-border rounded-2xl p-1 flex items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-subtle group"
            >
              <div className="w-full max-w-[76px] aspect-square flex items-center justify-center group-hover:scale-105 transition-transform">
                <HandDrawnSvg iconKey={item.key} className="w-full h-full" />
              </div>
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
};
