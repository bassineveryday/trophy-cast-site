import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

// ── GET: Fetch a survey with its questions (public — for filling out) ───────
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [surveyRes, questionsRes] = await Promise.all([
    supabase.from('surveys').select('*').eq('id', id).single(),
    supabase.from('survey_questions').select('*').eq('survey_id', id).order('sort_order'),
  ]);

  if (surveyRes.error || !surveyRes.data) {
    return NextResponse.json({ error: 'Survey not found.' }, { status: 404 });
  }

  return NextResponse.json({
    survey: surveyRes.data,
    questions: questionsRes.data ?? [],
  });
}

// ── POST: Submit responses for a survey ─────────────────────────────────────
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: surveyId } = await params;
    const body = await request.json();
    const { respondentId, answers } = body;

    if (!respondentId?.trim()) {
      return NextResponse.json({ error: 'respondentId is required.' }, { status: 400 });
    }
    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'answers array is required.' }, { status: 400 });
    }

    // Check survey is active
    const { data: survey } = await supabase
      .from('surveys')
      .select('status, closes_at')
      .eq('id', surveyId)
      .single();

    if (!survey || survey.status !== 'active') {
      return NextResponse.json({ error: 'This survey is not currently accepting responses.' }, { status: 400 });
    }

    if (survey.closes_at && new Date(survey.closes_at) < new Date()) {
      return NextResponse.json({ error: 'This survey has closed.' }, { status: 400 });
    }

    // Upsert responses (one per question per respondent)
    const rows = answers.map((a: { questionId: string; answer: string }) => ({
      survey_id: surveyId,
      question_id: a.questionId,
      respondent_id: respondentId.trim(),
      answer: a.answer,
    }));

    const { error } = await supabase
      .from('survey_responses')
      .upsert(rows, { onConflict: 'question_id,respondent_id' });

    if (error) {
      console.error('[survey-submit] error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[survey-submit] error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
