'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { HandDrawnSvg } from '@/components/HandDrawnSvg';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'auth-failed') {
      const reason = params.get('reason');
      setErrorMsg(
        `Googleの承認後、Calendarへのログイン完了に失敗しました。${reason ? `詳細: ${reason}` : 'もう一度お試しください。'}`
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setMessage(null);
    setLoading(true);

    try {
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      const authRequest = isSignUp
        ? supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                display_name: displayName || email.split('@')[0],
              },
            },
          })
        : supabase.auth.signInWithPassword({ email, password });
      const result = await Promise.race([
        authRequest,
        new Promise<never>((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new Error('接続に時間がかかっています。ネットワークを確認して、もう一度お試しください。')),
            15000
          );
        }),
      ]).finally(() => {
        if (timeoutId) clearTimeout(timeoutId);
      });
      if (result.error) throw result.error;

      if (isSignUp) {
        if (result.data.session) {
          router.push('/');
          router.refresh();
        } else {
          setMessage('確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。（※メール確認を無効にしている場合はそのままログインできます）');
        }
      } else {
        if (!result.data.session) {
          throw new Error('ログイン応答は届きましたが、ログイン状態を確認できませんでした。もう一度お試しください。');
        }
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      const reason = err?.message || '';
      console.error('ログイン処理に失敗しました:', reason);
      setErrorMsg(
        /fetch|network|load failed/i.test(reason)
          ? 'サーバーに接続できませんでした。ネットワークを確認して、もう一度お試しください。'
          : reason || '認証に失敗しました。入力内容を確認して、もう一度お試しください。'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setMessage(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      if (!data.url) throw new Error('Googleログインを開始できませんでした。SupabaseのGoogle認証設定を確認してください。');
      window.location.assign(data.url);
    } catch (err: any) {
      const reason = err?.message || '';
      console.error('Googleログインを開始できませんでした:', reason);
      setErrorMsg(
        /provider.*(not enabled|disabled|unsupported)|unsupported provider/i.test(reason)
          ? 'GoogleログインはSupabase側でまだ有効になっていません。AuthenticationのProvidersでGoogleを有効にしてください。'
          : reason || 'Googleログインを開始できませんでした。Supabaseの設定を確認してください。'
      );
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
          <div role="alert" aria-live="polite" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6文字以上のパスワード"
                className="w-full px-3.5 py-2.5 pr-11 bg-[#faf4f2] border border-[#f2e3df] rounded-xl text-sm outline-none focus:border-[#e89587] focus:bg-white focus:ring-2 focus:ring-[#e89587]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#9e8e8a] hover:text-[#5c4d49]"
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#e89587] hover:bg-[#dc8475] active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-pink transition-all disabled:opacity-60 disabled:cursor-wait mt-2"
          >
            {loading ? '処理中...' : isSignUp ? '登録して始める' : 'ログイン'}
          </button>
          {loading && (
            <p role="status" aria-live="polite" className="text-center text-xs text-[#9e8e8a]">
              Supabaseに接続しています。15秒以内に応答がない場合はエラーを表示します。
            </p>
          )}
        </form>

        <div className="flex items-center gap-3 my-5 text-xs text-[#b6a6a2]">
          <span className="h-px flex-1 bg-[#f2e3df]" />
          または
          <span className="h-px flex-1 bg-[#f2e3df]" />
        </div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#e8dcd8] hover:bg-[#faf7f6] text-[#5c4d49] font-bold rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="w-5 h-5">
            <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
            <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
            <path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18Z" />
            <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.4 11.4-8.4Z" />
          </svg>
          Googleでログイン / 登録
        </button>

        <div className="mt-8 text-center">
          <Image
            src="/title-cat.png?v=2"
            alt="Mascot"
            width={80}
            height={80}
            className="inline-block w-20 h-20 object-contain opacity-85 hover:opacity-100 transition-opacity"
          />
          <p className="text-[11px] text-[#9e8e8a] mt-2 font-medium">
            Take it easy. 今日もまったりいきましょう
          </p>
        </div>
      </div>
    </div>
  );
}
