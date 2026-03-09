import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = new Uint8Array(Buffer.from(provided));
  const b = new Uint8Array(Buffer.from(expected));
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

    const { data, error } = await resend.contacts.list({ audienceId: RESEND_AUDIENCE_ID });
    if (error || !data) {
      return NextResponse.json({ count: null }, { status: 200 });
    }

    const count = (data.data ?? []).filter((c) => !c.unsubscribed).length;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: null }, { status: 200 });
  }
}
