import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { bugReportHtml, bugReportText, BugReportData } from '@/lib/emails/bugReportNotification';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function corsHeaders(origin: string | null): Record<string, string> {
  const isAllowed =
    origin &&
    (origin === 'https://trophycast.app' ||
      origin.endsWith('.vercel.app') ||
      /^http:\/\/localhost:\d+$/.test(origin));

  const allowedOrigin = isAllowed ? origin : 'https://trophycast.app';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Handle CORS preflight
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

// Service-role client — used to INSERT and to bypass RLS for rate-limit check
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const NOTIFY_EMAIL = process.env.SUPPORT_ADMIN_EMAIL ?? 'tai@trophycast.app';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const cors = corsHeaders(origin);

  try {
    // ── 1. Auth — verify JWT from Authorization header ───────────────────────
    const authHeader = request.headers.get('authorization') ?? '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors });
    }

    // ── 2. Parse + validate body ─────────────────────────────────────────────
    const body = await request.json();
    const { description, memberName, memberEmail, buildTime, deviceInfo, pagePath, clubId } = body;

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters.' },
        { status: 400, headers: cors }
      );
    }

    if (!memberEmail || !memberName) {
      return NextResponse.json({ error: 'Missing member info.' }, { status: 400, headers: cors });
    }

    // ── 3. Rate limit — 1 report per user per 60 seconds ────────────────────
    const since = new Date(Date.now() - 60_000).toISOString();
    const { count } = await supabaseAdmin
      .from('bug_reports')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', since);

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        { error: 'Please wait 60 seconds before submitting another report.' },
        { status: 429, headers: cors }
      );
    }

    const effectiveClubId = clubId || 'DBM';

    // ── 4. Insert to Supabase (persist first — if email fails, report is safe) ─
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('bug_reports')
      .insert({
        user_id: user.id,
        club_id: effectiveClubId,
        member_name: memberName,
        member_email: memberEmail,
        description: description.trim(),
        build_time: buildTime ?? null,
        device_info: deviceInfo ?? null,
        page_path: pagePath ?? null,
      })
      .select('id')
      .single();

    if (insertError || !inserted) {
      console.error('[bug-report] Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save report.' }, { status: 500, headers: cors });
    }

    const reportId: string = inserted.id;
    const submittedAt = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/New_York',
    });

    // ── 5. Send email via Resend (non-blocking on failure) ───────────────────
    if (resend) {
      const emailData: BugReportData = {
        memberName,
        memberEmail,
        description: description.trim(),
        buildTime,
        deviceInfo,
        pagePath,
        submittedAt,
        clubId: effectiveClubId,
        reportId,
      };

      try {
        await resend.emails.send({
          from: 'Trophy Cast <cast@trophycast.app>',
          to: NOTIFY_EMAIL,
          replyTo: memberEmail,
          subject: `🐛 Bug Report from ${memberName}`,
          html: bugReportHtml(emailData),
          text: bugReportText(emailData),
        });
      } catch (emailErr) {
        // Report is already saved — email failure is non-fatal
        console.warn('[bug-report] Resend failed (report still saved):', emailErr);
      }
    } else {
      console.warn('[bug-report] RESEND_API_KEY not set — email skipped. Report ID:', reportId);
    }

    return NextResponse.json({ success: true, reportId }, { headers: cors });
  } catch (err) {
    console.error('[bug-report] Unexpected error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500, headers: cors });
  }
}
