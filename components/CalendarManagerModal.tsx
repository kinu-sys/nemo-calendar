'use client';

import React, { useEffect, useState } from 'react';
import { Calendar } from '@/types/database';
import { X, Users, Plus, KeyRound, Copy, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface CalendarManagerModalProps {
  isOpen: boolean;
  calendars: Calendar[];
  currentCalendar: Calendar | null;
  onClose: () => void;
  onSelectCalendar: (cal: Calendar) => void;
  onCreateCalendar: (name: string, description: string) => Promise<void>;
  onJoinCalendar: (code: string) => Promise<boolean>;
}

export const CalendarManagerModal: React.FC<CalendarManagerModalProps> = ({
  isOpen,
  calendars,
  currentCalendar,
  onClose,
  onSelectCalendar,
  onCreateCalendar,
  onJoinCalendar,
}) => {
  const [tab, setTab] = useState<'list' | 'create' | 'join'>('list');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [members, setMembers] = useState<Array<{
    user_id: string;
    role: 'owner' | 'member';
    display_name: string | null;
    email: string | null;
  }>>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !currentCalendar) return;

    let cancelled = false;
    const supabase = createClient();

    async function loadMembers() {
      setMembersLoading(true);
      setMembersError(null);

      const { data: memberRows, error: memberError } = await supabase
        .from('calendar_members')
        .select('user_id, role, joined_at')
        .eq('calendar_id', currentCalendar.id)
        .order('joined_at', { ascending: true });

      if (memberError) {
        if (!cancelled) setMembersError(memberError.message);
        setMembersLoading(false);
        return;
      }

      const userIds = (memberRows || []).map((member) => member.user_id);
      const { data: profiles, error: profileError } = userIds.length
        ? await supabase
            .from('profiles')
            .select('id, display_name, email')
            .in('id', userIds)
        : { data: [], error: null };

      if (cancelled) return;
      if (profileError) setMembersError(profileError.message);

      const profileById = new Map(
        (profiles || []).map((profile) => [profile.id, profile]),
      );
      setMembers(
        (memberRows || []).map((member) => ({
          user_id: member.user_id,
          role: member.role as 'owner' | 'member',
          display_name: profileById.get(member.user_id)?.display_name ?? null,
          email: profileById.get(member.user_id)?.email ?? null,
        })),
      );
      setMembersLoading(false);
    }

    loadMembers();
    return () => {
      cancelled = true;
    };
  }, [isOpen, currentCalendar?.id]);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!newName.trim()) {
      setErrorMsg('カレンダー名を入力してください');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await onCreateCalendar(newName.trim(), newDesc.trim());
      setNewName('');
      setNewDesc('');
      setTab('list');
    } catch (e: any) {
      setErrorMsg(e.message || '作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      setErrorMsg('招待コードを入力してください');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const ok = await onJoinCalendar(inviteCode.trim());
      if (ok) {
        setInviteCode('');
        setTab('list');
      } else {
        setErrorMsg('招待コードが見つからないか、無効です');
      }
    } catch (e: any) {
      setErrorMsg(e.message || '参加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (cal: Calendar) => {
    navigator.clipboard.writeText(cal.invite_code);
    setCopiedId(cal.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#5c4d49]/35 backdrop-blur-[3px] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl border border-card-border shadow-soft w-full max-w-[480px] p-6 text-text-main animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-pink-accent flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-accent" />
            <span>カレンダーの共有 & 管理</span>
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main p-1 rounded-full hover:bg-pink-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* タブ */}
        <div className="flex border-b border-card-border mb-4 text-xs font-bold">
          <button
            onClick={() => {
              setTab('list');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 border-b-2 transition-all ${
              tab === 'list'
                ? 'border-pink-accent text-pink-accent'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            参加中一覧 ({calendars.length})
          </button>
          <button
            onClick={() => {
              setTab('join');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 border-b-2 transition-all ${
              tab === 'join'
                ? 'border-pink-accent text-pink-accent'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            コードで参加
          </button>
          <button
            onClick={() => {
              setTab('create');
              setErrorMsg(null);
            }}
            className={`hidden flex-1 py-2 border-b-2 transition-all ${
              tab === 'create'
                ? 'border-pink-accent text-pink-accent'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            新規作成
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        {/* 参加中一覧 */}
        {tab === 'list' && (
          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 mb-4">
            {calendars.map((cal) => {
              const isSelected = cal.id === currentCalendar?.id;
              return (
                <div
                  key={cal.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-pink-soft border-pink-border ring-1 ring-pink-accent'
                      : 'bg-bg-soft border-card-border hover:bg-white'
                  }`}
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      onSelectCalendar(cal);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-text-main">{cal.name}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-pink-accent text-white px-2 py-0.5 rounded-full font-bold">
                          表示中
                        </span>
                      )}
                    </div>
                    {cal.description && (
                      <p className="text-xs text-text-muted mt-0.5">{cal.description}</p>
                    )}
                  </div>

                  {/* 招待コードコピーボタン */}
                  <button
                    onClick={() => copyCode(cal)}
                    className="ml-2 bg-white hover:bg-pink-soft border border-card-border px-2.5 py-1.5 rounded-xl text-xs font-medium text-text-muted hover:text-pink-accent transition-all flex items-center gap-1 shadow-subtle flex-shrink-0"
                    title="招待コードをコピー"
                  >
                    {copiedId === cal.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">コピー済</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>コード: {cal.invite_code}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 招待コードで参加 */}
        {tab === 'list' && currentCalendar && (
          <section className="mb-4 border-t border-card-border pt-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-text-main">
              <Users className="h-4 w-4 text-pink-accent" />
              <span>参加者</span>
              {!membersLoading && <span className="text-xs text-text-muted">({members.length}人)</span>}
            </div>
            {membersLoading ? (
              <p className="text-xs text-text-muted">参加者を読み込み中...</p>
            ) : membersError ? (
              <p className="text-xs text-red-600">参加者を読み込めませんでした: {membersError}</p>
            ) : members.length === 0 ? (
              <p className="text-xs text-text-muted">参加者はいません。</p>
            ) : (
              <ul className="space-y-2">
                {members.map((member) => (
                  <li key={member.user_id} className="flex items-center justify-between rounded-xl bg-bg-soft px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-main">
                        {member.display_name || member.email || '参加者'}
                      </p>
                      {member.display_name && member.email && (
                        <p className="truncate text-xs text-text-muted">{member.email}</p>
                      )}
                    </div>
                    <span className="ml-3 flex-shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-text-muted">
                      {member.role === 'owner' ? 'オーナー' : 'メンバー'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === 'join' && (
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-text-main mb-1.5">
                共有された招待コードを入力
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={10}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="例: A1B2C3"
                  className="flex-1 px-3.5 py-2.5 bg-bg-soft border border-card-border rounded-xl text-sm font-mono tracking-widest uppercase outline-none focus:border-pink-accent focus:bg-white"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleJoin}
                  className="px-4 py-2.5 bg-pink-accent hover:bg-pink-hover text-white rounded-xl text-xs font-bold shadow-pink transition-all disabled:opacity-50 flex items-center gap-1"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>参加する</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              家族や友人が作成したカレンダーの「招待コード（6文字）」を入力すると、すぐに同じカレンダーを閲覧・予定追加できるようになります。
            </p>
          </div>
        )}

        {/* 新規作成 */}
        {tab === 'create' && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-text-main mb-1">
                カレンダー名
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="例: 我が家の予定、プロジェクトチーム"
                className="w-full px-3.5 py-2.5 bg-bg-soft border border-card-border rounded-xl text-sm outline-none focus:border-pink-accent focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-main mb-1">
                説明（任意）
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="例: 家族みんなのスケジュール共有用"
                className="w-full px-3.5 py-2.5 bg-bg-soft border border-card-border rounded-xl text-sm outline-none focus:border-pink-accent focus:bg-white"
              />
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={handleCreate}
              className="w-full py-2.5 bg-pink-accent hover:bg-pink-hover text-white rounded-xl text-xs font-bold shadow-pink transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>新しい共有カレンダーを作成</span>
            </button>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-card-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#f2e7e4] hover:bg-[#ebdcd7] text-text-muted font-bold rounded-xl text-xs transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
