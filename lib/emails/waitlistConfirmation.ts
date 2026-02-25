export function waitlistConfirmationHtml(firstName: string): string {
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
              <img src="https://trophycast.app/trophy-cast-logo-256.png" alt="Trophy Cast" width="100" height="100" style="display:block;margin:0 auto 16px auto;border-radius:16px;" />
              <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Trophy Cast</div>
              <div style="font-size:12px;color:#f5c842;letter-spacing:2px;text-transform:uppercase;margin-top:6px;">Where Every Cast Counts.</div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#111827;border-radius:16px;padding:40px 40px;border:1px solid #1e2d40;">
              <p style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:#ffffff;">
                Hey ${firstName} 👋
              </p>
              <p style="margin:0 0 24px 0;font-size:16px;color:#94a3b8;line-height:1.6;">
                You're officially on the <strong style="color:#f5c842;">Trophy Cast waitlist</strong>. We'll reach out as soon as we're ready for you.
              </p>

              <div style="background:#0a0e1a;border-radius:12px;padding:24px;border:1px solid #1e2d40;margin:0 0 28px 0;">
                <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:#f5c842;text-transform:uppercase;letter-spacing:1px;">What to expect</p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#cbd5e1;">📸 &nbsp; Voice-first catch logging with AI</td>
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

              <div style="border-top:1px solid #1e2d40;padding-top:24px;">
                <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
                  Questions? Reply to this email — it goes straight to me.<br/>
                  <span style="color:#94a3b8;font-weight:600;">Tai Hunt</span><br/>
                  <span style="color:#64748b;">Founder, Trophy Cast</span>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 0 0 0;">
              <p style="margin:0;font-size:12px;color:#334155;">
                You're receiving this because you joined the Trophy Cast waitlist at
                <a href="https://trophycast.app" style="color:#f5c842;text-decoration:none;">trophycast.app</a>
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
  return `Hey ${firstName},

You're on the Trophy Cast waitlist! We'll reach out as soon as we're ready for you.

What to expect:
- Voice-first catch logging with AI
- Live tournament management & AOY leaderboards
- The more you fish, the better it knows your patterns
- Catch maps, weather intel & season stats

Honestly — thank you. It means the world that you took the time to check out Trophy Cast and sign up. You'll be one of the first people notified when we open to the public.

We're launching with our first club in March 2026. You're already ahead of the line.

Questions? Reply to this email — it goes straight to me.

Tai Hunt
Founder, Trophy Cast
trophycast.app
`;
}
