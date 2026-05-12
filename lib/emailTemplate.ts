// Shared email template logic — used by both the send and preview API routes.
import { TC_EMAIL_LOGOS } from './brandAssets';

const MEET_LINK = 'https://meet.google.com/kys-cuub-idb';
const MEET_DIAL = '+1 423-657-0191 · PIN: 272 760 211#';
const MEET_SCHEDULE = 'Every Monday · 7:00–8:00 PM Mountain Time';
const EMAIL_LOGO_URL = TC_EMAIL_LOGOS.emailHeader;

/**
 * Renders the club + TC co-branded header block.
 * When clubLogoUrl is provided the club logo appears first (larger),
 * followed by a subtle divider, then the TC logo and "Trophy Cast" wordmark.
 * When clubLogoUrl is null/undefined only the TC header is rendered.
 */
function buildEmailHeader(opts: {
  clubLogoUrl?: string | null;
  clubDisplayName?: string;
}): string {
  const { clubLogoUrl, clubDisplayName } = opts;

  if (!clubLogoUrl) {
    return `
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 8px;">
        <tr>
          <td bgcolor="#0C1A23" style="background-color:#0C1A23;text-align:center;padding:0;line-height:0;">
            <img src="${EMAIL_LOGO_URL}" alt="TC" width="80" height="80" style="display:block;border:0;outline:none;text-decoration:none;font-size:0;line-height:0;">
          </td>
        </tr>
      </table>
      <h1 style="color:#D4AF37;font-size:26px;font-weight:700;margin:8px 0 4px;font-family:Georgia,serif;">Trophy Cast</h1>
      <p style="color:#C9D3DA;font-size:14px;margin:0;">Weekly Community Update</p>`;
  }

  const clubAlt = clubDisplayName ? escapeHtml(clubDisplayName) : 'Club';
  return `
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 6px;">
        <tr>
          <td bgcolor="#0C1A23" style="background-color:#0C1A23;text-align:center;padding:0;line-height:0;">
            <img src="${clubLogoUrl}" alt="${clubAlt}" width="96" height="96" style="display:block;border:0;outline:none;text-decoration:none;font-size:0;line-height:0;">
          </td>
        </tr>
      </table>
      <p style="color:#C9D3DA;font-size:15px;font-weight:700;margin:0 0 12px;font-family:Georgia,serif;">${escapeHtml(clubDisplayName ?? '')}</p>
      <p style="color:#546674;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 10px;">presented by</p>
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 6px;">
        <tr>
          <td bgcolor="#0C1A23" style="background-color:#0C1A23;text-align:center;padding:0;line-height:0;">
            <img src="${EMAIL_LOGO_URL}" alt="Trophy Cast" width="72" height="72" style="display:block;border:0;outline:none;text-decoration:none;font-size:0;line-height:0;">
          </td>
        </tr>
      </table>
      <p style="color:#D4AF37;font-size:13px;font-weight:700;margin:0 0 4px;font-family:Georgia,serif;">Trophy Cast</p>
      <p style="color:#C9D3DA;font-size:13px;margin:0;">Weekly Community Update</p>`;
}

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
  /** Absolute URL for the sending club's logo — shown above the TC logo */
  clubLogoUrl?: string | null;
  /** Display name for the sending club, e.g. "Denver BassMasters" */
  clubDisplayName?: string;
}): string {
  const { subject, bullets, deepDive, deepDiveNote, meetingFocus, clubLogoUrl, clubDisplayName } = opts;
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
      ${buildEmailHeader({ clubLogoUrl, clubDisplayName })}
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

/**
 * Builds the HTML body for a survey invitation email.
 * Shared by the survey send API route — extracted here so survey emails
 * get the same club-branding treatment as weekly campaign emails.
 */
export function buildSurveyEmailHtml(opts: {
  title: string;
  description: string;
  surveyUrl: string;
  clubName?: string;
  /** Absolute URL for the sending club's logo */
  clubLogoUrl?: string | null;
  /** Display name for the sending club */
  clubDisplayName?: string;
}): string {
  const { title, description, surveyUrl, clubName, clubLogoUrl, clubDisplayName } = opts;
  const headerSubtitle = clubName ? escapeHtml(clubName) + ' Survey' : 'Denver Bassmasters Survey';
  const feedbackLine = clubName
    ? `Your feedback directly shapes how ${escapeHtml(clubName)} runs. The board reviews every response — and Trophy Cast&apos;s AI compiles everything into an actionable report so nothing gets missed.`
    : `Your feedback directly shapes how Denver Bassmasters runs. The board reviews every response — and Trophy Cast&apos;s AI compiles everything into an actionable report so nothing gets missed.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#0C1A23;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">

    <!-- Header -->
    <div style="text-align:center;padding:32px 0 24px;">
      ${buildEmailHeader({ clubLogoUrl, clubDisplayName })}
      ${!clubLogoUrl ? `<p style="color:#C9D3DA;font-size:14px;margin:4px 0 0;">${headerSubtitle}</p>` : `<p style="color:#C9D3DA;font-size:13px;margin:6px 0 0;">${headerSubtitle}</p>`}
    </div>

    <!-- Survey Invite -->
    <div style="background:#162D3D;border-radius:12px;padding:28px;margin-bottom:20px;">
      <h2 style="color:#4FC3F7;font-size:20px;font-weight:700;margin:0 0 12px;font-family:Georgia,serif;">📋 ${escapeHtml(title)}</h2>
      <p style="color:#C9D3DA;font-size:15px;line-height:1.6;margin:0 0 20px;">${escapeHtml(description)}</p>
      <div style="text-align:center;">
        <a href="${escapeHtml(surveyUrl)}" style="display:inline-block;background:#D4AF37;color:#0C1A23;font-size:16px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">Take the Survey</a>
      </div>
    </div>

    <!-- Why it matters -->
    <div style="background:#132532;border-radius:12px;padding:24px;margin-bottom:20px;">
      <p style="color:#C9D3DA;font-size:14px;line-height:1.6;margin:0;">${feedbackLine}</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0 0;">
      <p style="color:#546674;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} Trophy Cast &middot; <a href="https://trophycast.app" style="color:#546674;">trophycast.app</a></p>
    </div>
  </div>
</body>
</html>`;
}
