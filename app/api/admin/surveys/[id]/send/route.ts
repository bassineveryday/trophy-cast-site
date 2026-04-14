import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { escapeHtml } from '@/lib/emailTemplate';
import { TC_EMAIL_LOGOS } from '@/lib/brandAssets';

export const dynamic = 'force-dynamic';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = new Uint8Array(Buffer.from(provided));
  const b = new Uint8Array(Buffer.from(expected));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Verify either admin password or a valid Supabase JWT (used by the mobile app)
async function verifyAuth(request: Request, body: { password?: string }): Promise<boolean> {
  if (body.password && checkPassword(String(body.password), ADMIN_PASSWORD)) return true;
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data.user) return true;
  }
  return false;
}

function buildSurveyEmailHtml(opts: {
  title: string;
  description: string;
  surveyUrl: string;
}): string {
  const { title, description, surveyUrl } = opts;
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
      <img src="${TC_EMAIL_LOGOS.emailHeader}" alt="TC" width="80" height="80" style="display:block;margin:0 auto 8px;border:0;outline:none;text-decoration:none;font-size:0;line-height:0;">
      <h1 style="color:#D4AF37;font-size:26px;font-weight:700;margin:8px 0 4px;font-family:Georgia,serif;">Trophy Cast</h1>
      <p style="color:#C9D3DA;font-size:14px;margin:0;">Denver Bassmasters Survey</p>
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
      <p style="color:#C9D3DA;font-size:14px;line-height:1.6;margin:0;">Your feedback directly shapes how Denver Bassmasters runs. The board reviews every response — and Trophy Cast&apos;s AI compiles everything into an actionable report so nothing gets missed.</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0 0;">
      <p style="color:#546674;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} Trophy Cast &middot; <a href="https://trophycast.app" style="color:#546674;">trophycast.app</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ── POST: Send survey email to all subscribers ──────────────────────────────
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: surveyId } = await params;
    const body = await request.json();
    const { password } = body;

    if (!await verifyAuth(request, { password })) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch survey
    const { data: survey, error: sErr } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single();

    if (sErr || !survey) {
      return NextResponse.json({ error: 'Survey not found.' }, { status: 404 });
    }

    // Activate survey if still draft
    if (survey.status === 'draft') {
      await supabase
        .from('surveys')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', surveyId);
    }

    // Fetch subscriber emails
    const { data: subs, error: subErr } = await supabase
      .from('waitlist_subscribers')
      .select('email');

    if (subErr) {
      return NextResponse.json({ error: `Failed to fetch subscribers: ${subErr.message}` }, { status: 500 });
    }

    const emails = (subs ?? []).map((r) => r.email).filter(Boolean) as string[];
    if (emails.length === 0) {
      return NextResponse.json({ error: 'No subscribers found.' }, { status: 400 });
    }

    const surveyUrl = `https://trophycast.app/survey/${surveyId}`;
    const html = buildSurveyEmailHtml({
      title: survey.title,
      description: survey.description || 'We want to hear from you! Your feedback helps make Denver Bassmasters better.',
      surveyUrl,
    });

    const baseEmail = {
      from: 'Tai — Trophy Cast <cast@trophycast.app>',
      subject: `📋 ${survey.title} — Denver Bassmasters`,
      html,
    };

    const ids: string[] = [];
    for (let i = 0; i < emails.length; i += 100) {
      const chunk = emails.slice(i, i + 100).map((to) => ({ ...baseEmail, to }));
      const { data, error } = await getResend().batch.send(chunk);
      if (error) {
        console.error('[survey-send] Resend batch error:', error);
        return NextResponse.json({ error: 'Failed to send emails.', detail: error.message }, { status: 500 });
      }
      const sent = (data as { data?: { id: string }[] } | null)?.data ?? [];
      ids.push(...sent.map((d) => d.id));
    }

    return NextResponse.json({
      ok: true,
      recipientCount: emails.length,
      surveyUrl,
      ids,
    });
  } catch (error) {
    console.error('[survey-send] error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
