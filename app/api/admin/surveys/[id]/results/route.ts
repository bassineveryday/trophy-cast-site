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

// ── GET: Fetch results for a survey (admin only, password in header) ────────
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: surveyId } = await params;
  const pw = request.headers.get('x-admin-password') ?? '';

  if (!checkPassword(pw, ADMIN_PASSWORD)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch survey, questions, and all responses
  const [surveyRes, questionsRes, responsesRes] = await Promise.all([
    supabase.from('surveys').select('*').eq('id', surveyId).single(),
    supabase.from('survey_questions').select('*').eq('survey_id', surveyId).order('sort_order'),
    supabase.from('survey_responses').select('*').eq('survey_id', surveyId),
  ]);

  if (surveyRes.error || !surveyRes.data) {
    return NextResponse.json({ error: 'Survey not found.' }, { status: 404 });
  }

  const questions = questionsRes.data ?? [];
  const responses = responsesRes.data ?? [];

  // Compile stats per question
  const uniqueRespondents = new Set(responses.map((r) => r.respondent_id));

  const questionStats = questions.map((q) => {
    const qResponses = responses.filter((r) => r.question_id === q.id);
    const answers = qResponses.map((r) => r.answer).filter(Boolean);

    if (q.question_type === 'multiple_choice' || q.question_type === 'yes_no') {
      const counts: Record<string, number> = {};
      for (const a of answers) {
        counts[a] = (counts[a] ?? 0) + 1;
      }
      return {
        questionId: q.id,
        questionText: q.question_text,
        questionType: q.question_type,
        totalResponses: answers.length,
        breakdown: counts,
      };
    }

    if (q.question_type === 'rating') {
      const nums = answers.map(Number).filter((n) => !isNaN(n));
      const avg = nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;
      const counts: Record<string, number> = {};
      for (const a of answers) {
        counts[a] = (counts[a] ?? 0) + 1;
      }
      return {
        questionId: q.id,
        questionText: q.question_text,
        questionType: q.question_type,
        totalResponses: answers.length,
        average: Math.round(avg * 10) / 10,
        breakdown: counts,
      };
    }

    // open_text
    return {
      questionId: q.id,
      questionText: q.question_text,
      questionType: q.question_type,
      totalResponses: answers.length,
      answers,
    };
  });

  return NextResponse.json({
    survey: surveyRes.data,
    totalRespondents: uniqueRespondents.size,
    questionStats,
  });
}
