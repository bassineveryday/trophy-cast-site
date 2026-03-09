import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_SERVER = MAILCHIMP_API_KEY?.split('-')[1];
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

    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch everything in parallel
    const [
      listResult,
      segResult,
      bugCountResult,
      recentBugsResult,
      totalProfilesResult,
      newSignupsWeekResult,
      newSignupsMonthResult,
    ] = await Promise.allSettled([
      fetch(
        `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}`,
        { headers: { Authorization: `apikey ${MAILCHIMP_API_KEY}` } }
      ).then((r) => r.json()),
      fetch(
        `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/segments?type=static&count=100`,
        { headers: { Authorization: `apikey ${MAILCHIMP_API_KEY}` } }
      ).then((r) => r.json()),
      supabase
        .from('bug_reports')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', since30d),
      supabase
        .from('bug_reports')
        .select('id, created_at, description, member_name, page_path, device_info')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', since7d),
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', since30d),
    ]);

    const listData = listResult.status === 'fulfilled' ? listResult.value : null;
    const segData = segResult.status === 'fulfilled' ? segResult.value : null;
    const segs: { name: string; member_count: number }[] = segData?.segments ?? [];

    // Case-insensitive segment matching — handles "app-user", "App Users", "app_user", etc.
    const appUserSeg = segs.find((s) =>
      ['app-user', 'app users', 'app_user', 'appuser'].includes(s.name.toLowerCase())
    );
    const waitlistSeg = segs.find((s) =>
      ['waitlist', 'wait list', 'wait-list'].includes(s.name.toLowerCase())
    );

    return NextResponse.json({
      mailchimp: {
        totalMembers: listData?.stats?.member_count ?? null,
        appUserCount: appUserSeg?.member_count ?? null,
        waitlistCount: waitlistSeg?.member_count ?? null,
        allSegments: segs.map((s) => ({ name: s.name, count: s.member_count })),
      },
      bugs: {
        last30Days:
          bugCountResult.status === 'fulfilled' ? (bugCountResult.value.count ?? null) : null,
        recent:
          recentBugsResult.status === 'fulfilled' ? (recentBugsResult.value.data ?? []) : [],
      },
      supabase: {
        totalProfiles:
          totalProfilesResult.status === 'fulfilled'
            ? (totalProfilesResult.value.count ?? null)
            : null,
        newSignupsThisWeek:
          newSignupsWeekResult.status === 'fulfilled'
            ? (newSignupsWeekResult.value.count ?? null)
            : null,
        newSignupsThisMonth:
          newSignupsMonthResult.status === 'fulfilled'
            ? (newSignupsMonthResult.value.count ?? null)
            : null,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
