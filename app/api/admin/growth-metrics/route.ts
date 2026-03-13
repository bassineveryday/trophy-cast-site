import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const TRACKING_STARTED_AT = '2026-03-08T00:00:00.000Z';
const DAY_MS = 24 * 60 * 60 * 1000;
const RETURN_AFTER_MS = 30 * 60 * 1000;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ProfileRow {
  id: string;
  name: string | null;
  created_at: string;
  last_seen_at: string | null;
}

interface SessionRow {
  user_id: string;
  created_at: string;
}

function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function hasReturnedAfterSignup(profile: ProfileRow, sessionMap: Map<string, number[]>): boolean {
  const createdAtMs = new Date(profile.created_at).getTime();
  const sessions = sessionMap.get(profile.id) ?? [];
  return sessions.some((time, index) => index > 0 || time - createdAtMs >= RETURN_AFTER_MS);
}

function hasSessionAfter(userId: string, thresholdMs: number, sessionMap: Map<string, number[]>): boolean {
  const sessions = sessionMap.get(userId) ?? [];
  return sessions.some((time) => time >= thresholdMs);
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trackingStartedMs = new Date(TRACKING_STARTED_AT).getTime();
    const sinceTrackingIso = new Date(trackingStartedMs).toISOString();

    const [profilesResult, sessionsResult] = await Promise.allSettled([
      supabase
        .from('profiles')
        .select('id, name, created_at, last_seen_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('user_sessions')
        .select('user_id, created_at')
        .gte('created_at', sinceTrackingIso),
    ]);

    const profiles =
      profilesResult.status === 'fulfilled' && !profilesResult.value.error
        ? ((profilesResult.value.data ?? []) as ProfileRow[])
        : [];

    const sessions =
      sessionsResult.status === 'fulfilled' && !sessionsResult.value.error
        ? ((sessionsResult.value.data ?? []) as SessionRow[])
        : [];

    const sessionMap = new Map<string, number[]>();
    for (const session of sessions) {
      const time = new Date(session.created_at).getTime();
      const existing = sessionMap.get(session.user_id);
      if (existing) {
        existing.push(time);
      } else {
        sessionMap.set(session.user_id, [time]);
      }
    }
    Array.from(sessionMap.values()).forEach((entry) => {
      entry.sort((a, b) => a - b);
    });

    const nowMs = Date.now();
    const since1dMs = nowMs - DAY_MS;
    const since7dMs = nowMs - 7 * DAY_MS;
    const since30dMs = nowMs - 30 * DAY_MS;

    const signupsToday = profiles.filter((profile) => new Date(profile.created_at).getTime() >= since1dMs).length;
    const signups7d = profiles.filter((profile) => new Date(profile.created_at).getTime() >= since7dMs).length;
    const signups30d = profiles.filter((profile) => new Date(profile.created_at).getTime() >= since30dMs).length;
    const active30d = profiles.filter(
      (profile) => profile.last_seen_at && new Date(profile.last_seen_at).getTime() >= since30dMs
    ).length;
    const inactive7d = profiles.filter(
      (profile) => !profile.last_seen_at || new Date(profile.last_seen_at).getTime() < since7dMs
    ).length;
    const inactive30d = profiles.filter(
      (profile) => !profile.last_seen_at || new Date(profile.last_seen_at).getTime() < since30dMs
    ).length;

    const trackedProfiles = profiles.filter(
      (profile) => new Date(profile.created_at).getTime() >= trackingStartedMs
    );
    const returnedAfterSignup = trackedProfiles.filter((profile) => hasReturnedAfterSignup(profile, sessionMap)).length;
    const returnRate = trackedProfiles.length
      ? Math.round((returnedAfterSignup / trackedProfiles.length) * 100)
      : null;

    const eligible7dProfiles = trackedProfiles.filter(
      (profile) => new Date(profile.created_at).getTime() <= since7dMs
    );
    const retained7d = eligible7dProfiles.filter((profile) =>
      hasSessionAfter(profile.id, new Date(profile.created_at).getTime() + 7 * DAY_MS, sessionMap)
    ).length;
    const retention7dRate = eligible7dProfiles.length
      ? Math.round((retained7d / eligible7dProfiles.length) * 100)
      : null;

    const eligible30dProfiles = trackedProfiles.filter(
      (profile) => new Date(profile.created_at).getTime() <= since30dMs
    );
    const retained30d = eligible30dProfiles.filter((profile) =>
      hasSessionAfter(profile.id, new Date(profile.created_at).getTime() + 30 * DAY_MS, sessionMap)
    ).length;
    const retention30dRate = eligible30dProfiles.length
      ? Math.round((retained30d / eligible30dProfiles.length) * 100)
      : null;

    const newestMembers = profiles.slice(0, 5).map((profile) => ({
      id: profile.id,
      name: profile.name ?? 'Unknown',
      joinedAt: profile.created_at,
      lastSeenAt: profile.last_seen_at,
    }));

    const followUpMembers = trackedProfiles
      .filter((profile) => !hasReturnedAfterSignup(profile, sessionMap))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .slice(0, 5)
      .map((profile) => ({
        id: profile.id,
        name: profile.name ?? 'Unknown',
        joinedAt: profile.created_at,
        lastSeenAt: profile.last_seen_at,
        sessions: sessionMap.get(profile.id)?.length ?? 0,
      }));

    const dormantMembers = profiles
      .filter((profile) => !profile.last_seen_at || new Date(profile.last_seen_at).getTime() < since30dMs)
      .sort((a, b) => {
        const aTime = a.last_seen_at ? new Date(a.last_seen_at).getTime() : 0;
        const bTime = b.last_seen_at ? new Date(b.last_seen_at).getTime() : 0;
        return aTime - bTime;
      })
      .slice(0, 5)
      .map((profile) => ({
        id: profile.id,
        name: profile.name ?? 'Unknown',
        joinedAt: profile.created_at,
        lastSeenAt: profile.last_seen_at,
      }));

    return NextResponse.json({
      trackingStartedAt: TRACKING_STARTED_AT,
      signupsToday,
      signups7d,
      signups30d,
      active30d,
      trackedNewUsers: trackedProfiles.length,
      returnedAfterSignup,
      returnRate,
      eligible7d: eligible7dProfiles.length,
      retained7d,
      retention7dRate,
      eligible30d: eligible30dProfiles.length,
      retained30d,
      retention30dRate,
      inactive7d,
      inactive30d,
      newestMembers,
      followUpMembers,
      dormantMembers,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}