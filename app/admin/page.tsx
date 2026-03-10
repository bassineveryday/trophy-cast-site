'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/useAdminAuth';

interface DashboardStats {
  subscribers: {
    total: number | null;
  };
  bugs: {
    last30Days: number | null;
    recent: {
      id: string;
      created_at: string;
      description: string;
      member_name: string | null;
      page_path: string | null;
      device_info: string | null;
    }[];
  };
  supabase: {
    totalProfiles: number | null;
    newSignupsThisWeek: number | null;
    newSignupsThisMonth: number | null;
  } | null;
}

interface ActivityMember {
  name: string;
  lastSeenAt: string;
  lastScreen: string | null;
}

interface ActivityStats {
  onlineNow: number;
  activeToday: number;
  activeThisWeek: number;
  memberList: ActivityMember[];
  avgSessionMinutes: number | null;
  topScreens: { screen: string; count: number }[];
}

interface GoogleWorkspaceData {
  configured: boolean;
  folders: {
    key: string;
    label: string;
    icon: string;
    folderId: string | null;
  }[];
}

function timeAgo(isoString: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const QUICK_LINKS = [
  { label: 'Resend', href: 'https://resend.com/emails', icon: '📬' },
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
  const [activity, setActivity] = useState<ActivityStats | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [workspace, setWorkspace] = useState<GoogleWorkspaceData | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  const handleUnlock = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!pwInput.trim()) return;
      unlock(pwInput);
    },
    [pwInput, unlock]
  );

  const fetchActivity = useCallback(() => {
    if (!unlocked || !password) return;
    setActivityLoading(true);
    fetch('/api/admin/user-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then(async (r) => {
        if (r.status === 401) { lockOut(); return; }
        setActivity(await r.json());
      })
      .catch(() => {})
      .finally(() => setActivityLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked, password]);

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

  // Fetch live activity stats on mount, then auto-refresh every 30 seconds
  useEffect(() => {
    if (!unlocked || !password) return;
    fetchActivity();
    const interval = setInterval(fetchActivity, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked, password]);

  // Fetch Google Workspace connection & folder data
  useEffect(() => {
    if (!unlocked || !password) return;
    setWorkspaceLoading(true);
    fetch('/api/admin/google-workspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then(async (r) => {
        if (r.status === 401) { lockOut(); return; }
        setWorkspace(await r.json());
      })
      .catch(() => {})
      .finally(() => setWorkspaceLoading(false));
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

        {/* Stats — Audience */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted mb-4">Overview</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Newsletter"
              value={stats?.subscribers?.total ?? null}
              sub="Resend subscribers"
              accent="border-electric/30"
              loading={statsLoading}
            />
            <StatCard
              label="App Users"
              value={stats?.supabase?.totalProfiles ?? null}
              sub="all-time signups"
              accent="border-trophyGold/20"
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

        {/* Stats — App Health (Supabase) */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted mb-4">App Health</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label="Total Profiles"
              value={stats?.supabase?.totalProfiles ?? null}
              sub="all-time signups"
              accent="border-electric/30"
              loading={statsLoading}
            />
            <StatCard
              label="New This Week"
              value={stats?.supabase?.newSignupsThisWeek ?? null}
              sub="signups last 7 days"
              accent="border-bass/30"
              loading={statsLoading}
            />
            <StatCard
              label="New This Month"
              value={stats?.supabase?.newSignupsThisMonth ?? null}
              sub="signups last 30 days"
              accent="border-liftedPanel"
              loading={statsLoading}
            />
          </div>
        </section>

        {/* Stats — Live App Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted">Live App Activity</p>
            <div className="flex items-center gap-2">
              {activityLoading && (
                <span className="text-xs text-copyMuted/40 animate-pulse">refreshing…</span>
              )}
              <span className="text-xs text-copyMuted/40">auto-refreshes every 30s</span>
              <button
                onClick={fetchActivity}
                className="text-xs text-electric/60 hover:text-electric transition-colors ml-2"
              >
                ↻ refresh
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Online Now"
              value={activity?.onlineNow ?? null}
              sub="active in last 5 min"
              accent="border-green-500/40"
              loading={activityLoading}
            />
            <StatCard
              label="Active Today"
              value={activity?.activeToday ?? null}
              sub="last 24 hours"
              accent="border-electric/20"
              loading={activityLoading}
            />
            <StatCard
              label="Active This Week"
              value={activity?.activeThisWeek ?? null}
              sub="last 7 days"
              accent="border-liftedPanel"
              loading={activityLoading}
            />
            <StatCard
              label="Avg Session"
              value={activity?.avgSessionMinutes ?? null}
              sub="minutes (last 30 days)"
              accent="border-trophyGold/20"
              loading={activityLoading}
            />
          </div>

          {/* Member activity table */}
          {activity?.memberList && activity.memberList.length > 0 && (
            <div className="bg-deepPanel border border-liftedPanel rounded-2xl overflow-hidden mb-4">
              <div className="px-6 py-4 border-b border-liftedPanel">
                <p className="text-sm font-semibold text-copyLight">Member Activity</p>
                <p className="text-xs text-copyMuted/50 mt-0.5">most recently active first</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-copyMuted/50 uppercase tracking-wider border-b border-liftedPanel">
                      <th className="text-left px-6 py-3 font-medium">Member</th>
                      <th className="text-left px-6 py-3 font-medium">Last Seen</th>
                      <th className="text-left px-6 py-3 font-medium">Last Screen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.memberList.map((m, i) => {
                      const isOnline = Date.now() - new Date(m.lastSeenAt).getTime() < 5 * 60 * 1000;
                      return (
                        <tr
                          key={i}
                          className="border-b border-liftedPanel/50 hover:bg-liftedPanel/30 transition-colors"
                        >
                          <td className="px-6 py-3 text-copyLight font-medium flex items-center gap-2">
                            {isOnline && (
                              <span className="w-2 h-2 rounded-full bg-green-400 inline-block shrink-0" />
                            )}
                            {m.name}
                          </td>
                          <td className="px-6 py-3 text-copyMuted tabular-nums">
                            {timeAgo(m.lastSeenAt)}
                          </td>
                          <td className="px-6 py-3 text-copyMuted/70 font-mono text-xs">
                            {m.lastScreen ?? '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top screens */}
          {activity?.topScreens && activity.topScreens.length > 0 && (
            <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-6">
              <p className="text-sm font-semibold text-copyLight mb-4">
                Top Screens <span className="text-xs font-normal text-copyMuted/50 ml-1">(active members this week)</span>
              </p>
              <div className="space-y-2">
                {activity.topScreens.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-copyMuted/40 w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 bg-liftedPanel/50 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-electric/60 h-full rounded-full"
                        style={{ width: `${Math.round((s.count / activity.topScreens[0].count) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-copyMuted font-mono min-w-0 truncate">{s.screen}</span>
                    <span className="text-xs text-copyMuted/50 shrink-0">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Bassin' Everyday — Business Drive */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted mb-4">
            Bassin&apos; Everyday — Google Drive
          </p>

          <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🗂️</span>
                <div>
                  <p className="text-lg font-heading font-bold text-copyLight">
                    Business Drive
                  </p>
                  {workspaceLoading ? (
                    <p className="text-xs text-copyMuted/40 animate-pulse">checking…</p>
                  ) : workspace?.configured ? (
                    <p className="text-xs text-copyMuted">Folders configured</p>
                  ) : (
                    <p className="text-xs text-copyMuted/50">
                      Set BE_DRIVE_* env vars in Vercel to enable
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  workspace?.configured
                    ? 'bg-bass/20 text-bass border border-bass/30'
                    : 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/30'
                }`}
              >
                {workspaceLoading ? '…' : workspace?.configured ? 'Active' : 'Not Set Up'}
              </span>
            </div>

            {/* Folder Links Grid */}
            {workspace?.folders && workspace.folders.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {workspace.folders.map((folder) =>
                  folder.folderId ? (
                    <a
                      key={folder.key}
                      href={`https://drive.google.com/drive/folders/${folder.folderId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-liftedPanel/50 hover:bg-liftedPanel border border-liftedPanel hover:border-electric/30 rounded-xl px-4 py-3 transition-colors group"
                    >
                      <span className="text-lg">{folder.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-copyLight group-hover:text-electric transition-colors truncate">
                          {folder.label}
                        </p>
                      </div>
                      <span className="text-copyMuted/30 group-hover:text-electric/50 transition-colors text-sm">↗</span>
                    </a>
                  ) : (
                    <div
                      key={folder.key}
                      className="flex items-center gap-3 bg-liftedPanel/20 border border-liftedPanel/50 rounded-xl px-4 py-3 opacity-40"
                    >
                      <span className="text-lg">{folder.icon}</span>
                      <p className="text-sm text-copyMuted truncate">{folder.label}</p>
                    </div>
                  )
                )}
              </div>
            )}
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
                    Compose, polish with TC Coach, preview, and send or schedule the weekly email campaign
                  </p>
                </div>
                <span className="text-copyMuted/30 group-hover:text-electric/50 text-xl transition-colors ml-4 shrink-0">
                  →
                </span>
              </div>
              {stats?.subscribers?.total !== null && stats?.subscribers?.total !== undefined && (
                <p className="text-xs text-copyMuted/50 mt-5 pt-4 border-t border-liftedPanel">
                  Sends to{' '}
                  <span className="text-trophyGold font-bold">
                    {stats.subscribers.total.toLocaleString()}
                  </span>{' '}
                  subscribers
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

        {/* Recent Bug Reports */}
        {stats?.bugs.recent && stats.bugs.recent.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted">Recent Bug Reports</p>
              <Link href="/admin/bugs" className="text-xs text-electric/60 hover:text-electric transition-colors">
                view all →
              </Link>
            </div>
            <div className="bg-deepPanel border border-liftedPanel rounded-2xl overflow-hidden">
              <div className="divide-y divide-liftedPanel/50">
                {stats.bugs.recent.map((bug) => (
                  <div key={bug.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-copyLight leading-snug line-clamp-2">{bug.description}</p>
                        <p className="text-xs text-copyMuted/50 mt-1">
                          {bug.member_name ?? 'Unknown'}
                          {bug.page_path ? ` · ${bug.page_path}` : ''}
                          {' · '}{timeAgo(bug.created_at)}
                        </p>
                      </div>
                      {bug.device_info && (
                        <span className="text-xs text-copyMuted/30 font-mono shrink-0 max-w-[120px] truncate">
                          {bug.device_info}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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
