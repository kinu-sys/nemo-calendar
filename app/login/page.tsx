'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { HandDrawnSvg } from '@/components/HandDrawnSvg';
import Image from 'next/image';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName || email.split('@')[0],
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          router.push('/');
          router.refresh();
        } else {
          setMessage('確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。（※メール確認を無効にしている場合はそのままログインできます）');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || '認証に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#f2e3df] shadow-soft p-8 text-[#5c4d49]">
        {/* ロゴ */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#faf4f2] border border-[#f2e3df] rounded-full flex items-center justify-center shadow-subtle mb-3">
            <HandDrawnSvg iconKey="cat" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold font-quicksand text-[#e89587] tracking-wider">
            Nemo Calendar
          </h1>
          <p className="text-xs text-[#9e8e8a] mt-1 font-medium">
            みんなで使える、やさしい共有カレンダー
          </p>
        </div>

        {/* タブ切り替え */}
        <div className="flex border-b border-[#f2e3df] mb-6">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-bold text-center border-b-2 transition-all ${
              !isSignUp
                ? 'border-[#e89587] text-[#e89587]'
                : 'border-transparent text-[#9e8e8a] hover:text-[#5c4d49]'
            }`}
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
            }}
          >
            ログイン
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-bold text-center border-b-2 transition-all ${
              isSignUp
                ? 'border-[#e89587] text-[#e89587]'
                : 'border-transparent text-[#9e8e8a] hover:text-[#5c4d49]'
            }`}
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
            }}
          >
            新規アカウント作成
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-[#5c4d49] mb-1.5">
                お名前（ニックネーム）
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="例: みかん、田中"
                className="w-full px-3.5 py-2.5 bg-[#faf4f2] border border-[#f2e3df] rounded-xl text-sm outline-none focus:border-[#e89587] focus:bg-white focus:ring-2 focus:ring-[#e89587]/20 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#5c4d49] mb-1.5">
              メールアドレス
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 bg-[#faf4f2] border border-[#f2e3df] rounded-xl text-sm outline-none focus:border-[#e89587] focus:bg-white focus:ring-2 focus:ring-[#e89587]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5c4d49] mb-1.5">
              パスワード
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上のパスワード"
              className="w-full px-3.5 py-2.5 bg-[#faf4f2] border border-[#f2e3df] rounded-xl text-sm outline-none focus:border-[#e89587] focus:bg-white focus:ring-2 focus:ring-[#e89587]/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#e89587] hover:bg-[#dc8475] active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? '処理中...' : isSignUp ? '登録して始める' : 'ログイン'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Image
            src="/cat-illustration.png"
            alt="Mascot"
            width={100}
            height={70}
            className="inline-block opacity-85 hover:opacity-100 transition-opacity"
          />
          <p className="text-[11px] text-[#9e8e8a] mt-2 font-medium">
            Take it easy. 今日もまったりいきましょう
          </p>
        </div>
      </div>
    </div>
  );
}
