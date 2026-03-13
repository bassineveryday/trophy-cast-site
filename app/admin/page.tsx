'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/useAdminAuth';

const FEATURE_RANGE_OPTIONS = [7, 14, 30, 90] as const;

type FeatureRangeDays = (typeof FEATURE_RANGE_OPTIONS)[number];

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
  lastSessionMinutes: number | null;
  avgSessionMinutes: number | null;
  sessionCount: number;
  tier: 'power' | 'regular' | 'light' | 'dormant';
}

interface ActivityStats {
  onlineNow: number;
  activeToday: number;
  activeThisWeek: number;
  memberList: ActivityMember[];
  avgSessionMinutes: number | null;
  topScreens: { screen: string; count: number }[];
  engagement: { power: number; regular: number; light: number; dormant: number };
}

interface UsageInsight {
  icon: string;
  title: string;
  detail: string;
  tone: 'good' | 'warn' | 'info' | 'idea';
}

interface GrowthMember {
  id: string;
  name: string;
  joinedAt: string;
  lastSeenAt: string | null;
}

interface GrowthFollowUpMember extends GrowthMember {
  sessions: number;
}

interface GrowthStats {
  trackingStartedAt: string;
  signupsToday: number;
  signups7d: number;
  signups30d: number;
  active30d: number;
  trackedNewUsers: number;
  returnedAfterSignup: number;
  returnRate: number | null;
  eligible7d: number;
  retained7d: number;
  retention7dRate: number | null;
  eligible30d: number;
  retained30d: number;
  retention30dRate: number | null;
  inactive7d: number;
  inactive30d: number;
  newestMembers: GrowthMember[];
  followUpMembers: GrowthFollowUpMember[];
  dormantMembers: GrowthMember[];
}

interface FeatureAnalytics {
  rangeDays: number;
  catches: {
    logs: number;
    activeAnglers: number;
    photoRate: number | null;
    avgLogsPerDay: number;
    trend: { date: string; count: number }[];
    topSpecies: { species: string; count: number }[];
    topLakes: { lake: string; count: number }[];
  };
  coach: {
    askCoach: number;
    catchFeedback: number;
    patternRuns: number;
    voiceConversations: number;
    avgConversationTurns: number | null;
    trend: { date: string; count: number }[];
    topTopics: { topic: string; count: number }[];
  };
  tournaments: {
    registrations: number;
    paidEntries: number;
    boaters: number;
    coAnglers: number;
    trend: { date: string; count: number }[];
    upcomingEvents: {
      eventId: string;
      tournamentName: string;
      eventDate: string;
      registrations: number;
      paid: number;
    }[];
    topChannels: {
      eventId: string;
      tournamentName: string;
      eventDate: string;
      totalMessages: number;
      opsMessages: number;
      chatMessages: number;
    }[];
  };
  inbox: {
    messages: number;
    activeThreads: number;
    announcements: number;
    avgMessagesPerDay: number;
    trend: { date: string; count: number }[];
    breakdown: {
      direct_message: number;
      pairing_chat: number;
      tournament_ops: number;
      tournament_chat: number;
      club_announcement: number;
      board_message: number;
      group_chat: number;
    };
  };
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

function memberSince(isoString: string | null): string {
  if (!isoString) return '—';
  const days = Math.floor((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  const years = Math.floor(days / 365);
  return years === 1 ? '1 year' : `${years} years`;
}

function formatShortDate(isoString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(isoString));
}

function formatPercent(value: number | null): string {
  return value === null ? '—' : `${value}%`;
}

function rangeSummary(days: number): string {
  return `last ${days} days`;
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
  value: number | string | null;
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
          typeof value === 'number' ? value.toLocaleString() : value
        )}
      </p>
      {sub && <p className="text-xs text-copyMuted/50 mt-2">{sub}</p>}
    </div>
  );
}

function StatusPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'neutral' | 'good' | 'warn' | 'alert';
}) {
  const toneClass = {
    neutral: 'border-liftedPanel text-copyMuted bg-liftedPanel/20',
    good: 'border-bass/30 text-bass bg-bass/10',
    warn: 'border-trophyGold/30 text-trophyGold bg-trophyGold/10',
    alert: 'border-red-500/30 text-red-300 bg-red-500/10',
  }[tone];

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${toneClass}`}>
      <span className="uppercase tracking-wider text-[10px] opacity-70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function TrendBars({
  data,
  accent,
}: {
  data: { date: string; count: number }[];
  accent: string;
}) {
  const peak = Math.max(...data.map((point) => point.count), 0);

  return (
    <div>
      <div className="flex items-end gap-1 h-16">
        {data.map((point) => {
          const height = peak === 0 ? 6 : Math.max(8, Math.round((point.count / peak) * 100));
          return (
            <div key={point.date} className="flex-1 h-full flex items-end">
              <div className="w-full h-full rounded-sm bg-liftedPanel/40 overflow-hidden flex items-end">
                <div className={`${accent} w-full rounded-sm`} style={{ height: `${height}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      {data.length > 0 && (
        <div className="flex items-center justify-between mt-2 text-[10px] text-copyMuted/30 uppercase tracking-wider">
          <span>{formatShortDate(data[0].date)}</span>
          <span>{peak} peak</span>
          <span>{formatShortDate(data[data.length - 1].date)}</span>
        </div>
      )}
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
  const [growth, setGrowth] = useState<GrowthStats | null>(null);
  const [growthLoading, setGrowthLoading] = useState(false);
  const [features, setFeatures] = useState<FeatureAnalytics | null>(null);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [featureRangeDays, setFeatureRangeDays] = useState<FeatureRangeDays>(30);
  const [workspace, setWorkspace] = useState<GoogleWorkspaceData | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showAllScreens, setShowAllScreens] = useState(false);
  const [insights, setInsights] = useState<UsageInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const handleUnlock = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!pwInput.trim()) return;
      unlock(pwInput);
    },
    [pwInput, unlock]
  );

  const fetchStats = useCallback(async () => {
    if (!unlocked || !password) return;
    setStatsLoading(true);
    try {
      const r = await fetch('/api/admin/dashboard-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (r.status === 401) {
        lockOut();
        return;
      }
      setStats(await r.json());
    } catch {
    } finally {
      setStatsLoading(false);
    }
  }, [unlocked, password, lockOut]);

  const fetchActivity = useCallback(async (silent = false) => {
    if (!unlocked || !password) return;
    if (!silent) setActivityLoading(true);
    try {
      const r = await fetch('/api/admin/user-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (r.status === 401) {
        lockOut();
        return;
      }
      setActivity(await r.json());
    } catch {
    } finally {
      if (!silent) setActivityLoading(false);
    }
  }, [unlocked, password, lockOut]);

  const fetchGrowth = useCallback(async () => {
    if (!unlocked || !password) return;
    setGrowthLoading(true);
    try {
      const r = await fetch('/api/admin/growth-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (r.status === 401) {
        lockOut();
        return;
      }
      setGrowth(await r.json());
    } catch {
    } finally {
      setGrowthLoading(false);
    }
  }, [unlocked, password, lockOut]);

  const featureRangeDaysRef = useRef(featureRangeDays);
  featureRangeDaysRef.current = featureRangeDays;

  const fetchFeatures = useCallback(async (rangeDays?: FeatureRangeDays) => {
    if (!unlocked || !password) return;
    setFeaturesLoading(true);
    try {
      const r = await fetch('/api/admin/feature-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, rangeDays: rangeDays ?? featureRangeDaysRef.current }),
      });
      if (r.status === 401) {
        lockOut();
        return;
      }
      setFeatures(await r.json());
    } catch {
    } finally {
      setFeaturesLoading(false);
    }
  }, [unlocked, password, lockOut]);

  const fetchWorkspace = useCallback(async () => {
    if (!unlocked || !password) return;
    setWorkspaceLoading(true);
    try {
      const r = await fetch('/api/admin/google-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (r.status === 401) {
        lockOut();
        return;
      }
      setWorkspace(await r.json());
    } catch {
    } finally {
      setWorkspaceLoading(false);
    }
  }, [unlocked, password, lockOut]);

  const fetchInsights = useCallback(async () => {
    if (!unlocked || !password) return;
    setInsightsLoading(true);
    try {
      const r = await fetch('/api/admin/usage-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (r.status === 401) {
        lockOut();
        return;
      }
      const json = await r.json();
      setInsights(json.insights ?? []);
    } catch {
    } finally {
      setInsightsLoading(false);
    }
  }, [unlocked, password, lockOut]);

  const refreshAll = useCallback(async () => {
    if (!unlocked || !password) return;
    await Promise.all([
      fetchStats(),
      fetchActivity(),
      fetchGrowth(),
      fetchFeatures(),
      fetchWorkspace(),
      fetchInsights(),
    ]);
    setLastUpdatedAt(new Date().toISOString());
  }, [unlocked, password, fetchStats, fetchActivity, fetchGrowth, fetchFeatures, fetchWorkspace, fetchInsights]);

  // Fetch everything once when the dashboard is unlocked
  const didInitRef = useRef(false);
  useEffect(() => {
    if (!unlocked || !password) {
      didInitRef.current = false;
      return;
    }
    if (didInitRef.current) return;
    didInitRef.current = true;
    void refreshAll();
  }, [unlocked, password, refreshAll]);

  // Re-fetch only features when range selector changes (skip initial mount)
  const prevRangeRef = useRef(featureRangeDays);
  useEffect(() => {
    if (prevRangeRef.current === featureRangeDays) return;
    prevRangeRef.current = featureRangeDays;
    void fetchFeatures(featureRangeDays);
  }, [featureRangeDays, fetchFeatures]);

  useEffect(() => {
    if (!unlocked || !password) return;
    const interval = setInterval(() => {
      void fetchActivity(true);
    }, 30_000);
    return () => clearInterval(interval);
  }, [unlocked, password, fetchActivity]);

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

  const dashboardRefreshing = statsLoading || activityLoading || growthLoading || featuresLoading || workspaceLoading || insightsLoading;
  const displayedFeatureRange = features?.rangeDays ?? featureRangeDays;
  const growthReturnRate = growth?.returnRate ?? null;
  const growthRetention7dRate = growth?.retention7dRate ?? null;
  const growthRetention30dRate = growth?.retention30dRate ?? null;
  const attentionItems = [
    !workspaceLoading && !workspace?.configured
      ? {
          title: 'Business Drive needs setup',
          detail: 'Folder links and sync oversight are unavailable until the Drive env vars are configured.',
          tone: 'warn' as const,
        }
      : null,
    stats?.bugs.last30Days && stats.bugs.last30Days > 0
      ? {
          title: `${stats.bugs.last30Days} bug reports waiting`,
          detail: 'Review the newest app issues before they pile up across releases.',
          tone: 'alert' as const,
        }
      : null,
    growth?.followUpMembers.length
      ? {
          title: `${growth.followUpMembers.length} new members need follow-up`,
          detail: 'These recent signups have not shown a clear return session yet.',
          tone: 'warn' as const,
        }
      : null,
    growth?.inactive30d
      ? {
          title: `${growth.inactive30d} members inactive 30+ days`,
          detail: 'Use this to spot reactivation opportunities before members drift away.',
          tone: 'neutral' as const,
        }
      : null,
  ].filter(Boolean) as { title: string; detail: string; tone: 'neutral' | 'warn' | 'alert' }[];

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
        <div className="hidden md:flex items-center gap-3 text-xs">
          {lastUpdatedAt && (
            <span className="text-copyMuted/40">updated {timeAgo(lastUpdatedAt)}</span>
          )}
          {dashboardRefreshing && (
            <span className="text-copyMuted/40 animate-pulse">refreshing…</span>
          )}
          <button
            onClick={refreshAll}
            className="text-electric/70 hover:text-electric transition-colors"
          >
            ↻ refresh all
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* Command Center */}
        <section className="grid lg:grid-cols-[1.35fr_0.65fr] gap-4">
          <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted mb-3">Command Center</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-heading font-bold text-copyLight">Everything that matters, fast</h2>
                <p className="text-sm text-copyMuted mt-2 max-w-2xl">
                  Growth, retention, live usage, bugs, and ops health in one place.
                </p>
              </div>
              {growth?.trackingStartedAt && (
                <p className="text-xs text-copyMuted/40">
                  session tracking live since {formatShortDate(growth.trackingStartedAt)}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              <StatusPill
                label="Drive"
                value={workspaceLoading ? 'Checking' : workspace?.configured ? 'Connected' : 'Needs setup'}
                tone={workspace?.configured ? 'good' : 'warn'}
              />
              <StatusPill
                label="Bugs"
                value={statsLoading ? 'Checking' : `${stats?.bugs.last30Days ?? 0} in 30d`}
                tone={stats?.bugs.last30Days ? 'alert' : 'good'}
              />
              <StatusPill
                label="Live"
                value={activityLoading ? 'Refreshing' : `${activity?.onlineNow ?? 0} online now`}
                tone={(activity?.onlineNow ?? 0) > 0 ? 'good' : 'neutral'}
              />
              <StatusPill
                label="Return"
                value={growthLoading ? 'Calculating' : growthReturnRate === null ? 'Building history' : `${growthReturnRate}% tracked`}
                tone={growthReturnRate === null ? 'neutral' : growthReturnRate >= 50 ? 'good' : 'warn'}
              />
            </div>
          </div>

          <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted">Attention Queue</p>
              <button
                onClick={refreshAll}
                className="text-xs text-electric/60 hover:text-electric transition-colors"
              >
                ↻ refresh all
              </button>
            </div>
            <div className="space-y-3">
              {attentionItems.length > 0 ? (
                attentionItems.map((item) => (
                  <div key={item.title} className="rounded-xl border border-liftedPanel bg-liftedPanel/10 px-4 py-3">
                    <p className={`text-sm font-semibold ${item.tone === 'alert' ? 'text-red-300' : item.tone === 'warn' ? 'text-trophyGold' : 'text-copyLight'}`}>
                      {item.title}
                    </p>
                    <p className="text-xs text-copyMuted/60 mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-bass/20 bg-bass/10 px-4 py-4">
                  <p className="text-sm font-semibold text-bass">Nothing urgent right now</p>
                  <p className="text-xs text-copyMuted/60 mt-1">Drive is configured, bugs are quiet, and no obvious follow-up queue is forming.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* At a glance */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted mb-4">At A Glance</p>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard
              label="Waitlist"
              value={stats?.subscribers?.total ?? null}
              sub="Resend subscribers"
              accent="border-electric/30"
              loading={statsLoading}
            />
            <StatCard
              label="Profiles"
              value={stats?.supabase?.totalProfiles ?? null}
              sub="all-time accounts"
              accent="border-trophyGold/20"
              loading={statsLoading}
            />
            <StatCard
              label="New 7d"
              value={growth?.signups7d ?? null}
              sub="new signups this week"
              accent="border-bass/30"
              loading={growthLoading}
            />
            <StatCard
              label="Active 30d"
              value={growth?.active30d ?? null}
              sub="monthly active members"
              accent="border-liftedPanel"
              loading={growthLoading}
            />
            <StatCard
              label="Bugs 30d"
              value={stats?.bugs.last30Days ?? null}
              sub="recent app issues"
              accent="border-red-900/40"
              loading={statsLoading}
            />
            <StatCard
              label="Avg Session"
              value={activity?.avgSessionMinutes ?? null}
              sub="minutes across sessions"
              accent="border-electric/20"
              loading={activityLoading}
            />
          </div>
        </section>

        {/* Growth & retention */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted">Growth & Retention</p>
            {growth && growth.eligible7d === 0 && growth.eligible30d === 0 && (
              <p className="text-xs text-copyMuted/40">retention cohorts will populate as tracking history builds</p>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard
              label="New Today"
              value={growth?.signupsToday ?? null}
              sub="signups in last 24 hours"
              accent="border-electric/30"
              loading={growthLoading}
            />
            <StatCard
              label="New 30d"
              value={growth?.signups30d ?? null}
              sub="signups in last 30 days"
              accent="border-trophyGold/20"
              loading={growthLoading}
            />
            <StatCard
              label="Returned"
              value={growthReturnRate === null ? null : `${growthReturnRate}%`}
              sub={growth ? `${growth.returnedAfterSignup} of ${growth.trackedNewUsers} tracked signups came back` : 'tracked signups only'}
              accent="border-bass/30"
              loading={growthLoading}
            />
            <StatCard
              label="7d Retention"
              value={growthRetention7dRate === null ? null : `${growthRetention7dRate}%`}
              sub={growth?.eligible7d ? `${growth.retained7d} of ${growth.eligible7d} eligible` : 'awaiting enough history'}
              accent="border-electric/20"
              loading={growthLoading}
            />
            <StatCard
              label="30d Retention"
              value={growthRetention30dRate === null ? null : `${growthRetention30dRate}%`}
              sub={growth?.eligible30d ? `${growth.retained30d} of ${growth.eligible30d} eligible` : 'awaiting enough history'}
              accent="border-liftedPanel"
              loading={growthLoading}
            />
            <StatCard
              label="Inactive 30d"
              value={growth?.inactive30d ?? null}
              sub="members not seen recently"
              accent="border-red-900/40"
              loading={growthLoading}
            />
          </div>
        </section>

        {/* Member watchlists */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted mb-4">Member Watchlists</p>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="bg-deepPanel border border-liftedPanel rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-liftedPanel">
                <p className="text-sm font-semibold text-copyLight">Newest Signups</p>
                <p className="text-xs text-copyMuted/50 mt-0.5">who joined most recently</p>
              </div>
              <div className="divide-y divide-liftedPanel/50">
                {growth?.newestMembers?.length ? (
                  growth.newestMembers.map((member) => (
                    <div key={member.id} className="px-6 py-4">
                      <p className="text-sm font-medium text-copyLight">{member.name}</p>
                      <p className="text-xs text-copyMuted/50 mt-1">
                        joined {formatShortDate(member.joinedAt)}
                        {member.lastSeenAt ? ` · seen ${timeAgo(member.lastSeenAt)}` : ' · not active yet'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="px-6 py-6 text-sm text-copyMuted/50">No signup activity yet.</p>
                )}
              </div>
            </div>

            <div className="bg-deepPanel border border-liftedPanel rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-liftedPanel">
                <p className="text-sm font-semibold text-copyLight">Needs Follow-Up</p>
                <p className="text-xs text-copyMuted/50 mt-0.5">tracked signups without a clear return visit</p>
              </div>
              <div className="divide-y divide-liftedPanel/50">
                {growth?.followUpMembers?.length ? (
                  growth.followUpMembers.map((member) => (
                    <div key={member.id} className="px-6 py-4">
                      <p className="text-sm font-medium text-copyLight">{member.name}</p>
                      <p className="text-xs text-copyMuted/50 mt-1">
                        joined {formatShortDate(member.joinedAt)} · {member.sessions} tracked {member.sessions === 1 ? 'session' : 'sessions'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="px-6 py-6 text-sm text-copyMuted/50">No follow-up queue right now.</p>
                )}
              </div>
            </div>

            <div className="bg-deepPanel border border-liftedPanel rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-liftedPanel">
                <p className="text-sm font-semibold text-copyLight">Inactive 30+ Days</p>
                <p className="text-xs text-copyMuted/50 mt-0.5">members who have drifted away</p>
              </div>
              <div className="divide-y divide-liftedPanel/50">
                {growth?.dormantMembers?.length ? (
                  growth.dormantMembers.map((member) => (
                    <div key={member.id} className="px-6 py-4">
                      <p className="text-sm font-medium text-copyLight">{member.name}</p>
                      <p className="text-xs text-copyMuted/50 mt-1">
                        joined {formatShortDate(member.joinedAt)}
                        {member.lastSeenAt ? ` · last seen ${timeAgo(member.lastSeenAt)}` : ' · never tracked as active'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="px-6 py-6 text-sm text-copyMuted/50">Nobody is currently in the 30-day inactive bucket.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Feature analytics */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted">Feature Analytics</p>
              <p className="text-xs text-copyMuted/40 mt-1">showing {rangeSummary(displayedFeatureRange)}</p>
            </div>
            <div className="inline-flex items-center rounded-full border border-liftedPanel bg-deepPanel/60 p-1">
              {FEATURE_RANGE_OPTIONS.map((option) => {
                const isActive = featureRangeDays === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFeatureRangeDays(option)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-electric text-midnight'
                        : 'text-copyMuted/70 hover:text-copyLight'
                    }`}
                  >
                    {option}d
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm font-semibold text-copyLight">Catch Logging</p>
                  <p className="text-xs text-copyMuted/50 mt-0.5">who is logging fish and how complete the logs are</p>
                </div>
                <span className="text-2xl">🎣</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.catches.logs?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">logs in {displayedFeatureRange} days</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.catches.avgLogsPerDay?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">avg logs per day</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.catches.activeAnglers?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">active anglers</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : formatPercent(features?.catches.photoRate ?? null)}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">with photos</p>
                </div>
              </div>
              <div className="border-t border-liftedPanel/50 pt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-copyMuted/40 mb-3">{displayedFeatureRange}-Day Trend</p>
                  <TrendBars data={features?.catches.trend ?? []} accent="bg-electric/60" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-copyMuted/40 mb-3">Top Species</p>
                    <div className="space-y-2">
                      {features?.catches.topSpecies?.length ? (
                        features.catches.topSpecies.map((species) => (
                          <div key={species.species} className="flex items-center justify-between gap-4 text-sm">
                            <span className="text-copyLight">{species.species}</span>
                            <span className="text-copyMuted/60">{species.count}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-copyMuted/50">No catch activity yet.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-copyMuted/40 mb-3">Top Lakes</p>
                    <div className="space-y-2">
                      {features?.catches.topLakes?.length ? (
                        features.catches.topLakes.map((lake) => (
                          <div key={lake.lake} className="flex items-center justify-between gap-4 text-sm">
                            <span className="text-copyLight truncate">{lake.lake}</span>
                            <span className="text-copyMuted/60">{lake.count}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-copyMuted/50">No named lakes in recent catch logs.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm font-semibold text-copyLight">TC Coach</p>
                  <p className="text-xs text-copyMuted/50 mt-0.5">chat prompts, post-catch coaching, and voice conversation flow</p>
                </div>
                <span className="text-2xl">✨</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.coach.askCoach?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">Ask TC Coach in {displayedFeatureRange} days</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.coach.catchFeedback?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">post-catch responses</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.coach.patternRuns?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">pattern runs</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.coach.voiceConversations?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">voice conversations saved</p>
                </div>
              </div>
              <div className="border-t border-liftedPanel/50 pt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-copyMuted/40 mb-3">{displayedFeatureRange}-Day Trend</p>
                  <TrendBars data={features?.coach.trend ?? []} accent="bg-trophyGold/70" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-copyLight font-medium">{featuresLoading ? '—' : features?.coach.avgConversationTurns?.toLocaleString() ?? '—'}</p>
                      <p className="text-xs text-copyMuted/50 mt-1">avg turns per voice conversation</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-copyMuted/40 mb-3">Top Coach Topics</p>
                    <div className="space-y-2">
                      {features?.coach.topTopics?.length ? (
                        features.coach.topTopics.map((topic) => (
                          <div key={topic.topic} className="flex items-center justify-between gap-4 text-sm">
                            <span className="text-copyLight">{topic.topic}</span>
                            <span className="text-copyMuted/60">{topic.count}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-copyMuted/50">No TC Coach prompts yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm font-semibold text-copyLight">Tournaments</p>
                  <p className="text-xs text-copyMuted/50 mt-0.5">registration flow and what is coming up next</p>
                </div>
                <span className="text-2xl">🏁</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.tournaments.registrations?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">registrations in {displayedFeatureRange} days</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.tournaments.paidEntries?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">paid entries</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.tournaments.boaters?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">boater signups</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.tournaments.coAnglers?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">co-angler signups</p>
                </div>
              </div>
              <div className="border-t border-liftedPanel/50 pt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-copyMuted/40 mb-3">{displayedFeatureRange}-Day Trend</p>
                  <TrendBars data={features?.tournaments.trend ?? []} accent="bg-bass/70" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-copyMuted/40 mb-3">Upcoming Registered Events</p>
                    <div className="space-y-3">
                      {features?.tournaments.upcomingEvents?.length ? (
                        features.tournaments.upcomingEvents.slice(0, 4).map((event) => (
                          <div key={event.eventId} className="flex items-center justify-between gap-4 text-sm">
                            <div className="min-w-0 flex-1">
                              <p className="text-copyLight truncate">{event.tournamentName}</p>
                              <p className="text-xs text-copyMuted/50 mt-1">{formatShortDate(event.eventDate)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-copyLight">{event.registrations}</p>
                              <p className="text-xs text-copyMuted/50 mt-1">{event.paid} paid</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-copyMuted/50">No upcoming registered events found.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-copyMuted/40 mb-3">Most Active Tournament Channels</p>
                    <div className="space-y-3">
                      {features?.tournaments.topChannels?.length ? (
                        features.tournaments.topChannels.map((channel) => (
                          <div key={channel.eventId} className="flex items-center justify-between gap-4 text-sm">
                            <div className="min-w-0 flex-1">
                              <p className="text-copyLight truncate">{channel.tournamentName}</p>
                              <p className="text-xs text-copyMuted/50 mt-1">
                                {channel.opsMessages} ops · {channel.chatMessages} chat
                              </p>
                            </div>
                            <span className="text-copyMuted/60">{channel.totalMessages}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-copyMuted/50">No tournament channel traffic yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm font-semibold text-copyLight">Inbox Activity</p>
                  <p className="text-xs text-copyMuted/50 mt-0.5">chat traffic across DMs, tournament channels, groups, and announcements</p>
                </div>
                <span className="text-2xl">💬</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.inbox.messages?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">messages in {displayedFeatureRange} days</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.inbox.avgMessagesPerDay?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">avg messages per day</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.inbox.activeThreads?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">active DM threads</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-copyLight">{featuresLoading ? '—' : features?.inbox.announcements?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-copyMuted/50 mt-1">announcements posted</p>
                </div>
              </div>
              <div className="border-t border-liftedPanel/50 pt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-copyMuted/40 mb-3">{displayedFeatureRange}-Day Trend</p>
                  <TrendBars data={features?.inbox.trend ?? []} accent="bg-electric/70" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-copyMuted/70">Direct</span>
                    <span className="text-copyLight">{features?.inbox.breakdown.direct_message ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-copyMuted/70">Pairing</span>
                    <span className="text-copyLight">{features?.inbox.breakdown.pairing_chat ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-copyMuted/70">Tournament Ops</span>
                    <span className="text-copyLight">{features?.inbox.breakdown.tournament_ops ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-copyMuted/70">Tournament Chat</span>
                    <span className="text-copyLight">{features?.inbox.breakdown.tournament_chat ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-copyMuted/70">Group Chat</span>
                    <span className="text-copyLight">{features?.inbox.breakdown.group_chat ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-copyMuted/70">Announcement Msgs</span>
                    <span className="text-copyLight">{features?.inbox.breakdown.club_announcement ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
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
                onClick={() => {
                  void fetchActivity();
                }}
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
          {activity?.memberList && activity.memberList.length > 0 && (() => {
            const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
            const recentMembers = activity.memberList.filter(
              (m) => new Date(m.lastSeenAt).getTime() >= oneDayAgo
            );
            const allMembers = activity.memberList;
            const listToShow = showAllMembers ? allMembers : recentMembers.slice(0, 5);
            const hiddenCount = showAllMembers
              ? 0
              : allMembers.length - Math.min(recentMembers.length, 5);

            const tierBadge = (tier: string) => {
              const styles: Record<string, string> = {
                power: 'bg-bass/20 text-bass border-bass/30',
                regular: 'bg-electric/20 text-electric border-electric/30',
                light: 'bg-trophyGold/20 text-trophyGold border-trophyGold/30',
                dormant: 'bg-liftedPanel text-copyMuted/50 border-liftedPanel',
              };
              return (
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles[tier] ?? styles.dormant}`}>
                  {tier}
                </span>
              );
            };

            return (
              <div className="bg-deepPanel border border-liftedPanel rounded-2xl overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-liftedPanel flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-copyLight">Member Activity</p>
                    <p className="text-xs text-copyMuted/50 mt-0.5">
                      {showAllMembers ? 'all members, most recent first' : 'active in last 24 hours'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {activity.engagement && (
                      <div className="hidden md:flex items-center gap-2 text-[10px]">
                        <span className="text-bass">{activity.engagement.power} power</span>
                        <span className="text-copyMuted/30">·</span>
                        <span className="text-electric">{activity.engagement.regular} regular</span>
                        <span className="text-copyMuted/30">·</span>
                        <span className="text-trophyGold">{activity.engagement.light} light</span>
                        <span className="text-copyMuted/30">·</span>
                        <span className="text-copyMuted/50">{activity.engagement.dormant} dormant</span>
                      </div>
                    )}
                    {(allMembers.length > 5 || recentMembers.length > 5) && (
                      <button
                        onClick={() => setShowAllMembers((v) => !v)}
                        className="text-xs text-electric/60 hover:text-electric transition-colors"
                      >
                        {showAllMembers ? '▲ show less' : `▼ show all ${allMembers.length}`}
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-copyMuted/50 uppercase tracking-wider border-b border-liftedPanel">
                        <th className="text-left px-6 py-3 font-medium">Member</th>
                        <th className="text-left px-6 py-3 font-medium">Last Seen</th>
                        <th className="text-left px-6 py-3 font-medium">Last Session</th>
                        <th className="text-left px-6 py-3 font-medium">Avg Session</th>
                        <th className="text-left px-6 py-3 font-medium">Sessions</th>
                        <th className="text-left px-6 py-3 font-medium">Tier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listToShow.map((m, i) => {
                        const isOnline = Date.now() - new Date(m.lastSeenAt).getTime() < 5 * 60 * 1000;
                        return (
                          <tr
                            key={i}
                            className="border-b border-liftedPanel/50 hover:bg-liftedPanel/30 transition-colors"
                          >
                            <td className="px-6 py-3 text-copyLight font-medium">
                              <span className="flex items-center gap-2">
                                {isOnline && (
                                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block shrink-0" />
                                )}
                                {m.name}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-copyMuted tabular-nums">
                              {timeAgo(m.lastSeenAt)}
                            </td>
                            <td className="px-6 py-3 text-copyMuted tabular-nums">
                              {m.lastSessionMinutes !== null ? `${m.lastSessionMinutes} min` : '—'}
                            </td>
                            <td className="px-6 py-3 text-copyMuted tabular-nums">
                              {m.avgSessionMinutes !== null ? `${m.avgSessionMinutes} min` : '—'}
                            </td>
                            <td className="px-6 py-3 text-copyMuted/60 tabular-nums text-xs">
                              {m.sessionCount > 0 ? m.sessionCount : '—'}
                            </td>
                            <td className="px-6 py-3">{tierBadge(m.tier)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {!showAllMembers && hiddenCount > 0 && (
                  <button
                    onClick={() => setShowAllMembers(true)}
                    className="w-full px-6 py-3 text-xs text-copyMuted/50 hover:text-electric hover:bg-liftedPanel/20 transition-colors text-center border-t border-liftedPanel/50"
                  >
                    + {hiddenCount} more — tap to expand
                  </button>
                )}
              </div>
            );
          })()}

          {/* Top screens */}
          {activity?.topScreens && activity.topScreens.length > 0 && (() => {
            const screensToShow = showAllScreens
              ? activity.topScreens
              : activity.topScreens.slice(0, 5);
            const hiddenScreens = activity.topScreens.length - 5;
            return (
              <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-copyLight">
                    Top Screens <span className="text-xs font-normal text-copyMuted/50 ml-1">(active members this week)</span>
                  </p>
                  {activity.topScreens.length > 5 && (
                    <button
                      onClick={() => setShowAllScreens((v) => !v)}
                      className="text-xs text-electric/60 hover:text-electric transition-colors"
                    >
                      {showAllScreens ? '▲ show less' : `▼ show all ${activity.topScreens.length}`}
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {screensToShow.map((s, i) => (
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
                {!showAllScreens && hiddenScreens > 0 && (
                  <button
                    onClick={() => setShowAllScreens(true)}
                    className="w-full mt-3 pt-3 text-xs text-copyMuted/50 hover:text-electric transition-colors text-center border-t border-liftedPanel/50"
                  >
                    + {hiddenScreens} more — tap to expand
                  </button>
                )}
              </div>
            );
          })()}
        </section>

        {/* AI Usage Insights */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-copyMuted">
              AI Usage Insights
            </p>
            <button
              onClick={() => { void fetchInsights(); }}
              className="text-xs text-electric/60 hover:text-electric transition-colors"
            >
              ↻ refresh insights
            </button>
          </div>

          {insightsLoading ? (
            <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-8 text-center">
              <p className="text-copyMuted/50 animate-pulse">Analyzing usage patterns…</p>
            </div>
          ) : insights.length === 0 ? (
            <div className="bg-deepPanel border border-liftedPanel rounded-2xl p-8 text-center">
              <p className="text-copyMuted/50">No insights yet — data is still accumulating.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {insights.map((insight, i) => {
                const toneBorder: Record<string, string> = {
                  good: 'border-bass/30',
                  warn: 'border-red-500/30',
                  info: 'border-liftedPanel',
                  idea: 'border-trophyGold/30',
                };
                const toneAccent: Record<string, string> = {
                  good: 'text-bass',
                  warn: 'text-red-300',
                  info: 'text-copyLight',
                  idea: 'text-trophyGold',
                };
                return (
                  <div key={i} className={`bg-deepPanel border rounded-2xl p-5 ${toneBorder[insight.tone] ?? toneBorder.info}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0">{insight.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold ${toneAccent[insight.tone] ?? toneAccent.info}`}>
                          {insight.title}
                        </p>
                        <p className="text-xs text-copyMuted/60 mt-1.5 leading-relaxed">
                          {insight.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
