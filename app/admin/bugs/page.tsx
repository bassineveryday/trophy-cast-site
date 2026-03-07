'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/useAdminAuth';

interface BugReport {
  id: string;
  created_at: string;
  description: string;
  member_name: string | null;
  member_email: string | null;
  page_path: string | null;
  device_info: string | null;
  club_id: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function BugReportsPage() {
  const { password, unlocked, authError, unlock, lockOut } = useAdminAuth();
  const [pwInput, setPwInput] = useState('');
  const [reports, setReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState('');

  const handleUnlock = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!pwInput.trim()) return;
      unlock(pwInput);
    },
    [pwInput, unlock]
  );

  const fetchReports = useCallback(
    async (pw: string) => {
      setLoading(true);
      setFetchError('');
      try {
        const res = await fetch('/api/admin/bug-reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pw }),
        });
        if (res.status === 401) { lockOut(); return; }
        const data = await res.json();
        if (!res.ok) { setFetchError(data.error ?? 'Failed to load.'); return; }
        setReports(data.reports ?? []);
      } catch {
        setFetchError('Network error. Try again.');
      } finally {
        setLoading(false);
      }
    },
    [lockOut]
  );

  useEffect(() => {
    if (unlocked && password) fetchReports(password);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked, password]);

  // ── Password gate ──────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-5xl mb-4">🏆</p>
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

  // ── Bug Reports view ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-midnight">
      {/* Top bar */}
      <div className="border-b border-liftedPanel bg-deeperPanel px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-electric mb-0.5">
            <Link href="/admin" className="hover:text-copyLight transition-colors">Admin</Link>
            {' / Bug Reports'}
          </p>
          <h1 className="text-2xl font-heading font-bold text-trophyGold">Bug Reports</h1>
        </div>
        <button
          onClick={() => fetchReports(password)}
          disabled={loading}
          className="text-sm text-copyMuted hover:text-copyLight transition-colors disabled:opacity-40"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-copyMuted text-center py-16 text-lg">Loading reports…</p>
        ) : fetchError ? (
          <div className="text-center py-16">
            <p className="text-red-400">{fetchError}</p>
            <button
              onClick={() => fetchReports(password)}
              className="mt-4 text-electric underline text-sm"
            >
              Retry
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-copyMuted text-lg">No bug reports yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-copyMuted/50 text-sm mb-5">
              {reports.length} most recent reports — click to expand
            </p>
            {reports.map((r) => (
              <div
                key={r.id}
                className="bg-deepPanel border border-liftedPanel rounded-xl overflow-hidden"
              >
                {/* Row — always visible */}
                <button
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-liftedPanel/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1.5">
                      <span className="text-xs text-copyMuted/50">{formatDate(r.created_at)}</span>
                      {r.member_name && (
                        <span className="text-xs font-semibold text-electric">{r.member_name}</span>
                      )}
                      {r.club_id && (
                        <span className="text-xs bg-liftedPanel text-copyMuted/60 px-2 py-0.5 rounded-full">
                          {r.club_id}
                        </span>
                      )}
                    </div>
                    <p className="text-copyLight text-sm leading-relaxed line-clamp-2">
                      {r.description}
                    </p>
                    {r.page_path && (
                      <p className="text-copyMuted/40 text-xs mt-1 truncate">
                        📍 {r.page_path}
                      </p>
                    )}
                  </div>
                  <span className="text-copyMuted/30 shrink-0 mt-0.5 text-xs">
                    {expanded === r.id ? '▲' : '▼'}
                  </span>
                </button>

                {/* Expanded detail */}
                {expanded === r.id && (
                  <div className="px-6 pb-7 pt-4 border-t border-liftedPanel space-y-5">
                    <div>
                      <p className="text-xs font-semibold text-copyMuted/50 uppercase tracking-wider mb-2">
                        Full Description
                      </p>
                      <p className="text-copyLight text-sm leading-relaxed whitespace-pre-wrap">
                        {r.description}
                      </p>
                    </div>

                    {r.member_email && (
                      <div>
                        <p className="text-xs font-semibold text-copyMuted/50 uppercase tracking-wider mb-2">
                          Member Email
                        </p>
                        <a
                          href={`mailto:${r.member_email}`}
                          className="text-electric text-sm underline"
                        >
                          {r.member_email}
                        </a>
                      </div>
                    )}

                    {r.page_path && (
                      <div>
                        <p className="text-xs font-semibold text-copyMuted/50 uppercase tracking-wider mb-2">
                          Page / Screen
                        </p>
                        <p className="text-copyMuted text-sm font-mono">{r.page_path}</p>
                      </div>
                    )}

                    {r.device_info && (
                      <div>
                        <p className="text-xs font-semibold text-copyMuted/50 uppercase tracking-wider mb-2">
                          Device
                        </p>
                        <p className="text-copyMuted/60 text-xs font-mono break-all leading-relaxed">
                          {r.device_info}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
