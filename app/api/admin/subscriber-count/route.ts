import { NextResponse } from 'next/server';
import crypto from 'crypto';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_SERVER = MAILCHIMP_API_KEY?.split('-')[1];
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the 'app-user' static segment and return its member_count
    const res = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/segments?type=static&count=100`,
      { headers: { Authorization: `apikey ${MAILCHIMP_API_KEY}` } }
    );

    if (!res.ok) {
      return NextResponse.json({ count: null }, { status: 200 });
    }

    const data = await res.json();
    const seg = (data.segments ?? []).find(
      (s: { name: string }) => s.name === 'app-user'
    );

    return NextResponse.json({ count: seg?.member_count ?? null });
  } catch {
    return NextResponse.json({ count: null }, { status: 200 });
  }
}
