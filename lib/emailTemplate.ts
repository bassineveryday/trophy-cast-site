// Shared email template logic — used by both the send and preview API routes.

const MEET_LINK = 'https://meet.google.com/kys-cuub-idb';
const MEET_DIAL = '+1 423-657-0191 · PIN: 272 760 211#';
const MEET_SCHEDULE = 'Every Monday · 7:00–8:00 PM Mountain Time';

export const DEEP_DIVE_DESCRIPTIONS: Record<string, string> = {
  'Dock Talk': "Team chat built for bass clubs — channels for tournaments, announcements, and your crew. Know what's happening at the lake before you get there.",
  'Voice Catch Logging': 'Log your catches hands-free with your voice. Describe the fish, it gets logged automatically. No more typing with wet hands.',
  'TC Coach': 'Get smart feedback on your catches and fishing patterns. Your personal TC Coach learns your tendencies and helps you find more fish.',
  'Tournament Dashboard': 'Everything a tournament director needs — draw pairings, track weights, calculate payouts, and post results in real time.',
  'AOY Standings': 'Live Angler of the Year standings that update automatically after every tournament. No manual spreadsheets needed.',
  'Trophy Room': 'Your personal fishing trophy case — best fish, season highlights, and stats that tell the story of your season.',
  'Member Directory': 'Find your fellow club members, see their profiles, and connect. The full club roster in your pocket.',
  'Weather & Conditions': 'Integrated weather and lake conditions at the tournament location so you can plan your day before the co-angler draw.',
  'Video Notes': 'Record short video notes about techniques, spots, or catches right within the app. Your personal fishing journal, upgraded.',
  'Board & Officer Tools': 'Agenda builder, meeting notes, treasurer tools, and member management — everything the board needs to run the club smoothly.',
};

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function buildEmailHtml(opts: {
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
      <img src="https://trophycast.app/trophy-cast-logo-256.png" alt="Trophy Cast" width="80" height="80" style="display:block;margin:0 auto 8px;">
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
      <p style="color:#546674;font-size:13px;margin:0;">© 2026 Trophy Cast, Inc. &middot; <a href="https://trophycast.app" style="color:#546674;text-decoration:none;">trophycast.app</a></p>
      <p style="color:#546674;font-size:12px;margin:8px 0 0;">
        <a href="mailto:cast@trophycast.app?subject=Unsubscribe" style="color:#546674;text-decoration:underline;">Unsubscribe from these emails</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}
