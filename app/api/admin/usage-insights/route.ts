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

interface Insight {
  icon: string;
  title: string;
  detail: string;
  tone: 'good' | 'warn' | 'info' | 'idea';
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch data for analysis
    const [sessionsRes, profilesRes, screensRes] = await Promise.allSettled([
      // All sessions from last 30 days
      supabase
        .from('user_sessions')
        .select('user_id, duration_seconds, created_at')
        .not('duration_seconds', 'is', null)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: false })
        .limit(3000),

      // All profiles with activity
      supabase
        .from('profiles')
        .select('id, name, last_seen_at, last_active_screen, created_at')
        .not('last_seen_at', 'is', null)
        .order('last_seen_at', { ascending: false }),

      // Screen distribution for active members
      supabase
        .from('profiles')
        .select('last_active_screen')
        .not('last_active_screen', 'is', null)
        .gte('last_seen_at', sevenDaysAgo),
    ]);

    interface SessionRow { user_id: string; duration_seconds: number; created_at: string }
    interface ProfileRow { id: string; name: string; last_seen_at: string; last_active_screen: string | null; created_at: string }

    const sessions: SessionRow[] = sessionsRes.status === 'fulfilled' ? (sessionsRes.value.data ?? []) : [];
    const profiles: ProfileRow[] = profilesRes.status === 'fulfilled' ? (profilesRes.value.data ?? []) : [];
    const screenRows: { last_active_screen: string }[] = screensRes.status === 'fulfilled' ? (screensRes.value.data ?? []) : [];

    const insights: Insight[] = [];

    // --- Analysis 1: Session duration trends ---
    const recentSessions = sessions.filter(s => new Date(s.created_at).getTime() >= new Date(sevenDaysAgo).getTime());
    const olderSessions = sessions.filter(s => new Date(s.created_at).getTime() < new Date(sevenDaysAgo).getTime());

    const avgRecent = recentSessions.length > 0
      ? recentSessions.reduce((sum, s) => sum + s.duration_seconds, 0) / recentSessions.length / 60
      : 0;
    const avgOlder = olderSessions.length > 0
      ? olderSessions.reduce((sum, s) => sum + s.duration_seconds, 0) / olderSessions.length / 60
      : 0;

    if (avgRecent > 0 && avgOlder > 0) {
      const changePercent = Math.round(((avgRecent - avgOlder) / avgOlder) * 100);
      if (changePercent > 15) {
        insights.push({
          icon: '📈',
          title: `Session times up ${changePercent}%`,
          detail: `Members are spending more time in the app this week (${avgRecent.toFixed(1)} min vs ${avgOlder.toFixed(1)} min avg). Whatever you changed recently is working.`,
          tone: 'good',
        });
      } else if (changePercent < -15) {
        insights.push({
          icon: '📉',
          title: `Session times down ${Math.abs(changePercent)}%`,
          detail: `Avg session dropped from ${avgOlder.toFixed(1)} min to ${avgRecent.toFixed(1)} min. Members may be bouncing faster — check if a recent change made navigation confusing or removed a sticky feature.`,
          tone: 'warn',
        });
      } else {
        insights.push({
          icon: '⏱️',
          title: `Session times steady at ~${avgRecent.toFixed(1)} min`,
          detail: 'No significant change in how long members stay per visit. Consistent engagement is a good baseline.',
          tone: 'info',
        });
      }
    } else if (sessions.length === 0) {
      insights.push({
        icon: '📊',
        title: 'Not enough session data yet',
        detail: 'Session tracking was recently enabled. Insights will improve as more data accumulates over the next few weeks.',
        tone: 'info',
      });
    }

    // --- Analysis 2: Power users vs dormant ---
    const userSessionCounts = new Map<string, number>();
    for (const s of sessions) {
      userSessionCounts.set(s.user_id, (userSessionCounts.get(s.user_id) ?? 0) + 1);
    }

    const totalTrackedUsers = profiles.length;
    const activeUsers7d = profiles.filter(p => new Date(p.last_seen_at).getTime() >= new Date(sevenDaysAgo).getTime()).length;
    const dormantUsers = profiles.filter(p => {
      const daysSince = (Date.now() - new Date(p.last_seen_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 30;
    }).length;

    if (totalTrackedUsers > 0) {
      const activePercent = Math.round((activeUsers7d / totalTrackedUsers) * 100);
      const dormantPercent = Math.round((dormantUsers / totalTrackedUsers) * 100);

      if (activePercent >= 50) {
        insights.push({
          icon: '🔥',
          title: `${activePercent}% of members active this week`,
          detail: `${activeUsers7d} of ${totalTrackedUsers} tracked members used the app in the last 7 days. Strong engagement.`,
          tone: 'good',
        });
      } else if (activePercent >= 25) {
        insights.push({
          icon: '👥',
          title: `${activePercent}% weekly active rate`,
          detail: `${activeUsers7d} of ${totalTrackedUsers} members. Consider push notifications or a weekly recap email to bring back the other ${totalTrackedUsers - activeUsers7d}.`,
          tone: 'info',
        });
      } else {
        insights.push({
          icon: '⚠️',
          title: `Only ${activePercent}% active this week`,
          detail: `Most members haven't opened the app recently. A tournament reminder, leaderboard update, or personal message from a TD could re-engage them.`,
          tone: 'warn',
        });
      }

      if (dormantPercent > 40) {
        insights.push({
          icon: '💤',
          title: `${dormantUsers} members dormant 30+ days`,
          detail: `${dormantPercent}% of tracked members. Consider a "We miss you" email, a season preview, or highlighting new features they haven't seen.`,
          tone: 'warn',
        });
      }
    }

    // --- Analysis 3: Screen popularity insights ---
    const screenCounts: Record<string, number> = {};
    for (const row of screenRows) {
      screenCounts[row.last_active_screen] = (screenCounts[row.last_active_screen] ?? 0) + 1;
    }
    const sortedScreens = Object.entries(screenCounts).sort((a, b) => b[1] - a[1]);

    if (sortedScreens.length > 0) {
      const [topScreen, topCount] = sortedScreens[0];
      const totalScreenViews = sortedScreens.reduce((sum, [, c]) => sum + c, 0);
      const topPercent = Math.round((topCount / totalScreenViews) * 100);

      insights.push({
        icon: '📱',
        title: `Most popular: ${topScreen}`,
        detail: `${topPercent}% of active members land on ${topScreen}. ${
          topPercent > 60
            ? 'This screen is clearly the anchor — invest in making it faster and more useful.'
            : 'Usage is spread across screens, which is healthy.'
        }`,
        tone: 'info',
      });

      // Check for underused features
      const catchScreen = sortedScreens.find(([s]) => s.toLowerCase().includes('catch') || s.toLowerCase().includes('log'));
      const coachScreen = sortedScreens.find(([s]) => s.toLowerCase().includes('coach') || s.toLowerCase().includes('ai'));
      const tournamentScreen = sortedScreens.find(([s]) => s.toLowerCase().includes('tournament'));

      const underused: string[] = [];
      if (!catchScreen || catchScreen[1] < 3) underused.push('Catch Logging');
      if (!coachScreen || coachScreen[1] < 3) underused.push('AI Coach');

      if (underused.length > 0) {
        insights.push({
          icon: '💡',
          title: `Underused features: ${underused.join(', ')}`,
          detail: 'Few active members are using these. Consider adding prompts, tooltips, or a "Did you know?" banner on the home screen to drive discovery.',
          tone: 'idea',
        });
      }

      if (tournamentScreen && tournamentScreen[1] >= 5) {
        insights.push({
          icon: '🏆',
          title: 'Tournament screens getting traffic',
          detail: `${tournamentScreen[1]} members on tournament pages. This is your stickiest feature — make sure registration, chat, and results are frictionless.`,
          tone: 'good',
        });
      }
    }

    // --- Analysis 4: Short sessions (bounce detection) ---
    const shortSessions = recentSessions.filter(s => s.duration_seconds < 30);
    if (recentSessions.length >= 5) {
      const bounceRate = Math.round((shortSessions.length / recentSessions.length) * 100);
      if (bounceRate > 40) {
        insights.push({
          icon: '🚪',
          title: `${bounceRate}% bounce rate (< 30s sessions)`,
          detail: `${shortSessions.length} of ${recentSessions.length} recent sessions lasted under 30 seconds. Members open the app and leave immediately. Check: is the home screen loading slowly? Is there content that changes daily to keep them engaged?`,
          tone: 'warn',
        });
      } else if (bounceRate < 15) {
        insights.push({
          icon: '🎯',
          title: `Low bounce rate: ${bounceRate}%`,
          detail: 'Most members who open the app stay and engage. That\'s a great sign — the home screen is doing its job.',
          tone: 'good',
        });
      }
    }

    // --- Analysis 5: Peak usage suggestion ---
    const hourCounts = new Array(24).fill(0);
    for (const s of recentSessions) {
      const hour = new Date(s.created_at).getUTCHours();
      // Rough MST offset (-7)
      const localHour = (hour - 7 + 24) % 24;
      hourCounts[localHour]++;
    }
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    if (recentSessions.length >= 10) {
      const period = peakHour < 12 ? 'AM' : 'PM';
      const displayHour = peakHour === 0 ? 12 : peakHour > 12 ? peakHour - 12 : peakHour;
      insights.push({
        icon: '🕐',
        title: `Peak usage around ${displayHour} ${period}`,
        detail: `Members are most active around ${displayHour}:00 ${period} (MST). Schedule announcements, tournament reminders, and push notifications for this window.`,
        tone: 'idea',
      });
    }

    return NextResponse.json({ insights });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
