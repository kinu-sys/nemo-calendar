'use client';

import React, { useState } from 'react';
import { IconItem } from '@/types/database';
import { HandDrawnSvg } from './HandDrawnSvg';
import { X, Sparkles } from 'lucide-react';

interface IconManageModalProps {
  isOpen: boolean;
  icons: IconItem[];
  onClose: () => void;
  onAddIcon: (char: string, label: string) => Promise<void>;
  onDeleteIcon: (item: IconItem) => Promise<void>;
  onResetIcons: () => Promise<void>;
}

export const IconManageModal: React.FC<IconManageModalProps> = ({
  isOpen,
  icons,
  onClose,
  onAddIcon,
  onDeleteIcon,
  onResetIcons,
}) => {
  const [char, setChar] = useState('');
  const [label, setLabel] = useState('');
  const [adding, setAdding] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!char.trim()) {
      alert('絵文字または文字を入力してください');
      return;
    }
    setAdding(true);
    try {
      await onAddIcon(char.trim(), label.trim() || '予定');
      setChar('');
      setLabel('');
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const handleReset = async () => {
    if (confirm('初期アイコン33種類に戻しますか？')) {
      await onResetIcons();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#5c4d49]/35 backdrop-blur-[3px] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl border border-card-border shadow-soft w-full max-w-[460px] p-6 text-text-main animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-pink-accent flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-pink-accent" />
            <span>アイコン管理</span>
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main p-1 rounded-full hover:bg-pink-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 新規アイコン追加フォーム */}
        <div className="bg-bg-soft border border-card-border rounded-2xl p-3.5 mb-4">
          <div className="text-xs font-bold text-text-main mb-2">新しいアイコンを追加</div>
          <div className="flex gap-2 items-center mb-2">
            <div className="relative w-14 flex-shrink-0">
              <input
                type="text"
                maxLength={4}
                value={char}
                onChange={(e) => setChar(e.target.value)}
                aria-label="追加するアイコンの絵文字または文字"
                className="w-full text-center py-2 text-lg bg-white border border-card-border rounded-xl outline-none focus:border-pink-accent"
              />
              {!char && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <HandDrawnSvg iconKey="cat" className="w-8 h-8" />
                </span>
              )}
            </div>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              placeholder="アイコン名 (例: 買い物)"
              className="flex-1 px-3 py-2 text-xs bg-white border border-card-border rounded-xl outline-none focus:border-pink-accent"
            />
            <button
              type="button"
              disabled={adding}
              onClick={handleAdd}
              className="px-3.5 py-2 bg-pink-accent hover:bg-pink-hover text-white rounded-xl text-xs font-bold shadow-pink transition-all disabled:opacity-50 flex-shrink-0"
            >
              {adding ? '追加中' : '追加'}
            </button>
          </div>

        </div>

        {/* 登録中のアイコン一覧 */}
        <div className="mb-4">
          <div className="text-xs font-bold text-text-main mb-2">
            登録中のアイコン（✕で削除）
          </div>
          <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto p-2 bg-bg-soft rounded-2xl border border-card-border">
            {icons.map((item) => (
              <div
                key={item.key}
                title={item.label}
                className="inline-flex items-center justify-center gap-1 bg-white border border-card-border rounded-xl p-1 shadow-subtle"
              >
                <HandDrawnSvg iconKey={item.key} className="w-8 h-8" />
                <button
                  type="button"
                  onClick={() => onDeleteIcon(item)}
                  className="text-text-muted hover:text-sun hover:bg-red-50 rounded px-1 transition-colors"
                  title="削除"
                  aria-label={`${item.label}を削除`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-between items-center pt-3 border-t border-card-border">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-text-muted hover:text-sun hover:underline transition-colors"
          >
            初期アイコンに戻す
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-pink-accent hover:bg-pink-hover text-white rounded-xl text-xs font-bold shadow-pink transition-all"
          >
            完了
          </button>
        </div>
      </div>
    </div>
  );
};
