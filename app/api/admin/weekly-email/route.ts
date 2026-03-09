import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { buildEmailHtml } from '@/lib/emailTemplate';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID!;
const resend = new Resend(process.env.RESEND_API_KEY!);

// Timing-safe password comparison using Node.js crypto
function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = new Uint8Array(Buffer.from(provided));
  const b = new Uint8Array(Buffer.from(expected));
  // must be same byte length for timingSafeEqual; early exit is acceptable here
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Fetch all subscribed emails from Resend Audience
async function fetchSubscriberEmails(): Promise<string[]> {
  const { data, error } = await resend.contacts.list({ audienceId: RESEND_AUDIENCE_ID });
  if (error || !data) throw new Error('Failed to fetch subscribers from Resend');
  return (data.data ?? [])
    .filter((c) => !c.unsubscribed)
    .map((c) => c.email)
    .filter(Boolean) as string[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, subject, bullets, deepDive, deepDiveNote, meetingFocus, scheduleTime } = body;

    // ── 1. Auth ───────────────────────────────────────────────────────────────
    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── 2. Validate inputs ────────────────────────────────────────────────────
    if (!subject?.trim()) {
      return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
    }
    if (!Array.isArray(bullets) || bullets.filter((b: string) => b?.trim()).length === 0) {
      return NextResponse.json(
        { error: 'At least one bullet point is required.' },
        { status: 400 }
      );
    }
    if (!deepDive) {
      return NextResponse.json({ error: 'Deep dive topic is required.' }, { status: 400 });
    }

    // ── 3. Fetch subscriber list from Mailchimp ───────────────────────────────
    let emails: string[];
    try {
      emails = await fetchSubscriberEmails();
    } catch (err) {
      console.error('[weekly-email] Failed to fetch subscribers:', err);
      return NextResponse.json({ error: 'Could not fetch subscriber list.' }, { status: 500 });
    }
    if (emails.length === 0) {
      return NextResponse.json({ error: 'No subscribers found.' }, { status: 400 });
    }

    // ── 4. Build email HTML ───────────────────────────────────────────────────
    const htmlBody = buildEmailHtml({
      subject: subject.trim(),
      bullets: (bullets as string[]).filter((b: string) => b?.trim()),
      deepDive,
      deepDiveNote,
      meetingFocus,
    });

    // ── 5. Send via Resend batch (max 100 per call) ───────────────────────────
    const baseEmail = {
      from: 'Tai — Trophy Cast <cast@trophycast.app>',
      subject: subject.trim(),
      html: htmlBody,
      ...(scheduleTime ? { scheduledAt: scheduleTime as string } : {}),
    };

    const ids: string[] = [];
    for (let i = 0; i < emails.length; i += 100) {
      const chunk = emails.slice(i, i + 100).map((to) => ({ ...baseEmail, to }));
      const { data, error } = await resend.batch.send(chunk);
      if (error) {
        console.error('[weekly-email] Resend batch error:', error);
        return NextResponse.json(
          { error: 'Failed to send email.', detail: error.message },
          { status: 500 }
        );
      }
      const sent = (data as { data?: { id: string }[] } | null)?.data ?? [];
      ids.push(...sent.map((d) => d.id));
    }

    return NextResponse.json({
      ok: true,
      action: scheduleTime ? 'scheduled' : 'sent',
      recipientCount: emails.length,
      scheduleTime: scheduleTime ?? null,
      ids,
    });
  } catch (error) {
    console.error('[weekly-email] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
