import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch all stats in parallel
    const [onlineRes, todayRes, weekRes, memberListRes, sessionsRes, screenNavRes] =
      await Promise.allSettled([
        // Online now (last_seen_at within 5 min)
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gte('last_seen_at', fiveMinAgo),

        // Active today (last_seen_at within 24h)
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gte('last_seen_at', oneDayAgo),

        // Active this week (last_seen_at within 7 days)
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gte('last_seen_at', oneWeekAgo),

        // Member list — last 50 seen, most recent first
        supabase
          .from('profiles')
          .select('id, name, last_seen_at, last_active_screen, created_at')
          .not('last_seen_at', 'is', null)
          .order('last_seen_at', { ascending: false })
          .limit(50),

        // All completed sessions (last 30 days) — we'll compute per-member stats
        supabase
          .from('user_sessions')
          .select('user_id, duration_seconds, created_at')
          .not('duration_seconds', 'is', null)
          .gte('created_at', thirtyDaysAgo)
          .order('created_at', { ascending: false })
          .limit(2000),

        // Top screens by active member count (last 7 days)
        supabase
          .from('profiles')
          .select('last_active_screen')
          .not('last_active_screen', 'is', null)
          .gte('last_seen_at', oneWeekAgo),
      ]);

    // --- Parse results ---

    const onlineNow =
      onlineRes.status === 'fulfilled' ? (onlineRes.value.count ?? 0) : 0;

    const activeToday =
      todayRes.status === 'fulfilled' ? (todayRes.value.count ?? 0) : 0;

    const activeThisWeek =
      weekRes.status === 'fulfilled' ? (weekRes.value.count ?? 0) : 0;

    // --- Build per-member session stats ---
    interface SessionRow { user_id: string; duration_seconds: number; created_at: string }
    const allSessions: SessionRow[] =
      sessionsRes.status === 'fulfilled' ? (sessionsRes.value.data ?? []) : [];

    // Group sessions by user_id
    const userSessionMap = new Map<string, SessionRow[]>();
    let totalDuration = 0;
    let totalSessionCount = 0;
    for (const s of allSessions) {
      totalDuration += s.duration_seconds ?? 0;
      totalSessionCount++;
      const existing = userSessionMap.get(s.user_id);
      if (existing) {
        existing.push(s);
      } else {
        userSessionMap.set(s.user_id, [s]);
      }
    }

    const avgSessionMinutes =
      totalSessionCount > 0 ? Math.round(totalDuration / totalSessionCount / 60) : null;

    // Build member list with session data
    const memberList =
      memberListRes.status === 'fulfilled'
        ? (memberListRes.value.data ?? []).map((m: any) => {
            const sessions = userSessionMap.get(m.id) ?? [];
            const sessionCount = sessions.length;
            // Last session = most recent by created_at (sessions already sorted desc)
            const lastSessionSeconds = sessions.length > 0 ? (sessions[0].duration_seconds ?? 0) : null;
            // Avg session for this member
            const avgSeconds =
              sessionCount > 0
                ? Math.round(sessions.reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0) / sessionCount)
                : null;
            // Engagement tier
            let tier: 'power' | 'regular' | 'light' | 'dormant' = 'dormant';
            const daysSinceSeen = m.last_seen_at
              ? Math.floor((Date.now() - new Date(m.last_seen_at).getTime()) / (1000 * 60 * 60 * 24))
              : 999;
            if (daysSinceSeen <= 3 && sessionCount >= 5) tier = 'power';
            else if (daysSinceSeen <= 7) tier = 'regular';
            else if (daysSinceSeen <= 30) tier = 'light';

            return {
              name: m.name ?? 'Unknown',
              lastSeenAt: m.last_seen_at,
              lastSessionMinutes: lastSessionSeconds !== null ? Math.round(lastSessionSeconds / 60) : null,
              avgSessionMinutes: avgSeconds !== null ? Math.round(avgSeconds / 60) : null,
              sessionCount,
              tier,
            };
          })
        : [];

    // Tally screen counts
    const screenCounts: Record<string, number> = {};
    if (screenNavRes.status === 'fulfilled' && screenNavRes.value.data) {
      for (const row of screenNavRes.value.data as { last_active_screen: string }[]) {
        const screen = row.last_active_screen;
        screenCounts[screen] = (screenCounts[screen] ?? 0) + 1;
      }
    }
    const topScreens = Object.entries(screenCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([screen, count]) => ({ screen, count }));

    // Engagement summary
    const tiers = { power: 0, regular: 0, light: 0, dormant: 0 };
    for (const m of memberList) {
      tiers[m.tier as keyof typeof tiers]++;
    }

    return NextResponse.json({
      onlineNow,
      activeToday,
      activeThisWeek,
      memberList,
      avgSessionMinutes,
      topScreens,
      engagement: tiers,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
