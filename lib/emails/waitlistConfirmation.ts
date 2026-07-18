import { TC_EMAIL_LOGOS } from '../brandAssets';

export interface WaitlistConfirmationOpts {
  /** Absolute URL for the club's logo — shown above the TC logo when set */
  clubLogoUrl?: string | null;
  /** Club display name, e.g. "Denver BassMasters" */
  clubDisplayName?: string;
  /** Short club name used in body copy, e.g. "Denver BassMasters" */
  clubName?: string;
  /** "from" display name override for subject line context */
  fromName?: string;
}

export function waitlistConfirmationHtml(
  firstName: string,
  opts: WaitlistConfirmationOpts = {}
): string {
  const APP_URL = 'https://trophy-cast-mvp-v2.vercel.app';
  const WEBSITE_URL = 'https://trophycast.app';
  const emailLogoUrl = TC_EMAIL_LOGOS.emailHeader;
  const { clubLogoUrl, clubDisplayName, clubName } = opts;

  const headerHtml = clubLogoUrl
    ? `<img src="${clubLogoUrl}" alt="${clubDisplayName ?? 'Club'}" width="88" height="88" style="display:block;margin:0 auto 10px auto;" />
              <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">${clubDisplayName ?? ''}</div>
              <div style="font-size:11px;color:#546674;letter-spacing:2px;text-transform:uppercase;margin:4px 0 12px;">presented by</div>
              <img src="${emailLogoUrl}" alt="Trophy Cast" width="48" height="48" style="display:block;margin:0 auto 8px auto;" />
              <div style="font-size:16px;font-weight:700;color:#C9A646;">Trophy Cast</div>
              <div style="font-size:11px;color:#C9A646;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Where Every Cast Counts.</div>`
    : `<img src="${emailLogoUrl}" alt="Trophy Cast" width="80" height="80" style="display:block;margin:0 auto 16px auto;" />
              <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Trophy Cast</div>
              <div style="font-size:12px;color:#C9A646;letter-spacing:2px;text-transform:uppercase;margin-top:6px;">Where Every Cast Counts.</div>`;

  const clubLine = clubName
    ? `You're officially signed up with <strong style="color:#C9A646;">${clubName}</strong> on Trophy Cast.`
    : `You're officially on the <strong style="color:#C9A646;">Trophy Cast waitlist</strong>.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the Trophy Cast waitlist!</title>
</head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0e1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:0 0 32px 0;">
              ${headerHtml}
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#111827;border-radius:16px;padding:40px 40px;border:1px solid #1e2d40;">
              <p style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:#ffffff;">
                Hey ${firstName} 👋
              </p>
              <p style="margin:0 0 24px 0;font-size:16px;color:#94a3b8;line-height:1.6;">
                ${clubLine} We'll reach out as soon as we're ready for you.
              </p>

              <div style="background:#0a0e1a;border-radius:12px;padding:24px;border:1px solid #1e2d40;margin:0 0 28px 0;">
                <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:#C9A646;text-transform:uppercase;letter-spacing:1px;">What to expect</p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#cbd5e1;">📸 &nbsp; Voice-first catch logging with TC Coach</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#cbd5e1;">🏆 &nbsp; Live tournament management &amp; AOY leaderboards</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#cbd5e1;">🎣 &nbsp; The more you fish, the better it knows your patterns</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#cbd5e1;">🗺️ &nbsp; Catch maps, weather intel &amp; season stats</td>
                  </tr>
                </table>
              </div>

              <p style="margin:0 0 16px 0;font-size:14px;color:#94a3b8;line-height:1.6;">
                Honestly — thank you. It means the world that you took the time to check out Trophy Cast and sign up. You'll be one of the first people notified when we open to the public, and I don't take that trust lightly.
              </p>
              <p style="margin:0 0 28px 0;font-size:14px;color:#94a3b8;line-height:1.6;">
                We're launching with our first club in March 2026. You're already ahead of the line.
              </p>

              <div style="background:#0a0e1a;border-radius:12px;padding:16px;border:1px solid #1e2d40;margin:0 0 20px 0;">
                <p style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:#C9A646;text-transform:uppercase;letter-spacing:1px;">App vs Website</p>
                <p style="margin:0 0 6px 0;font-size:13px;color:#cbd5e1;line-height:1.5;">
                  Use the app on phone or computer:
                  <a href="${APP_URL}" style="color:#C9A646;text-decoration:none;"> ${APP_URL}</a>
                </p>
                <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.5;">
                  Trophy Cast website:
                  <a href="${WEBSITE_URL}" style="color:#C9A646;text-decoration:none;"> ${WEBSITE_URL}</a>
                </p>
              </div>

              <div style="border-top:1px solid #1e2d40;padding-top:24px;">
                <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
                  Questions? Reply to this email — it goes straight to me.<br/>
                  <span style="color:#94a3b8;font-weight:600;">Tai Hunt</span><br/>
                  <span style="color:#64748b;">Founder, Trophy Cast, Inc.</span>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 0 0 0;">
              <p style="margin:0 0 8px 0;font-size:12px;color:#334155;">
                You're receiving this because you joined the Trophy Cast waitlist at
                <a href="https://trophycast.app" style="color:#C9A646;text-decoration:none;">trophycast.app</a>
              </p>
              <p style="margin:0;font-size:11px;color:#1e2d40;">
                &copy; 2026 Trophy Cast, Inc. &middot;
                <a href="mailto:cast@trophycast.app?subject=Unsubscribe" style="color:#334155;text-decoration:underline;">Unsubscribe from future emails</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function waitlistConfirmationText(firstName: string): string {
  const APP_URL = 'https://trophy-cast-mvp-v2.vercel.app';
  const WEBSITE_URL = 'https://trophycast.app';
  return `Hey ${firstName},

You're on the Trophy Cast waitlist! We'll reach out as soon as we're ready for you.

What to expect:
- Voice-first catch logging with TC Coach
- Live tournament management & AOY leaderboards
- The more you fish, the better it knows your patterns
- Catch maps, weather intel & season stats

Honestly — thank you. It means the world that you took the time to check out Trophy Cast and sign up. You'll be one of the first people notified when we open to the public.

We're launching with our first club in March 2026. You're already ahead of the line.

App vs website:
- Use the app on phone or computer: ${APP_URL}
- Trophy Cast website: ${WEBSITE_URL}

Questions? Reply to this email — it goes straight to me.

Tai Hunt
Founder, Trophy Cast, Inc.
${WEBSITE_URL}

© 2026 Trophy Cast, Inc.
To unsubscribe from future emails, reply with "Unsubscribe" in the subject line.
`;
}
