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
  const a = new Uint8Array(Buffer.from(provided));
  const b = new Uint8Array(Buffer.from(expected));
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
      contactsResult,
      bugCountResult,
      recentBugsResult,
      totalProfilesResult,
      newSignupsWeekResult,
      newSignupsMonthResult,
    ] = await Promise.allSettled([
      supabase.from('waitlist_subscribers').select('id', { count: 'exact', head: true }),
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

    const contactsData = contactsResult.status === 'fulfilled' ? contactsResult.value : null;
    const totalSubscribers = (contactsData as { count?: number | null } | null)?.count ?? null;

    return NextResponse.json({
      subscribers: {
        total: totalSubscribers,
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
