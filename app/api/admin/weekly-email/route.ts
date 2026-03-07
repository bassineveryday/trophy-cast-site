import { NextResponse } from 'next/server';
import crypto from 'crypto';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_SERVER = MAILCHIMP_API_KEY?.split('-')[1]; // e.g. "us18"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

const MEET_LINK = 'https://meet.google.com/kys-cuub-idb';
const MEET_DIAL = '+1 423-657-0191 · PIN: 272 760 211#';
const MEET_SCHEDULE = 'Every Monday · 7:00–8:00 PM Mountain Time';

const DEEP_DIVE_DESCRIPTIONS: Record<string, string> = {
  'Dock Talk': "Team chat built for bass clubs — channels for tournaments, announcements, and your crew. Know what's happening at the lake before you get there.",
  'Voice Catch Logging': 'Log your catches hands-free with your voice. Describe the fish, it gets logged automatically. No more typing with wet hands.',
  'AI Coaching': 'Get smart feedback on your catches and fishing patterns. Your personal AI coach learns your tendencies and helps you find more fish.',
  'Tournament Dashboard': 'Everything a tournament director needs — draw pairings, track weights, calculate payouts, and post results in real time.',
  'AOY Standings': 'Live Angler of the Year standings that update automatically after every tournament. No manual spreadsheets needed.',
  'Trophy Room': 'Your personal fishing trophy case — best fish, season highlights, and stats that tell the story of your season.',
  'Member Directory': 'Find your fellow club members, see their profiles, and connect. The full club roster in your pocket.',
  'Weather & Conditions': 'Integrated weather and lake conditions at the tournament location so you can plan your day before the co-angler draw.',
  'Video Notes': 'Record short video notes about techniques, spots, or catches right within the app. Your personal fishing journal, upgraded.',
  'Board & Officer Tools': 'Agenda builder, meeting notes, treasurer tools, and member management — everything the board needs to run the club smoothly.',
};

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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function buildEmailHtml(opts: {
  subject: string;
  bullets: string[];
  deepDive: string;
  deepDiveNote?: string;
  meetingFocus?: string;
}): string {
  const { subject, bullets, deepDive, deepDiveNote, meetingFocus } = opts;
  const desc =
    deepDiveNote?.trim() ||
    DEEP_DIVE_DESCRIPTIONS[deepDive] ||
    `This week we're spotlighting ${deepDive}.`;

  const bulletHtml = bullets
    .map((b) => `<li style="margin-bottom:8px;color:#F5F1E6;">${escapeHtml(b)}</li>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#0C1A23;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">

    <!-- Header -->
    <div style="text-align:center;padding:32px 0 24px;">
      <p style="font-size:36px;margin:0;">🏆</p>
      <h1 style="color:#D4AF37;font-size:26px;font-weight:700;margin:8px 0 4px;font-family:Georgia,serif;">Trophy Cast</h1>
      <p style="color:#C9D3DA;font-size:14px;margin:0;">Weekly Community Update</p>
    </div>

    <!-- What's New -->
    <div style="background:#162D3D;border-radius:12px;padding:24px;margin-bottom:20px;">
      <h2 style="color:#4FC3F7;font-size:18px;font-weight:700;margin:0 0 16px;font-family:Georgia,serif;">🎣 What&apos;s New</h2>
      <ul style="margin:0;padding:0 0 0 20px;">
        ${bulletHtml}
      </ul>
    </div>

    <!-- Deep Dive -->
    <div style="background:#132532;border-radius:12px;padding:24px;margin-bottom:20px;">
      <h2 style="color:#D4AF37;font-size:18px;font-weight:700;margin:0 0 12px;font-family:Georgia,serif;">🔍 Deep Dive: ${escapeHtml(deepDive)}</h2>
      <p style="color:#C9D3DA;font-size:15px;line-height:1.6;margin:0;">${escapeHtml(desc)}</p>
    </div>

    <!-- Monday Meeting -->
    <div style="background:#2E6E3D;border-radius:12px;padding:28px;text-align:center;margin-bottom:20px;">
      <h2 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 8px;font-family:Georgia,serif;">📅 Monday Night Community Call</h2>
      <p style="color:rgba(255,255,255,0.9);font-size:15px;margin:0 0 12px;">${MEET_SCHEDULE}</p>
      ${meetingFocus ? `<p style="color:#ffffff;font-size:16px;font-weight:600;margin:0 0 20px;background:rgba(0,0,0,0.2);border-radius:8px;padding:10px 16px;">This week: ${escapeHtml(meetingFocus)}</p>` : ''}
      <a href="${MEET_LINK}"
         style="display:inline-block;background:#ffffff;color:#2E6E3D;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;">
        Join on Google Meet
      </a>
      <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:16px 0 0;">Dial-in: ${escapeHtml(MEET_DIAL)}</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0 8px;">
      <p style="color:#546674;font-size:13px;margin:0;">© 2026 Trophy Cast &middot; trophycast.app</p>
      <p style="color:#546674;font-size:12px;margin:8px 0 0;">*|UNSUB|*</p>
    </div>

  </div>
</body>
</html>`;
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
