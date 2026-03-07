'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/useAdminAuth';

interface DashboardStats {
  mailchimp: {
    totalMembers: number | null;
    appUserCount: number | null;
    waitlistCount: number | null;
  };
  bugs: { last30Days: number | null };
}

const QUICK_LINKS = [
  { label: 'Mailchimp', href: 'https://mailchimp.com', icon: '📬' },
  { label: 'Supabase', href: 'https://supabase.com/dashboard/project/pxmffkaiwpvnpfrhfeco', icon: '🗄️' },
  { label: 'Vercel', href: 'https://vercel.com/dashboard', icon: '▲' },
  { label: 'GitHub', href: 'https://github.com/bassineveryday', icon: '🐙' },
  { label: 'Live App', href: 'https://trophycast.app', icon: '🎣' },
] as const;

function StatCard({
  label,
  value,
  sub,
  accent,
  loading,
}: {
  label: string;
  value: number | null;
  sub?: string;
  accent: string;
  loading: boolean;
}) {
  return (
    <div className={`bg-deepPanel border rounded-2xl p-6 ${accent}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted mb-3">{label}</p>
      <p className="text-4xl font-heading font-bold text-copyLight leading-none">
        {loading ? (
          <span className="text-copyMuted/30 text-xl">—</span>
        ) : value === null ? (
          <span className="text-copyMuted/40 text-xl">—</span>
        ) : (
          value.toLocaleString()
        )}
      </p>
      {sub && <p className="text-xs text-copyMuted/50 mt-2">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { password, unlocked, authError, unlock, lockOut } = useAdminAuth();
  const [pwInput, setPwInput] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const handleUnlock = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!pwInput.trim()) return;
      unlock(pwInput);
    },
    [pwInput, unlock]
  );

  useEffect(() => {
    if (!unlocked || !password) return;
    setStatsLoading(true);
    fetch('/api/admin/dashboard-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then(async (r) => {
        if (r.status === 401) { lockOut(); return; }
        setStats(await r.json());
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked, password]);

  // ── Password gate ──────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-5xl mb-4">🏆</p>
            <h1 className="text-3xl font-heading font-bold text-trophyGold">Admin Dashboard</h1>
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

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-midnight">
      {/* Top bar */}
      <div className="border-b border-liftedPanel bg-deeperPanel px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-electric mb-0.5">
            Trophy Cast
          </p>
          <h1 className="text-2xl font-heading font-bold text-trophyGold">Admin Dashboard</h1>
        </div>
        <p className="text-copyMuted/40 text-xs hidden md:block">trophycast.app</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">

        {/* Stats */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted mb-4">Overview</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="App Users"
              value={stats?.mailchimp.appUserCount ?? null}
              sub="app-user segment"
              accent="border-electric/30"
              loading={statsLoading}
            />
            <StatCard
              label="Waitlist"
              value={stats?.mailchimp.waitlistCount ?? null}
              sub="waiting to join"
              accent="border-trophyGold/20"
              loading={statsLoading}
            />
            <StatCard
              label="Total Audience"
              value={stats?.mailchimp.totalMembers ?? null}
              sub="all Mailchimp subscribers"
              accent="border-liftedPanel"
              loading={statsLoading}
            />
            <StatCard
              label="Bug Reports"
              value={stats?.bugs.last30Days ?? null}
              sub="last 30 days"
              accent="border-red-900/40"
              loading={statsLoading}
            />
          </div>
        </section>

        {/* Tools */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted mb-4">Tools</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Link
              href="/admin/weekly-email"
              className="group bg-deepPanel border border-liftedPanel hover:border-electric/40 rounded-2xl p-7 transition-colors block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl mb-4">📧</p>
                  <p className="text-xl font-heading font-bold text-copyLight group-hover:text-electric transition-colors">
                    Weekly Email
                  </p>
                  <p className="text-copyMuted text-sm mt-2 leading-relaxed">
                    Compose, AI-polish, preview, and send or schedule the weekly Mailchimp campaign
                  </p>
                </div>
                <span className="text-copyMuted/30 group-hover:text-electric/50 text-xl transition-colors ml-4 shrink-0">
                  →
                </span>
              </div>
              {stats?.mailchimp.appUserCount !== null && stats?.mailchimp.appUserCount !== undefined && (
                <p className="text-xs text-copyMuted/50 mt-5 pt-4 border-t border-liftedPanel">
                  Sends to{' '}
                  <span className="text-trophyGold font-bold">
                    {stats.mailchimp.appUserCount.toLocaleString()}
                  </span>{' '}
                  app-user subscribers
                </p>
              )}
            </Link>

            <Link
              href="/admin/bugs"
              className="group bg-deepPanel border border-liftedPanel hover:border-red-500/30 rounded-2xl p-7 transition-colors block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl mb-4">🐛</p>
                  <p className="text-xl font-heading font-bold text-copyLight group-hover:text-red-400 transition-colors">
                    Bug Reports
                  </p>
                  <p className="text-copyMuted text-sm mt-2 leading-relaxed">
                    View bug reports submitted from the Trophy Cast app — member name, device, page, and description
                  </p>
                </div>
                <span className="text-copyMuted/30 group-hover:text-red-400/50 text-xl transition-colors ml-4 shrink-0">
                  →
                </span>
              </div>
              {stats?.bugs.last30Days !== null && stats?.bugs.last30Days !== undefined && (
                <p className="text-xs text-copyMuted/50 mt-5 pt-4 border-t border-liftedPanel">
                  <span className={`font-bold ${stats.bugs.last30Days > 0 ? 'text-red-400' : 'text-bass'}`}>
                    {stats.bugs.last30Days}
                  </span>{' '}
                  {stats.bugs.last30Days === 1 ? 'report' : 'reports'} in the last 30 days
                </p>
              )}
            </Link>

          </div>
        </section>

        {/* Quick Links */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted mb-4">Quick Links</p>
          <div className="flex flex-wrap gap-3">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-deepPanel border border-liftedPanel hover:border-electric/30 hover:bg-liftedPanel text-copyMuted hover:text-copyLight rounded-xl px-5 py-3 text-sm font-medium transition-colors"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
