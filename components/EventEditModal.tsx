'use client';

import React, { useEffect, useState } from 'react';
import { CalendarEvent, IconItem } from '@/types/database';
import { HandDrawnSvg } from './HandDrawnSvg';
import { X } from 'lucide-react';

interface EventEditModalProps {
  event: CalendarEvent | null;
  icons: IconItem[];
  onClose: () => void;
  onSave: (event: CalendarEvent, updates: Pick<CalendarEvent, 'date' | 'title' | 'icon_key' | 'start_time' | 'end_time' | 'location' | 'memo'>) => Promise<void>;
}

export const EventEditModal: React.FC<EventEditModalProps> = ({ event, icons, onClose, onSave }) => {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [iconKey, setIconKey] = useState('cat');
  const [startTime, setStartTime] = useState('');
  const [hasEndTime, setHasEndTime] = useState(false);
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [memo, setMemo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!event) return;
    setDate(event.date);
    setTitle(event.title);
    setIconKey(event.icon_key);
    setStartTime(event.start_time?.slice(0, 5) ?? '');
    setHasEndTime(Boolean(event.end_time));
    setEndTime(event.end_time?.slice(0, 5) ?? '');
    setLocation(event.location ?? '');
    setMemo(event.memo ?? '');
  }, [event]);

  if (!event) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(event, {
        date,
        title: title.trim() || '予定',
        icon_key: iconKey,
        start_time: startTime || null,
        end_time: hasEndTime ? endTime || null : null,
        location: location.trim() || null,
        memo: memo.trim() || null,
      });
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
      <div role="dialog" aria-modal="true" aria-labelledby="event-edit-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-card-border bg-white p-6 text-text-main shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="event-edit-title" className="text-lg font-bold text-pink-accent">予定を編集</h2>
          <button type="button" onClick={onClose} aria-label="閉じる" className="rounded-full p-1 text-text-muted hover:bg-pink-soft"><X className="h-5 w-5" /></button>
        </div>
        <label className="mb-1 block text-xs font-bold text-text-muted">予定</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mb-4 w-full rounded-xl border border-card-border bg-bg-soft px-3.5 py-2.5 text-sm outline-none focus:border-pink-accent" />

        <label className="mb-4 block text-xs font-bold text-text-muted">日付<input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 w-full rounded-xl border border-card-border bg-bg-soft px-3.5 py-2.5 text-sm font-normal text-text-main outline-none focus:border-pink-accent" /></label>

        <div className="mb-4">
          <p className="mb-2 text-xs font-bold text-text-muted">アイコン</p>
          <div className="grid max-h-56 grid-cols-5 gap-1.5 overflow-y-auto p-0">
            {icons.map((icon) => <button type="button" key={icon.key} title={icon.label} aria-label={icon.label} aria-pressed={iconKey === icon.key} onClick={() => setIconKey(icon.key)} className={`aspect-square w-4/5 justify-self-center rounded-2xl border p-1 transition-all ${iconKey === icon.key ? 'border-pink-accent bg-pink-soft' : 'border-card-border bg-bg-soft hover:border-pink-border hover:bg-pink-soft/50'}`}><div className="flex aspect-square w-full items-center justify-center"><HandDrawnSvg iconKey={icon.key} className="h-full w-full" /></div></button>)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-bold text-text-muted">開始時間<input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1.5 w-full rounded-xl border border-card-border bg-bg-soft px-3 py-2.5 text-sm font-normal text-text-main" /></label>
          <div>
            <label className="flex min-h-5 items-center gap-1.5 text-xs font-bold text-text-muted"><input type="checkbox" checked={hasEndTime} onChange={(e) => { setHasEndTime(e.target.checked); if (!e.target.checked) setEndTime(''); }} className="accent-pink-500" />終了時間</label>
            <input type="time" disabled={!hasEndTime} value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1.5 w-full rounded-xl border border-card-border bg-bg-soft px-3 py-2.5 text-sm text-text-main disabled:cursor-not-allowed disabled:opacity-40" />
          </div>
        </div>
        <label className="mt-4 block text-xs font-bold text-text-muted">場所<input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="場所を入力" className="mt-1.5 w-full rounded-xl border border-card-border bg-bg-soft px-3.5 py-2.5 text-sm font-normal text-text-main outline-none focus:border-pink-accent" /></label>
        <label className="mt-4 block text-xs font-bold text-text-muted">メモ<textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={4} placeholder="予定のメモ" className="mt-1.5 w-full resize-y rounded-xl border border-card-border bg-bg-soft px-3.5 py-2.5 text-sm font-normal text-text-main outline-none focus:border-pink-accent" /></label>
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl bg-[#f2e7e4] px-4 py-2 text-xs font-bold text-text-muted">キャンセル</button><button type="button" disabled={saving || !date} onClick={handleSave} className="rounded-xl bg-pink-accent px-5 py-2 text-xs font-bold text-white disabled:opacity-50">{saving ? '保存中...' : '保存'}</button></div>
      </div>
    </div>
  );
};
