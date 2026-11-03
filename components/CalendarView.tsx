'use client';

import React from 'react';
import { CalendarEvent } from '@/types/database';
import { HandDrawnSvg } from './HandDrawnSvg';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  currentDate: Date;
  selectedDateStr: string;
  events: Record<string, CalendarEvent[]>;
  onSelectDate: (dateStr: string) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  onOpenAddModal: (dateStr: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  selectedDateStr,
  events,
  onSelectDate,
  onSelectEvent,
  onOpenAddModal,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();

  const realToday = new Date();
  const isCurrentMonth = realToday.getFullYear() === year && realToday.getMonth() === month;

  // 前月のパディング日数
  const prevDays = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    prevDays.push(prevLastDate - i);
  }

  // 当月の日付
  const currentMonthDays = [];
  for (let day = 1; day <= lastDate; day++) {
    const dayOfWeek = new Date(year, month, day).getDay();
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    currentMonthDays.push({
      day,
      dayOfWeek,
      dateKey,
      isToday: isCurrentMonth && realToday.getDate() === day,
      isSelected: dateKey === selectedDateStr,
      dayEvents: events[dateKey] || [],
    });
  }

  return (
    <section className="flex flex-col">
      {/* 月ナビゲーション */}
      <div className="flex justify-between items-center mb-3.5 px-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onPrevMonth}
            className="bg-white hover:bg-pink-soft border border-card-border hover:border-pink-border px-3.5 py-1.5 rounded-full text-xs font-bold text-text-main hover:text-pink-accent shadow-subtle flex items-center gap-1 transition-all"
            title="前月"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>前月</span>
          </button>
          <div className="text-[40px] leading-none font-bold text-text-main tracking-wider px-1">
            {year}年 {month + 1}月
          </div>
          <button
            onClick={onNextMonth}
            className="bg-white hover:bg-pink-soft border border-card-border hover:border-pink-border px-3.5 py-1.5 rounded-full text-xs font-bold text-text-main hover:text-pink-accent shadow-subtle flex items-center gap-1 transition-all"
            title="翌月"
          >
            <span>翌月</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <button
            onClick={onToday}
            className="bg-pink-soft hover:bg-pink-accent text-pink-accent hover:text-white border border-pink-border hover:border-pink-accent px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-subtle"
          >
            今日
          </button>
        </div>
      </div>

      {/* カレンダー本体 */}
      <div className="bg-white rounded-3xl border border-card-border shadow-soft overflow-hidden">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 bg-[#e8eee5] border-b border-card-border text-center text-[16px] py-2.5 font-bold text-weekday">
          <div className="text-sun">日</div>
          <div>月</div>
          <div>火</div>
          <div>水</div>
          <div>木</div>
          <div>金</div>
          <div className="text-[#b77c71]">土</div>
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7">
          {/* 前月セル */}
          {prevDays.map((prevDay, i) => (
            <div
              key={`prev-${i}`}
              className="min-h-[92px] border-r border-b border-[#f7edea] p-1.5 bg-[#faf7f6] opacity-60 last:border-r-0"
            >
              <span className="font-quicksand tabular-nums text-[16px] font-bold text-text-light">{prevDay}</span>
            </div>
          ))}

          {/* 当月セル */}
          {currentMonthDays.map((item, idx) => {
            const isRightEdge = (prevDays.length + idx + 1) % 7 === 0;

            return (
              <div
                key={item.dateKey}
                onClick={() => onSelectDate(item.dateKey)}
                onDoubleClick={() => onOpenAddModal(item.dateKey)}
                className={`min-h-[92px] border-b border-[#f7edea] p-0.5 cursor-pointer transition-all flex flex-col relative select-none ${
                  !isRightEdge ? 'border-r border-[#f7edea]' : ''
                } ${
                  item.isSelected
                    ? 'bg-[#fdf5f3] ring-2 ring-pink-accent ring-inset'
                    : item.isToday
                    ? 'bg-[#fef9f8]'
                    : 'hover:bg-[#fdf7f5]'
                }`}
              >
                <div className="flex items-center justify-between mb-0">
                  <span
                    className={`font-quicksand tabular-nums text-[16px] font-bold inline-flex items-center justify-center ${
                      item.isToday
                        ? 'w-7 h-7 bg-pink-accent text-white rounded-full shadow-pink'
                        : item.dayOfWeek === 0
                        ? 'text-sun'
                        : item.dayOfWeek === 6
                        ? 'text-sat'
                        : 'text-text-main'
                    }`}
                  >
                    {item.day}
                  </span>
                  {item.dayEvents[0] && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onSelectEvent(item.dayEvents[0]); }}
                      aria-label={`${item.dayEvents[0].title || '予定'}の詳細を表示`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-pink-soft md:h-9 md:w-9"
                    >
                      <HandDrawnSvg iconKey={item.dayEvents[0].icon_key} className="h-8 w-8 md:h-9 md:w-9" />
                    </button>
                  )}
                </div>

                {/* 予定バッジ */}
                <div className="grid grid-cols-2 justify-items-start content-start gap-0 overflow-hidden">
                  {item.dayEvents.slice(1, 3).map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}
                      aria-label={`${ev.title || '予定'}の詳細を表示`}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-start rounded-lg hover:bg-pink-soft md:h-9 md:w-9 [&>span:last-child]:hidden"
                    >
                      <span className="flex-shrink-0 flex items-center justify-center">
                        <HandDrawnSvg iconKey={ev.icon_key} className="h-8 w-8 md:h-9 md:w-9" />
                      </span>
                      <span className="truncate">{ev.title || '予定'}</span>
                    </button>
                  ))}

                  {item.dayEvents.length > 2 && (
                    <div className="hidden text-[10px] text-pink-accent font-bold px-1">
                      +他{item.dayEvents.length - 2}件
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
