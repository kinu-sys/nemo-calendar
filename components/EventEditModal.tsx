'use client';

import React, { useEffect, useState } from 'react';
import { CalendarEvent, IconItem } from '@/types/database';
import { HandDrawnSvg } from './HandDrawnSvg';
import { X } from 'lucide-react';

interface EventEditModalProps {
  event: CalendarEvent | null;
  isOpen?: boolean;
  initialDate?: string;
  initialIconKey?: string;
  isDuplicate?: boolean;
  icons: IconItem[];
  onClose: () => void;
  onSave: (event: CalendarEvent, updates: EventUpdates) => Promise<void>;
  onCreate?: (updates: EventUpdates) => Promise<void>;
}

type EventUpdates = Pick<CalendarEvent, 'date' | 'title' | 'icon_key' | 'start_time' | 'end_time' | 'location' | 'memo' | 'importance' | 'countdown_enabled'>;

export const EventEditModal: React.FC<EventEditModalProps> = ({ event, isOpen = false, initialDate = '', initialIconKey, isDuplicate = false, icons, onClose, onSave, onCreate }) => {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [iconKey, setIconKey] = useState('cat');
  const [startTime, setStartTime] = useState('');
  const [hasEndTime, setHasEndTime] = useState(false);
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [memo, setMemo] = useState('');
  const [importance, setImportance] = useState<CalendarEvent['importance']>('normal');
  const [countdownEnabled, setCountdownEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setDate(event.date);
      setTitle(event.title);
      setIconKey(event.icon_key);
      setStartTime(event.start_time?.slice(0, 5) ?? '');
      setHasEndTime(Boolean(event.end_time));
      setEndTime(event.end_time?.slice(0, 5) ?? '');
      setLocation(event.location ?? '');
      setMemo(event.memo ?? '');
      setImportance(event.importance ?? 'normal');
      setCountdownEnabled(event.countdown_enabled ?? false);
    } else if (isOpen) {
      setDate(initialDate);
      setTitle('');
      setIconKey(initialIconKey || icons[0]?.key || 'cat');
      setStartTime('');
      setHasEndTime(false);
      setEndTime('');
      setLocation('');
      setMemo('');
      setImportance('normal');
      setCountdownEnabled(false);
      setSaving(false);
    }
  }, [event, isOpen, initialDate, initialIconKey, icons]);

  if (!event && !isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: EventUpdates = {
        date,
        title: title.trim() || '予定',
        icon_key: iconKey,
        start_time: startTime || null,
        end_time: hasEndTime ? endTime || null : null,
        location: location.trim() || null,
        memo: memo.trim() || null,
        importance,
        countdown_enabled: countdownEnabled,
      };
      if (event) await onSave(event, updates);
      else if (onCreate) await onCreate(updates);
      else throw new Error('新規予定の保存処理が設定されていません。');
      onClose();
    } catch (error) {
      const reason = error instanceof Error ? error.message : '原因を確認できませんでした。';
      alert(`予定を保存できませんでした。入力内容は消えていません。\n\n理由: ${reason}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#5c4d49]/35 p-4 backdrop-blur-[3px]" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="event-edit-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-card-border bg-white p-4 text-text-main shadow-soft sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="event-edit-title" className="text-lg font-bold text-pink-accent">{isDuplicate ? '予定を複製' : event ? '予定を編集' : '予定を追加'}</h2>
          <button type="button" onClick={onClose} aria-label="閉じる" className="rounded-full p-1 text-text-muted hover:bg-pink-soft"><X className="h-5 w-5" /></button>
        </div>
        <div className="mb-2.5 grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2">
          <label htmlFor="edit-event-title" className="text-xs font-bold text-text-muted">予定</label>
          <input id="edit-event-title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-card-border bg-bg-soft px-3 py-2 text-sm outline-none focus:border-pink-accent" />
        </div>
        <div className="mb-2.5 grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2">
          <label htmlFor="edit-event-date" className="text-xs font-bold text-text-muted">日付</label>
          <input id="edit-event-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-card-border bg-bg-soft px-3 py-2 text-sm font-normal text-text-main outline-none focus:border-pink-accent" />
        </div>

        <div className="mb-2.5 grid grid-cols-[4.25rem_minmax(0,1fr)] items-start gap-2">
          <p className="pt-2 text-xs font-bold text-text-muted">アイコン</p>
          <div className="grid max-h-[6.25rem] grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] auto-rows-[3rem] gap-0.5 overflow-y-auto p-0">
            <button type="button" aria-label="アイコンなし" aria-pressed={!iconKey} onClick={() => setIconKey('')} className={`h-12 w-12 justify-self-center rounded-lg border text-[11px] font-bold transition-all ${!iconKey ? 'border-pink-accent bg-pink-soft text-pink-accent' : 'border-card-border bg-bg-soft text-text-muted hover:border-pink-border hover:bg-pink-soft/50'}`}>なし</button>
            {icons.map((icon) => <button type="button" key={icon.key} title={icon.label} aria-label={icon.label} aria-pressed={iconKey === icon.key} onClick={() => setIconKey(icon.key)} className={`h-12 w-12 justify-self-center rounded-lg border p-0.5 transition-all ${iconKey === icon.key ? 'border-pink-accent bg-pink-soft' : 'border-card-border bg-bg-soft hover:border-pink-border hover:bg-pink-soft/50'}`}><div className="flex aspect-square w-full items-center justify-center"><HandDrawnSvg iconKey={icon.key} className="h-full w-full" /></div></button>)}
          </div>
        </div>

        <div className="mb-2.5 grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2">
          <span className="text-xs font-bold text-text-muted">時間</span>
          <div className="flex min-w-0 items-center gap-2">
            <input aria-label="開始時間" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-card-border bg-bg-soft px-2 py-2 text-sm font-normal text-text-main" />
            <label className="flex shrink-0 items-center gap-1 text-xs text-text-muted"><input type="checkbox" checked={hasEndTime} onChange={(e) => { setHasEndTime(e.target.checked); if (!e.target.checked) setEndTime(''); }} className="accent-pink-500" />終了</label>
            <input aria-label="終了時間" type="time" disabled={!hasEndTime} value={endTime} onChange={(e) => setEndTime(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-card-border bg-bg-soft px-2 py-2 text-sm text-text-main disabled:cursor-not-allowed disabled:opacity-40" />
          </div>
        </div>
        <div className="mb-2.5 grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2">
          <label htmlFor="edit-event-location" className="text-xs font-bold text-text-muted">場所</label>
          <input id="edit-event-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="場所を入力" className="w-full rounded-xl border border-card-border bg-bg-soft px-3 py-2 text-sm font-normal text-text-main outline-none focus:border-pink-accent" />
        </div>
        <div className="mb-2.5 grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2">
          <label htmlFor="edit-event-importance" className="text-xs font-bold text-text-muted">重要度</label>
          <select id="edit-event-importance" value={importance} onChange={(e) => setImportance(e.target.value as CalendarEvent['importance'])} className="w-full rounded-xl border border-card-border bg-bg-soft px-3 py-2 text-sm font-normal text-text-main outline-none focus:border-pink-accent"><option value="normal">〇 標準</option><option value="slight">◎ やや重要</option><option value="important">◉ 重要</option></select>
        </div>
        <div className="mb-2.5 grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2">
          <span className="text-xs font-bold text-text-muted">カウント</span>
          <label className="flex items-center gap-2 text-sm text-text-main"><input type="checkbox" checked={countdownEnabled} onChange={(e) => setCountdownEnabled(e.target.checked)} className="accent-pink-500" />あと何日か表示する</label>
        </div>
        <div className="mb-2.5 grid grid-cols-[4.25rem_minmax(0,1fr)] items-start gap-2">
          <label htmlFor="edit-event-memo" className="pt-2 text-xs font-bold text-text-muted">メモ</label>
          <textarea id="edit-event-memo" value={memo} onChange={(e) => setMemo(e.target.value)} rows={2} placeholder="予定のメモ" className="w-full resize-y rounded-xl border border-card-border bg-bg-soft px-3 py-2 text-sm font-normal text-text-main outline-none focus:border-pink-accent" />
        </div>
        <div className="mt-3 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl bg-[#f2e7e4] px-4 py-2 text-xs font-bold text-text-muted">キャンセル</button><button type="button" disabled={saving || !date} onClick={handleSave} className="rounded-xl bg-pink-accent px-5 py-2 text-xs font-bold text-white disabled:opacity-50">{saving ? '保存中...' : '保存'}</button></div>
      </div>
    </div>
  );
};
