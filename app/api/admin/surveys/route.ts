import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

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

// ── GET: List all surveys for a club ────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clubId = searchParams.get('club_id') ?? 'DBM';

  const { data, error } = await supabase
    .from('surveys')
    .select('*')
    .eq('club_id', clubId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ surveys: data });
}

// ── POST: Create a new survey with questions ────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, title, description, questions, closesAt, createdBy, clubId } = body;

    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD ?? '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Survey title is required.' }, { status: 400 });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'At least one question is required.' }, { status: 400 });
    }

    // Insert survey
    const { data: survey, error: surveyErr } = await supabase
      .from('surveys')
      .insert({
        club_id: clubId ?? 'DBM',
        title: title.trim(),
        description: description?.trim() || null,
        status: 'draft',
        created_by: createdBy ?? null,
        closes_at: closesAt ?? null,
      })
      .select()
      .single();

    if (surveyErr || !survey) {
      console.error('[surveys] insert error:', surveyErr);
      return NextResponse.json({ error: surveyErr?.message ?? 'Failed to create survey.' }, { status: 500 });
    }

    // Insert questions
    const questionRows = questions.map((q: {
      questionText: string;
      questionType: string;
      options?: string[];
      required?: boolean;
    }, i: number) => ({
      survey_id: survey.id,
      sort_order: i,
      question_text: q.questionText,
      question_type: q.questionType ?? 'multiple_choice',
      options: q.options ? JSON.stringify(q.options) : null,
      required: q.required !== false,
    }));

    const { error: qErr } = await supabase
      .from('survey_questions')
      .insert(questionRows);

    if (qErr) {
      console.error('[surveys] questions insert error:', qErr);
      return NextResponse.json({ error: qErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, survey });
  } catch (error) {
    console.error('[surveys] error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// ── PATCH: Update survey status (activate, close) ───────────────────────────
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { password, surveyId, status: newStatus, aiSummary } = body;

    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD ?? '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!surveyId) {
      return NextResponse.json({ error: 'surveyId is required.' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (newStatus) updates.status = newStatus;
    if (aiSummary !== undefined) updates.ai_summary = aiSummary;

    const { data, error } = await supabase
      .from('surveys')
      .update(updates)
      .eq('id', surveyId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, survey: data });
  } catch (error) {
    console.error('[surveys] patch error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
