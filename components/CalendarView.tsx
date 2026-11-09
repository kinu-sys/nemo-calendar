'use client';

import React from 'react';
import { CalendarEvent } from '@/types/database';
import { HandDrawnSvg } from './HandDrawnSvg';
import Image from 'next/image';
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
      dayEvents: [...(events[dateKey] || [])].sort((a, b) => {
        const timeA = a.start_time?.trim() || '';
        const timeB = b.start_time?.trim() || '';
        return timeA.localeCompare(timeB);
      }),
    });
  }

  return (
    <section className="journal-calendar flex min-w-0 flex-col">
      {/* 月ナビゲーション */}
      <div className="journal-month-nav flex justify-between items-center mb-2 px-1">
        <div className="journal-month-controls flex items-center gap-5">
          <button
            type="button"
            onClick={onPrevMonth}
            className="journal-month-button flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-accent focus-visible:ring-offset-2"
            aria-label="前月"
            title="前月"
          >
            <Image src="/controls/month-chevron-aged-paper-bold.png" alt="" width={1254} height={1254} sizes="(max-width: 639px) 36.72px, 33.66px" className="pointer-events-none h-[76.5%] w-[76.5%] select-none object-contain" />
          </button>
          <div className="flex items-baseline px-1 text-text-main">
            <label className="sr-only" htmlFor="calendar-year">年を選択</label>
            <select
              id="calendar-year"
              value={year}
              onChange={(e) => onChangeMonth(Number(e.target.value), month)}
              className="w-[4.4ch] cursor-pointer appearance-none bg-transparent font-noto text-[28.8px] font-bold leading-none tracking-normal outline-none"
            >
              {years.map((optionYear) => <option key={optionYear} value={optionYear} className="font-noto text-[12px]">{optionYear}</option>)}
            </select>
            <span className="text-[23.4px] font-bold">年</span>
            <label className="sr-only" htmlFor="calendar-month">月を選択</label>
            <select
              id="calendar-month"
              value={month}
              onChange={(e) => onChangeMonth(year, Number(e.target.value))}
              className="ml-1 w-[2.3ch] cursor-pointer appearance-none bg-transparent text-right font-noto text-[28.8px] font-bold leading-none tracking-normal outline-none"
            >
              {Array.from({ length: 12 }, (_, optionMonth) => (
                <option key={optionMonth} value={optionMonth} className="font-noto text-[12px]">{optionMonth + 1}</option>
              ))}
            </select>
            <span className="ml-1 text-[23.4px] font-bold">月</span>
          </div>
          <button
            type="button"
            onClick={onNextMonth}
            className="journal-month-button flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-accent focus-visible:ring-offset-2"
            aria-label="次月"
            title="次月"
          >
            <Image src="/controls/month-chevron-aged-paper-bold.png" alt="" width={1254} height={1254} sizes="(max-width: 639px) 36.72px, 33.66px" className="journal-month-icon-next pointer-events-none h-[76.5%] w-[76.5%] select-none object-contain" />
          </button>
        </div>
        <div className="shrink-0">
          <button
            type="button"
            onClick={onToday}
            className="flex h-12 w-[88px] items-center justify-center rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-accent focus-visible:ring-offset-2"
            aria-label="今日に戻る"
            title="今日に戻る"
          >
            <Image src="/controls/today-en-floral-paper.png" alt="" width={1774} height={887} sizes="88px" className="pointer-events-none h-11 w-[88px] select-none object-contain" />
          </button>
        </div>
      </div>

      {/* カレンダー本体 */}
      <div className="journal-calendar-frame">
        <div className="journal-calendar-corners" aria-hidden="true" />
      <div className="journal-calendar-grid overflow-hidden rounded-3xl bg-white">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 border-b border-[#d8d0b4] bg-gradient-to-r from-[#e7ece4] via-[#f1f0e5] to-[#e7ece4] py-1 text-center text-[12.8px] leading-5 font-bold text-[#586b5a]">
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
              className="min-h-16 border-r border-b border-[#eee9dc] bg-[#f8f7f1] p-1.5 opacity-60 last:border-r-0"
            >
              <span className="tabular-nums text-[16px] font-bold text-text-light">{prevDay}</span>
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
                className={`relative flex min-h-16 cursor-pointer select-none flex-col border-b border-[#eee9dc] p-0.5 transition-all ${
                  !isRightEdge ? 'border-r border-[#eee9dc]' : ''
                } ${
                  item.isSelected
                    ? 'bg-[#f0f3ec] ring-2 ring-[#9aa88e] ring-inset'
                    : item.isToday
                    ? 'bg-[#f8f7ef]'
                    : 'hover:bg-[#f7f8f2]'
                }`}
              >
                <div className="mb-0 flex flex-shrink-0 items-center justify-between">
                  <span
                    className={`tabular-nums text-[16px] font-bold inline-flex items-center justify-center ${
                      item.isToday
                        ? 'h-7 w-7 rounded-full border border-[#c3b779] bg-[#657c66] text-white shadow-[0_2px_6px_rgba(83,107,88,0.24)]'
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
                      className="flex h-[30px] w-full min-w-0 flex-shrink-0 items-center gap-0 overflow-visible px-0.5 text-left"
                    >
                      {ev.icon_key && <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center">
                        <HandDrawnSvg iconKey={ev.icon_key} className="h-[30px] w-[30px]" />
                      </span>}
                      <span className={`flex h-[26px] min-w-0 items-center truncate rounded px-1 font-zen text-[8px] font-bold leading-tight md:text-[10px] ${
                        ev.importance === 'important'
                          ? 'bg-[#536b58] text-white hover:bg-[#455b49]'
                          : ev.importance === 'slight'
                          ? 'border border-[#a9b9aa] bg-[#e5ede5] text-[#4e6252] hover:bg-[#dce7dc]'
                          : 'hover:bg-pink-soft'
                      }`}>
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
              className={`min-h-16 border-b border-[#eee9dc] bg-[#f8f7f1] p-1.5 opacity-60 ${
                (firstDay + lastDate + i + 1) % 7 !== 0 ? 'border-r border-[#eee9dc]' : ''
              }`}
            >
              <span className="tabular-nums text-[16px] font-bold text-text-light">{nextDay}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};
