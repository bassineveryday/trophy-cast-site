export interface BugReportData {
  memberName: string;
  memberEmail: string;
  description: string;
  buildTime?: string;
  deviceInfo?: string;
  pagePath?: string;
  submittedAt: string;
  clubId: string;
  reportId: string;
}

export function bugReportHtml(data: BugReportData): string {
  const {
    memberName,
    memberEmail,
    description,
    buildTime,
    deviceInfo,
    pagePath,
    submittedAt,
    clubId,
    reportId,
  } = data;

  const buildDisplay = buildTime && buildTime !== 'dev'
    ? new Date(buildTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    : buildTime ?? 'unknown';

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 12px 6px 0;font-size:13px;color:#94a3b8;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:13px;color:#e2e8f0;">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Bug Report — Trophy Cast</title>
</head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0e1a;padding:32px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:0 0 24px 0;">
              <div style="font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">🐛 Bug Report</div>
              <div style="font-size:12px;color:#f5c842;letter-spacing:2px;text-transform:uppercase;margin-top:6px;">Trophy Cast</div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#111827;border-radius:16px;padding:32px;border:1px solid #1e2d40;">

              <!-- Description -->
              <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;color:#f5c842;text-transform:uppercase;letter-spacing:1px;">Description</p>
              <div style="background:#0a0e1a;border-radius:10px;padding:16px;border:1px solid #1e2d40;margin:0 0 24px 0;">
                <p style="margin:0;font-size:15px;color:#e2e8f0;line-height:1.6;white-space:pre-wrap;">${description.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
              </div>

              <!-- Meta -->
              <p style="margin:0 0 10px 0;font-size:11px;font-weight:700;color:#f5c842;text-transform:uppercase;letter-spacing:1px;">Details</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                ${row('Member', `${memberName} &lt;${memberEmail}&gt;`)}
                ${row('Club', clubId)}
                ${row('Submitted', submittedAt)}
                ${row('Build', buildDisplay)}
                ${deviceInfo ? row('Device', deviceInfo) : ''}
                ${pagePath ? row('Page', pagePath) : ''}
                ${row('Report ID', `<span style="font-family:monospace;font-size:11px;">${reportId}</span>`)}
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 0 0 0;">
              <p style="margin:0;font-size:12px;color:#4b5563;">
                Sent from Trophy Cast in-app bug reporting · <a href="https://trophycast.app" style="color:#f5c842;text-decoration:none;">trophycast.app</a>
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

export function bugReportText(data: BugReportData): string {
  const buildDisplay = data.buildTime && data.buildTime !== 'dev'
    ? new Date(data.buildTime).toLocaleString()
    : data.buildTime ?? 'unknown';

  return [
    '🐛 Bug Report — Trophy Cast',
    '',
    `Member: ${data.memberName} <${data.memberEmail}>`,
    `Club: ${data.clubId}`,
    `Submitted: ${data.submittedAt}`,
    `Build: ${buildDisplay}`,
    data.deviceInfo ? `Device: ${data.deviceInfo}` : '',
    data.pagePath ? `Page: ${data.pagePath}` : '',
    `Report ID: ${data.reportId}`,
    '',
    '--- Description ---',
    data.description,
  ].filter(Boolean).join('\n');
}
