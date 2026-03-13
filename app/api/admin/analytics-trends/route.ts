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

/** Format a Date to YYYY-MM-DD string */
function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Generate array of date strings from startDate to endDate inclusive */
function dateRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const d = new Date(startDate);
  while (d <= endDate) {
    dates.push(toDateStr(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const today = toDateStr(now);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const allDates = dateRange(thirtyDaysAgo, now);

    // Fetch all needed data in parallel
    const [sessionsRes, profilesRes, screensRes] = await Promise.allSettled([
      // All sessions from last 30 days
      supabase
        .from('user_sessions')
        .select('user_id, duration_seconds, session_start, created_at')
        .not('duration_seconds', 'is', null)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true })
        .limit(5000),

      // All profiles with activity data
      supabase
        .from('profiles')
        .select('id, last_seen_at, last_active_screen')
        .not('last_seen_at', 'is', null),

      // Screen distribution for last 7 days
      supabase
        .from('profiles')
        .select('last_active_screen')
        .not('last_active_screen', 'is', null)
        .gte('last_seen_at', sevenDaysAgo.toISOString()),
    ]);

    interface SessionRow {
      user_id: string;
      duration_seconds: number;
      session_start: string | null;
      created_at: string;
    }
    interface ProfileRow {
      id: string;
      last_seen_at: string;
      last_active_screen: string | null;
    }

    const sessions: SessionRow[] =
      sessionsRes.status === 'fulfilled' ? (sessionsRes.value.data ?? []) : [];
    const profiles: ProfileRow[] =
      profilesRes.status === 'fulfilled' ? (profilesRes.value.data ?? []) : [];
    const screenRows: { last_active_screen: string }[] =
      screensRes.status === 'fulfilled' ? (screensRes.value.data ?? []) : [];

    // ── 1. DAU Trend (30 days) ──────────────────────────────────────────
    // Group profiles by the date of last_seen_at to build daily active users
    // Better approach: use sessions to count unique users per day
    const usersByDay = new Map<string, Set<string>>();
    for (const s of sessions) {
      const day = toDateStr(new Date(s.created_at));
      const set = usersByDay.get(day);
      if (set) {
        set.add(s.user_id);
      } else {
        usersByDay.set(day, new Set([s.user_id]));
      }
    }

    const dauTrend = allDates.map((date) => ({
      date,
      users: usersByDay.get(date)?.size ?? 0,
    }));

    // ── 2. Sessions Trend (30 days) — count + avg duration per day ──────
    const sessionsByDay = new Map<string, number[]>();
    for (const s of sessions) {
      const day = toDateStr(new Date(s.created_at));
      const existing = sessionsByDay.get(day);
      if (existing) {
        existing.push(s.duration_seconds);
      } else {
        sessionsByDay.set(day, [s.duration_seconds]);
      }
    }

    const sessionsTrend = allDates.map((date) => {
      const durations = sessionsByDay.get(date) ?? [];
      const total = durations.reduce((sum, d) => sum + d, 0);
      return {
        date,
        sessions: durations.length,
        avgMinutes: durations.length > 0 ? Math.round((total / durations.length / 60) * 10) / 10 : 0,
      };
    });

    // ── 3. Peak Hours (24-hour breakdown from last 7 days) ──────────────
    const hourCounts = new Array(24).fill(0);
    const recentSessions = sessions.filter(
      (s) => new Date(s.created_at).getTime() >= sevenDaysAgo.getTime()
    );

    for (const s of recentSessions) {
      const utcHour = new Date(s.session_start ?? s.created_at).getUTCHours();
      // Convert to MST (UTC-7)
      const mstHour = (utcHour - 7 + 24) % 24;
      hourCounts[mstHour]++;
    }

    const peakHours = hourCounts.map((count, hour) => {
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return {
        hour,
        label: `${displayHour}${period}`,
        sessions: count,
      };
    });

    // ── 4. Screen Popularity ────────────────────────────────────────────
    const screenCounts: Record<string, number> = {};
    for (const row of screenRows) {
      screenCounts[row.last_active_screen] = (screenCounts[row.last_active_screen] ?? 0) + 1;
    }
    const totalScreenMembers = screenRows.length;
    const screenTime = Object.entries(screenCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([screen, members]) => ({
        screen,
        members,
        percentage: totalScreenMembers > 0 ? Math.round((members / totalScreenMembers) * 100) : 0,
      }));

    // ── 5. Stickiness (DAU / WAU ratio) ─────────────────────────────────
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const dau = profiles.filter(
      (p) => new Date(p.last_seen_at).getTime() >= oneDayAgo.getTime()
    ).length;
    const wau = profiles.filter(
      (p) => new Date(p.last_seen_at).getTime() >= sevenDaysAgo.getTime()
    ).length;
    const stickinessRatio = wau > 0 ? Math.round((dau / wau) * 100) : 0;

    // ── 6. Week-over-Week Comparison ────────────────────────────────────
    const thisWeekSessions = sessions.filter(
      (s) => new Date(s.created_at).getTime() >= sevenDaysAgo.getTime()
    );
    const lastWeekSessions = sessions.filter((s) => {
      const t = new Date(s.created_at).getTime();
      return t >= fourteenDaysAgo.getTime() && t < sevenDaysAgo.getTime();
    });

    const thisWeekUsers = new Set(thisWeekSessions.map((s) => s.user_id));
    const lastWeekUsers = new Set(lastWeekSessions.map((s) => s.user_id));

    const thisWeekAvg =
      thisWeekSessions.length > 0
        ? Math.round(
            thisWeekSessions.reduce((sum, s) => sum + s.duration_seconds, 0) /
              thisWeekSessions.length /
              60 *
              10
          ) / 10
        : 0;
    const lastWeekAvg =
      lastWeekSessions.length > 0
        ? Math.round(
            lastWeekSessions.reduce((sum, s) => sum + s.duration_seconds, 0) /
              lastWeekSessions.length /
              60 *
              10
          ) / 10
        : 0;

    const pctChange = (curr: number, prev: number) =>
      prev > 0 ? Math.round(((curr - prev) / prev) * 100) : curr > 0 ? 100 : 0;

    const weekOverWeek = {
      thisWeek: {
        users: thisWeekUsers.size,
        sessions: thisWeekSessions.length,
        avgMinutes: thisWeekAvg,
      },
      lastWeek: {
        users: lastWeekUsers.size,
        sessions: lastWeekSessions.length,
        avgMinutes: lastWeekAvg,
      },
      change: {
        users: pctChange(thisWeekUsers.size, lastWeekUsers.size),
        sessions: pctChange(thisWeekSessions.length, lastWeekSessions.length),
        avgMinutes: pctChange(thisWeekAvg, lastWeekAvg),
      },
    };

    // ── 7. Session Duration Distribution (buckets) ──────────────────────
    const durationBuckets = [
      { label: '<1 min', min: 0, max: 60 },
      { label: '1–5 min', min: 60, max: 300 },
      { label: '5–15 min', min: 300, max: 900 },
      { label: '15–30 min', min: 900, max: 1800 },
      { label: '30+ min', min: 1800, max: Infinity },
    ];

    const durationDistribution = durationBuckets.map((bucket) => ({
      label: bucket.label,
      count: sessions.filter(
        (s) => s.duration_seconds >= bucket.min && s.duration_seconds < bucket.max
      ).length,
    }));

    return NextResponse.json({
      dauTrend,
      sessionsTrend,
      peakHours,
      screenTime,
      stickiness: { dau, wau, ratio: stickinessRatio },
      weekOverWeek,
      durationDistribution,
      today,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
