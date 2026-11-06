'use client';

import React from 'react';
import { CalendarEvent } from '@/types/database';
import { HandDrawnSvg } from './HandDrawnSvg';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getJapaneseHolidays } from '@/lib/japaneseHolidays';

interface CalendarViewProps {
  currentDate: Date;
  selectedDateStr: string;
  events: Record<string, CalendarEvent[]>;
  onSelectDate: (dateStr: string) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  onOpenAddModal: (dateStr: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onChangeMonth: (year: number, month: number) => void;
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
  onChangeMonth,
  onToday,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const years = Array.from({ length: 201 }, (_, i) => year - 100 + i);

  // 月曜始まりにして、日曜を右端に配置する
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();
  const nextDayCount = (7 - ((firstDay + lastDate) % 7)) % 7;

  const realToday = new Date();
  const isCurrentMonth = realToday.getFullYear() === year && realToday.getMonth() === month;
  const holidays = getJapaneseHolidays(year);

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
      holidayName: holidays.get(dateKey),
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
            className="translate-y-1 scale-90 origin-bottom bg-white hover:bg-pink-soft border border-card-border hover:border-pink-border px-3.5 py-1.5 rounded-full text-xs font-bold text-text-main hover:text-pink-accent shadow-subtle flex items-center gap-1 transition-all"
            title="前月"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>前月</span>
          </button>
          <div className="flex items-baseline px-1 text-text-main">
            <label className="sr-only" htmlFor="calendar-year">年を選択</label>
            <select
              id="calendar-year"
              value={year}
              onChange={(e) => onChangeMonth(Number(e.target.value), month)}
              className="w-[4.4ch] cursor-pointer appearance-none bg-transparent font-quicksand text-[40px] font-bold leading-none tracking-wider outline-none"
            >
              {years.map((optionYear) => <option key={optionYear} value={optionYear} className="font-quicksand text-[20px]">{optionYear}</option>)}
            </select>
            <span className="text-[26px] font-bold">年</span>
            <label className="sr-only" htmlFor="calendar-month">月を選択</label>
            <select
              id="calendar-month"
              value={month}
              onChange={(e) => onChangeMonth(year, Number(e.target.value))}
              className="ml-1 w-[1.7ch] cursor-pointer appearance-none bg-transparent text-right font-quicksand text-[40px] font-bold leading-none tracking-wider outline-none"
            >
              {Array.from({ length: 12 }, (_, optionMonth) => (
                <option key={optionMonth} value={optionMonth} className="font-quicksand text-[20px]">{optionMonth + 1}</option>
              ))}
            </select>
            <span className="text-[26px] font-bold">月</span>
          </div>
          <button
            onClick={onNextMonth}
            className="translate-y-1 scale-90 origin-bottom bg-white hover:bg-pink-soft border border-card-border hover:border-pink-border px-3.5 py-1.5 rounded-full text-xs font-bold text-text-main hover:text-pink-accent shadow-subtle flex items-center gap-1 transition-all"
            title="翌月"
          >
            <span>翌月</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <button
            onClick={onToday}
            className="bg-[#f8df9a] hover:bg-[#f2cc68] text-[#72531a] border border-[#e7c96c] hover:border-[#d9b54d] px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-subtle"
          >
            今日
          </button>
        </div>
      </div>

      {/* カレンダー本体 */}
      <div className="bg-white rounded-3xl border border-card-border shadow-soft overflow-hidden">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 bg-[#e8eee5] border-b border-card-border text-center text-[16px] py-2.5 font-bold text-weekday">
          <div>月</div>
          <div>火</div>
          <div>水</div>
          <div>木</div>
          <div>金</div>
          <div className="text-[#b77c71]">土</div>
          <div className="text-sun">日</div>
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7">
          {/* 前月セル */}
          {prevDays.map((prevDay, i) => (
            <div
              key={`prev-${i}`}
              className="min-h-16 border-r border-b border-[#f7edea] p-1.5 bg-[#faf7f6] opacity-60 last:border-r-0"
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
                className={`min-h-16 border-b border-[#f7edea] p-0.5 cursor-pointer transition-all flex flex-col relative select-none ${
                  !isRightEdge ? 'border-r border-[#f7edea]' : ''
                } ${
                  item.isSelected
                    ? 'bg-[#fdf5f3] ring-2 ring-pink-accent ring-inset'
                    : item.isToday
                    ? 'bg-[#fef9f8]'
                    : 'hover:bg-[#fdf7f5]'
                }`}
              >
                <div className="mb-0 flex flex-shrink-0 items-center justify-between">
                  <span
                    className={`font-quicksand tabular-nums text-[16px] font-bold inline-flex items-center justify-center ${
                      item.isToday
                        ? 'w-7 h-7 bg-pink-accent text-white rounded-full shadow-pink'
                        : item.holidayName || item.dayOfWeek === 0
                        ? 'text-sun'
                        : item.dayOfWeek === 6
                        ? 'text-sat'
                        : 'text-text-main'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>

                {item.holidayName && (
                  <div className="truncate px-0.5 text-[9px] font-bold leading-tight text-sun md:text-[10px]" title={item.holidayName}>
                    {item.holidayName}
                  </div>
                )}

                {/* 日付の下に予定を最大3件表示 */}
                <div className="flex min-w-0 flex-col gap-0 overflow-hidden">
                  {item.dayEvents.slice(0, 3).map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}
                      aria-label={`${ev.title || '予定'}の詳細を表示`}
                      title={ev.title || '予定'}
                      className="flex h-7 w-full min-w-0 flex-shrink-0 items-center gap-0 overflow-visible rounded px-0.5 text-left hover:bg-pink-soft"
                    >
                      <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center">
                        <HandDrawnSvg iconKey={ev.icon_key} className="h-[30px] w-[30px]" />
                      </span>
                      <span className="min-w-0 truncate font-zen text-[8px] font-bold leading-tight md:text-[10px]">
                        {ev.title || '予定'}
                      </span>
                    </button>
                  ))}

                  {item.dayEvents.length > 3 && (
                    <div className="truncate px-1 font-zen text-[9px] font-bold leading-tight text-pink-accent md:text-[10px]">
                      +他{item.dayEvents.length - 3}件
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* 翌月セル: 最終週を日曜まで埋める */}
          {Array.from({ length: nextDayCount }, (_, i) => i + 1).map((nextDay, i) => (
            <div
              key={`next-${i}`}
              className={`min-h-16 border-b border-[#f7edea] p-1.5 bg-[#faf7f6] opacity-60 ${
                (firstDay + lastDate + i + 1) % 7 !== 0 ? 'border-r border-[#f7edea]' : ''
              }`}
            >
              <span className="font-quicksand tabular-nums text-[16px] font-bold text-text-light">{nextDay}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
