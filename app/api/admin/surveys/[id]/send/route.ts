import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { buildSurveyEmailHtml } from '@/lib/emailTemplate';
import { getClubEmailConfig } from '@/lib/clubEmailConfig';
import { requireClubOfficer, corsHeaders } from '@/lib/apiAuth';

export const dynamic = 'force-dynamic';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

function buildSurveySubject(title: string, clubAbbreviation?: string): string {
  const prefix = clubAbbreviation ? `${clubAbbreviation} | ` : '';
  return `${prefix}📋 ${title}`;
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

// ── POST: Send survey email to a club's subscribers ───────────────────────────
// Authorization is club-scoped: the survey is fetched FIRST so the officer check can
// key on the survey's own club_id. A bare valid JWT is not enough (2026-08-14).
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

    // Fetch survey FIRST so authorization can be scoped to its club. Nothing is
    // returned to the caller until the officer check below passes.
    const { data: survey, error: sErr } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single();

    // Officer of THIS survey's club, or the admin password. A valid JWT alone is not
    // authorization — signup is open, so any member (incl. a minor) holds one.
    if (!await requireClubOfficer(request, { password }, survey?.club_id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors });
    }

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
