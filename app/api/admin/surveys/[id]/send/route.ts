import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { buildSurveyEmailHtml } from '@/lib/emailTemplate';
import { getClubEmailConfig } from '@/lib/clubEmailConfig';

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

function buildSurveySubject(title: string, clubAbbreviation?: string): string {
  const prefix = clubAbbreviation ? `${clubAbbreviation} | ` : '';
  return `${prefix}📋 ${title}`;
}

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

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

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


// ── POST: Send survey emailil to all subscribers ──────────────────────────────
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin');
  const cors = corsHeaders(origin);

  try {
    const { id: surveyId } = await params;
    const body = await request.json();
    const { password } = body;

    if (!await verifyAuth(request, { password })) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors });
    }

    // Fetch survey
    const { data: survey, error: sErr } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single();

    if (sErr || !survey) {
      return NextResponse.json({ error: 'Survey not found.' }, { status: 404, headers: cors });
    }

    // Activate survey if still draft
    if (survey.status === 'draft') {
      await supabase
        .from('surveys')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', surveyId);
    }

    // Resolve club branding from the survey's club_id
    const clubConfig = getClubEmailConfig(survey.club_id);

    // Fail closed: never broadcast to all subscribers when club is unknown.
    // A missing or unrecognised club_id means the survey can't be safely scoped.
    if (!clubConfig) {
      return NextResponse.json(
        { error: `Unknown club_id '${survey.club_id ?? '(none)'}'. Add it to CLUB_EMAIL_CONFIGS before sending.` },
        { status: 400, headers: cors }
      );
    }

    // Fetch subscriber emails filtered to the survey's club
    const { data: subs, error: subErr } = await supabase
      .from('waitlist_subscribers')
      .select('email')
      .eq('club_name', clubConfig.clubName);

    if (subErr) {
      return NextResponse.json({ error: `Failed to fetch subscribers: ${subErr.message}` }, { status: 500, headers: cors });
    }

    const emails = (subs ?? []).map((r) => r.email).filter(Boolean) as string[];
    if (emails.length === 0) {
      return NextResponse.json({ error: 'No subscribers found.' }, { status: 400, headers: cors });
    }

    const surveyUrl = `https://trophycast.app/survey/${surveyId}`;
    const html = buildSurveyEmailHtml({
      title: survey.title,
      description: survey.description || `We want to hear from you! Your feedback helps make ${clubConfig.displayName} better.`,
      surveyUrl,
      clubName: clubConfig.displayName,
      clubLogoUrl: clubConfig.logoAbsoluteUrl,
      clubDisplayName: clubConfig.displayName,
    });

    const baseEmail = {
      from: `${clubConfig.fromName} <cast@trophycast.app>`,
      subject: buildSurveySubject(survey.title, clubConfig.abbreviation),
      html,
    };

    const ids: string[] = [];
    for (let i = 0; i < emails.length; i += 100) {
      const chunk = emails.slice(i, i + 100).map((to) => ({ ...baseEmail, to }));
      const { data, error } = await getResend().batch.send(chunk);
      if (error) {
        console.error('[survey-send] Resend batch error:', error);
        return NextResponse.json({ error: 'Failed to send emails.', detail: error.message }, { status: 500, headers: cors });
      }
      const sent = (data as { data?: { id: string }[] } | null)?.data ?? [];
      ids.push(...sent.map((d) => d.id));
    }

    return NextResponse.json({
      ok: true,
      recipientCount: emails.length,
      surveyUrl,
      ids,
    }, { headers: cors });
  } catch (error) {
    console.error('[survey-send] error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500, headers: cors });
  }
}
