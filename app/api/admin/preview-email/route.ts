import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { buildEmailHtml } from '@/lib/emailTemplate';

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
    const { password, subject, bullets, deepDive, deepDiveNote, meetingFocus } = body;

    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bulletList: string[] = Array.isArray(bullets)
      ? bullets.filter((b: string) => b?.trim())
      : [];

    const html = buildEmailHtml({
      subject: subject?.trim() || '(No subject)',
      bullets: bulletList.length ? bulletList : ['(No bullets yet)'],
      deepDive: deepDive || 'Dock Talk',
      deepDiveNote,
      meetingFocus,
    });

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
