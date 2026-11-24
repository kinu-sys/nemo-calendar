'use client';

import Image from 'next/image';
import { LockKeyhole } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';

const MAX_LENGTH = 150;
const dateFormat = new Intl.DateTimeFormat('ja-JP', {
  month: 'numeric', day: 'numeric', weekday: 'short', year: 'numeric', timeZone: 'UTC',
});

type JournalProps = { userId: string; date: string; onSaved: () => void };

export function DailyJournal({ userId, date, onSaved }: JournalProps) {
  const drafts = useRef(new Map<string, string>()).current;
  const pending = useRef(new Map<string, Promise<void>>()).current;

  return <JournalPage key={date} {...{ userId, date, onSaved, drafts, pending }} />;
}

function JournalPage({ userId, date, onSaved, drafts, pending }: JournalProps & {
  drafts: Map<string, string>;
  pending: Map<string, Promise<void>>;
}) {
  const supabase = createClient();
  const [savedBody, setSavedBody] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const body = draft.trim();
  const length = Array.from(draft).length;
  const tooLong = length > MAX_LENGTH;

  useEffect(() => {
    let active = true;

    async function load() {
      await pending.get(date);
      if (!active) return;
      const { data, error } = await supabase.from('daily_journal')
        .select('body').eq('user_id', userId).eq('entry_date', date).maybeSingle();
      if (!active) return;
      if (error) {
        setLoadFailed(true);
        return;
      }
      const stored = data?.body ?? '';
      setSavedBody(stored);
      setDraft(drafts.get(date) ?? stored);
    }

    void load();
    return () => { active = false; };
  }, [attempt, date, drafts, pending, supabase, userId]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savedBody === null || pending.has(date) || !body || tooLong || body === savedBody) return;
    setSaving(true);
    setMessage('');

    async function write() {
      try {
        const { error } = await supabase.from('daily_journal')
          .upsert({ user_id: userId, entry_date: date, body }, { onConflict: 'user_id,entry_date' });
        if (error) throw error;
        drafts.delete(date);
        setSavedBody(body);
        setDraft(body);
        setMessage('日記を保存しました');
        onSaved();
      } catch {
        setMessage('保存できませんでした。もう一度お試しください。');
      } finally {
        pending.delete(date);
        setSaving(false);
      }
    }

    pending.set(date, write());
  }

  return (
    <section id="daily-journal" aria-labelledby="daily-journal-title" className="daily-journal">
      <header className="daily-journal-header">
        <h2 id="daily-journal-title" lang="en">Daily Journal</h2>
        <time dateTime={date}>{dateFormat.format(new Date(date))}</time>
        <p className="daily-journal-private"><LockKeyhole size={11} aria-hidden="true" /> 自分だけに表示</p>
        <Image src="/decorations/journal-quill-ornament.png" alt="" width={1774} height={887} sizes="(max-width: 639px) 48px, 67.2px" className="daily-journal-art" />
      </header>
      {loadFailed ? (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <p role="status">日記を読み込めませんでした。</p>
          <button type="button" className="daily-journal-save" onClick={() => {
            setLoadFailed(false);
            setAttempt((value) => value + 1);
          }}>再読み込み</button>
        </div>
      ) : (
        <form onSubmit={save} aria-busy={savedBody === null || saving}>
          <label htmlFor="daily-journal-body" className="sr-only">日記の本文</label>
          <textarea
            id="daily-journal-body"
            className="daily-journal-paper"
            rows={2}
            disabled={savedBody === null || saving}
            value={draft}
            placeholder={savedBody === null ? '日記を読み込み中…' : '心に残ったことを、ひとこと。'}
            aria-describedby="daily-journal-count"
            aria-invalid={tooLong}
            onChange={(event) => {
              const value = event.target.value;
              setDraft(value);
              if (value === savedBody) drafts.delete(date);
              else drafts.set(date, value);
              setMessage('');
            }}
          />
          <div className="daily-journal-actions">
            <p role="status">{message}</p>
            <span id="daily-journal-count" className={tooLong ? 'text-red-800' : undefined}>
              {length} / {MAX_LENGTH}文字{tooLong && '（上限を超えています）'}
            </span>
            <button type="submit" className="daily-journal-save"
              disabled={savedBody === null || saving || !body || tooLong || body === savedBody}>
              {saving ? '保存中…' : '日記を保存'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
