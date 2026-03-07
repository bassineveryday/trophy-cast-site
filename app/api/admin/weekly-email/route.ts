import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { buildEmailHtml } from '@/lib/emailTemplate';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_SERVER = MAILCHIMP_API_KEY?.split('-')[1]; // e.g. "us18"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

// Timing-safe password comparison using Node.js crypto
function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // must be same byte length for timingSafeEqual; early exit is acceptable here
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Look up the numeric segment ID for the 'app-user' static segment (tag)
async function getAppUserSegmentId(listId: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${listId}/segments?type=static&count=100`,
      { headers: { Authorization: `apikey ${MAILCHIMP_API_KEY}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const seg = (data.segments ?? []).find(
      (s: { name: string }) => s.name === 'app-user'
    );
    return seg?.id ?? null;
  } catch {
    return null;
  }
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

    // ── 3. Look up app-user segment ID ───────────────────────────────────────
    const segmentId = await getAppUserSegmentId(MAILCHIMP_AUDIENCE_ID);

    const recipients: Record<string, unknown> = { list_id: MAILCHIMP_AUDIENCE_ID };
    if (segmentId) {
      recipients.segment_opts = { saved_segment_id: segmentId };
    }

    // ── 4. Create campaign ───────────────────────────────────────────────────
    const createRes = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/campaigns`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'regular',
          recipients,
          settings: {
            subject_line: subject.trim(),
            preview_text: 'Trophy Cast community update — join us Monday at 7PM MT 🎣',
            from_name: 'Tai — Trophy Cast',
            reply_to: 'cast@trophycast.app',
          },
        }),
      }
    );

    if (!createRes.ok) {
      const err = await createRes.json();
      console.error('[weekly-email] Mailchimp campaign create error:', err);
      return NextResponse.json(
        { error: 'Failed to create campaign.', detail: err.detail },
        { status: 500 }
      );
    }

    const campaign = await createRes.json();
    const campaignId: string = campaign.id;

    // ── 5. Set campaign content ──────────────────────────────────────────────
    const htmlBody = buildEmailHtml({
      subject: subject.trim(),
      bullets: (bullets as string[]).filter((b: string) => b?.trim()),
      deepDive,
      deepDiveNote,
      meetingFocus,
    });

    const contentRes = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
      {
        method: 'PUT',
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: htmlBody }),
      }
    );

    if (!contentRes.ok) {
      const err = await contentRes.json();
      console.error('[weekly-email] Mailchimp content error:', err);
      return NextResponse.json(
        { error: 'Failed to set campaign content.', detail: err.detail },
        { status: 500 }
      );
    }

    // ── 6. Schedule or send immediately ──────────────────────────────────────
    if (scheduleTime) {
      const schedRes = await fetch(
        `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/schedule`,
        {
          method: 'POST',
          headers: {
            Authorization: `apikey ${MAILCHIMP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ schedule_time: scheduleTime }),
        }
      );

      if (!schedRes.ok) {
        const err = await schedRes.json();
        console.error('[weekly-email] Mailchimp schedule error:', err);
        return NextResponse.json(
          {
            error: 'Campaign created but scheduling failed. Check Mailchimp dashboard.',
            detail: err.detail,
            campaignId,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ ok: true, action: 'scheduled', campaignId, scheduleTime });
    }

    // Send now
    const sendRes = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`,
      {
        method: 'POST',
        headers: { Authorization: `apikey ${MAILCHIMP_API_KEY}` },
      }
    );

    if (!sendRes.ok) {
      const err = await sendRes.json();
      console.error('[weekly-email] Mailchimp send error:', err);
      return NextResponse.json(
        {
          error: 'Campaign created but send failed. Check Mailchimp dashboard.',
          detail: err.detail,
          campaignId,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, action: 'sent', campaignId });
  } catch (error) {
    console.error('[weekly-email] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
