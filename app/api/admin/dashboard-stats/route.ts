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

    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch everything in parallel
    const [listResult, segResult, bugResult] = await Promise.allSettled([
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
    ]);

    const listData = listResult.status === 'fulfilled' ? listResult.value : null;
    const segData = segResult.status === 'fulfilled' ? segResult.value : null;
    const segs: { name: string; member_count: number }[] = segData?.segments ?? [];

    return NextResponse.json({
      mailchimp: {
        totalMembers: listData?.stats?.member_count ?? null,
        appUserCount: segs.find((s) => s.name === 'app-user')?.member_count ?? null,
        waitlistCount: segs.find((s) => s.name === 'waitlist')?.member_count ?? null,
      },
      bugs: {
        last30Days:
          bugResult.status === 'fulfilled' ? (bugResult.value.count ?? null) : null,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
