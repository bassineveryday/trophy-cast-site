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
    const [onlineRes, todayRes, weekRes, memberListRes, avgSessionRes, topScreensRes] =
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
          .select('name, last_seen_at, last_active_screen')
          .not('last_seen_at', 'is', null)
          .order('last_seen_at', { ascending: false })
          .limit(50),

        // Average session length (last 30 days, completed sessions only)
        supabase
          .from('user_sessions')
          .select('duration_seconds')
          .not('duration_seconds', 'is', null)
          .gte('created_at', thirtyDaysAgo),

        // Top screens by active member count
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

    const memberList =
      memberListRes.status === 'fulfilled'
        ? (memberListRes.value.data ?? []).map((m: any) => ({
            name: m.name ?? 'Unknown',
            lastSeenAt: m.last_seen_at,
            lastScreen: m.last_active_screen ?? null,
          }))
        : [];

    // Compute average session length in minutes
    let avgSessionMinutes: number | null = null;
    if (avgSessionRes.status === 'fulfilled' && avgSessionRes.value.data?.length) {
      const sessions = avgSessionRes.value.data as { duration_seconds: number }[];
      const total = sessions.reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0);
      avgSessionMinutes = Math.round(total / sessions.length / 60);
    }

    // Tally screen counts
    const screenCounts: Record<string, number> = {};
    if (topScreensRes.status === 'fulfilled' && topScreensRes.value.data) {
      for (const row of topScreensRes.value.data as { last_active_screen: string }[]) {
        const screen = row.last_active_screen;
        screenCounts[screen] = (screenCounts[screen] ?? 0) + 1;
      }
    }
    const topScreens = Object.entries(screenCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([screen, count]) => ({ screen, count }));

    return NextResponse.json({
      onlineNow,
      activeToday,
      activeThisWeek,
      memberList,
      avgSessionMinutes,
      topScreens,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
