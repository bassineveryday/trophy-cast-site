'use client';

import { KeyRound, RefreshCw, Trophy } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/useAdminAuth';

interface MagicLinkState {
  loading: boolean;
  link: string | null;
  error: string | null;
  expiresAt: number | null;
}

export default function MemberAccessPage() {
  const { password, unlocked, authError, unlock, lockOut } = useAdminAuth();
  const [pwInput, setPwInput] = useState('');
  const [email, setEmail] = useState('');
  const [magicLink, setMagicLink] = useState<MagicLinkState>({
    loading: false,
    link: null,
    error: null,
    expiresAt: null,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleUnlock = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!pwInput.trim()) return;
      unlock(pwInput);
    },
    [pwInput, unlock]
  );

  const generateLink = useCallback(async () => {
    if (!password || !email.trim()) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setMagicLink({ loading: true, link: null, error: null, expiresAt: null });

    try {
      const res = await fetch('/api/admin/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          email: email.trim(),
          reason: 'Admin member access from /admin/member-access',
        }),
      });
      const json = await res.json();

      if (res.status === 401) {
        lockOut();
        return;
      }
      if (!res.ok) {
        setMagicLink({ loading: false, link: null, error: json.error ?? 'Failed to generate link', expiresAt: null });
        return;
      }

      const expiresAt = Date.now() + 60_000;
      setMagicLink({ loading: false, link: json.action_link, error: null, expiresAt });

      timerRef.current = setInterval(() => {
        if (Date.now() >= expiresAt) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setMagicLink({ loading: false, link: null, error: null, expiresAt: null });
        }
      }, 1_000);
    } catch {
      setMagicLink({ loading: false, link: null, error: 'Network error. Try again.', expiresAt: null });
    }
  }, [password, email, lockOut]);

  const secsLeft = magicLink.expiresAt
    ? Math.max(0, Math.ceil((magicLink.expiresAt - Date.now()) / 1000))
    : 0;

  // ── Password gate ──────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <Trophy className="h-12 w-12 text-trophyGold" strokeWidth={2.2} />
            </div>
            <h1 className="text-3xl font-heading font-bold text-trophyGold">Admin</h1>
            <p className="text-copyMuted mt-2">Enter your password to continue</p>
          </div>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              autoFocus
              placeholder="Admin password"
              className="w-full bg-deepPanel border border-liftedPanel rounded-xl px-5 py-4 text-copyLight text-lg focus:outline-none focus:border-electric placeholder:text-copyMuted/40"
            />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-bass hover:bg-bassLight text-white font-bold py-4 rounded-xl font-heading text-lg transition-colors"
            >
              Unlock →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Member Access view ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-midnight">
      {/* Top bar */}
      <div className="border-b border-liftedPanel bg-deeperPanel px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-electric mb-0.5">
            <Link href="/admin" className="hover:text-copyLight transition-colors">Admin</Link>
            {' / Member Access'}
          </p>
          <h1 className="text-2xl font-heading font-bold text-trophyGold">Member Access</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-12 space-y-8">
        <p className="text-copyMuted text-sm leading-relaxed">
          Enter any member&apos;s email to generate a one-time magic link. The link opens the app
          logged in as that member — use it for support sessions and access verification.
          Every link is audit-logged.
        </p>

        <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-7 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-copyMuted/60 uppercase tracking-wider mb-2">
              Member Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Clear previous result when email changes
                if (magicLink.link || magicLink.error) {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setMagicLink({ loading: false, link: null, error: null, expiresAt: null });
                }
              }}
              placeholder="member@example.com"
              className="w-full bg-midnight border border-liftedPanel rounded-xl px-5 py-4 text-copyLight text-base focus:outline-none focus:border-electric placeholder:text-copyMuted/40"
            />
          </div>

          <button
            onClick={generateLink}
            disabled={magicLink.loading || !email.trim()}
            className="w-full flex items-center justify-center gap-2 bg-bass hover:bg-bassLight disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl font-heading text-base transition-colors"
          >
            {magicLink.loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" strokeWidth={2.2} />
                Generating…
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" strokeWidth={2.2} />
                Generate Magic Link
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {magicLink.error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-5 py-4">
            <p className="text-red-400 text-sm">{magicLink.error}</p>
          </div>
        )}

        {magicLink.link && (
          <div className="bg-electric/5 border border-electric/30 rounded-xl px-5 py-5 space-y-3">
            <p className="text-xs font-semibold text-copyMuted/50 uppercase tracking-wider">
              Magic Link Ready
            </p>
            <a
              href={magicLink.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-electric/20 border border-electric/40 text-electric font-semibold text-sm px-5 py-3 rounded-lg hover:bg-electric/30 transition-colors"
            >
              Open App as {email} →
            </a>
            <p className="text-xs text-copyMuted/40">
              {secsLeft > 0 ? `Expires in ${secsLeft}s` : 'Expired — generate a new one'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
