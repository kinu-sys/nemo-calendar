'use client';

import React, { useState, useEffect } from 'react';
import { CalendarEvent, IconItem } from '@/types/database';
import { HandDrawnSvg } from './HandDrawnSvg';
import { X } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  dateStr: string;
  initialIconKey?: string;
  icons: IconItem[];
  onClose: () => void;
  onSave: (dateStr: string, title: string, iconKey: string, importance: CalendarImportance) => Promise<void>;
}

type CalendarImportance = CalendarEvent['importance'];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  dateStr,
  initialIconKey,
  icons,
  onClose,
  onSave,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(initialIconKey || (icons[0]?.key ?? 'cat'));
  const [title, setTitle] = useState('');
  const [importance, setImportance] = useState<CalendarImportance>('normal');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedKey(initialIconKey || (icons[0]?.key ?? 'cat'));
      setTitle('');
      setImportance('normal');
      setSaving(false);
    }
  }, [isOpen, initialIconKey, icons]);

  if (!isOpen) return null;

  const parts = dateStr.split('-');
  const titleText = parts.length === 3 ? `${parseInt(parts[1], 10)}月${parseInt(parts[2], 10)}日の予定を追加` : '予定を追加';

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(dateStr, title.trim() || '予定', selectedKey, importance);
      onClose();
    } catch (e) {
      console.error(e);
      const reason = e instanceof Error ? e.message : '原因を確認できませんでした。';
      alert(`予定を保存できませんでした。入力内容は消えていません。\n\n理由: ${reason}`);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#5c4d49]/35 backdrop-blur-[3px] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl border border-card-border shadow-soft w-full max-w-[440px] p-6 text-text-main animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-pink-accent">{titleText}</h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main p-1 rounded-full hover:bg-pink-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* アイコン選択 */}
        <p className="text-xs font-bold text-text-muted mb-2">アイコンを選択</p>
        <div className="grid grid-cols-5 gap-1.5 mb-4 max-h-[260px] overflow-y-auto overscroll-contain p-1">
          {icons.map((item) => {
            const isSelected = item.key === selectedKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedKey(item.key)}
                title={item.label}
                aria-label={item.label}
                aria-pressed={isSelected}
                className={`aspect-square rounded-2xl border p-1 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-pink-accent bg-pink-soft shadow-subtle'
                    : 'border-transparent bg-bg-soft hover:border-pink-border hover:bg-pink-soft/50'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <HandDrawnSvg iconKey={item.key} className="w-full h-full" />
                </div>
              </button>
            );
          })}
        </div>

        {/* 予定詳細入力 */}
        <div className="mb-5">
          <input
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="予定の詳細（例: カフェ巡り、映画など）"
            className="w-full px-3.5 py-2.5 bg-bg-soft border border-card-border rounded-xl text-sm outline-none focus:border-pink-accent focus:bg-white focus:ring-2 focus:ring-pink-accent/20 transition-all text-text-main placeholder:text-text-muted/60"
          />
        </div>

        <label className="mb-4 block text-xs font-bold text-text-muted">重要度
          <select value={importance} onChange={(e) => setImportance(e.target.value as CalendarImportance)} className="mt-1.5 w-full rounded-xl border border-card-border bg-bg-soft px-3.5 py-2.5 text-sm font-normal text-text-main outline-none focus:border-pink-accent">
            <option value="normal">〇 標準</option>
            <option value="slight">◎ やや重要</option>
            <option value="important">◉ 重要</option>
          </select>
        </label>

        {/* アクションボタン */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#f2e7e4] hover:bg-[#ebdcd7] text-text-muted transition-colors"
          >
            キャンセル
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-pink-accent hover:bg-pink-hover text-white shadow-pink transition-all disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};
