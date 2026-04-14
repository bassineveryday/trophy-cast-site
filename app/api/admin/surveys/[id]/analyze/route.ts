import { NextResponse } from 'next/server';
import crypto from 'crypto';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
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

// ── POST: Generate AI analysis of survey results ────────────────────────────
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

    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured.' },
        { status: 503 }
      );
    }

    // Fetch survey + questions + responses
    const [surveyRes, questionsRes, responsesRes] = await Promise.all([
      supabase.from('surveys').select('*').eq('id', surveyId).single(),
      supabase.from('survey_questions').select('*').eq('survey_id', surveyId).order('sort_order'),
      supabase.from('survey_responses').select('*').eq('survey_id', surveyId),
    ]);

    if (surveyRes.error || !surveyRes.data) {
      return NextResponse.json({ error: 'Survey not found.' }, { status: 404 });
    }

    const survey = surveyRes.data;
    const questions = questionsRes.data ?? [];
    const responses = responsesRes.data ?? [];
    const uniqueRespondents = new Set(responses.map((r) => r.respondent_id)).size;

    // Build a structured summary for the AI
    let dataSummary = `Survey: "${survey.title}"\n`;
    dataSummary += `Club: ${survey.club_id}\n`;
    dataSummary += `Total respondents: ${uniqueRespondents}\n\n`;

    for (const q of questions) {
      const qResponses = responses.filter((r) => r.question_id === q.id);
      const answers = qResponses.map((r) => r.answer).filter(Boolean);

      dataSummary += `Question ${q.sort_order + 1}: "${q.question_text}" (${q.question_type})\n`;
      dataSummary += `  Responses: ${answers.length}\n`;

      if (q.question_type === 'multiple_choice' || q.question_type === 'yes_no') {
        const counts: Record<string, number> = {};
        for (const a of answers) counts[a] = (counts[a] ?? 0) + 1;
        for (const [opt, count] of Object.entries(counts)) {
          const pct = answers.length ? Math.round((count / answers.length) * 100) : 0;
          dataSummary += `    "${opt}": ${count} (${pct}%)\n`;
        }
      } else if (q.question_type === 'rating') {
        const nums = answers.map(Number).filter((n) => !isNaN(n));
        const avg = nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;
        dataSummary += `    Average: ${Math.round(avg * 10) / 10}\n`;
        const counts: Record<string, number> = {};
        for (const a of answers) counts[a] = (counts[a] ?? 0) + 1;
        for (const [val, count] of Object.entries(counts).sort((a, b) => Number(a[0]) - Number(b[0]))) {
          dataSummary += `    Rating ${val}: ${count}\n`;
        }
      } else {
        // open_text — include all answers
        for (const a of answers) {
          dataSummary += `    - "${a}"\n`;
        }
      }
      dataSummary += '\n';
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `You are the Ask DBM intelligence analyst for the Denver Bassmasters fishing club. You analyze member survey results and produce actionable reports for the club's board of directors.

Your report should include:
1. **Executive Summary** — 2–3 sentence overview of what members said
2. **Strengths** — What the club is doing well (backed by data)
3. **Areas for Improvement** — Where members want changes (backed by data)
4. **Key Themes** — Common threads across open-text responses
5. **AI Recommendations** — Your specific, actionable suggestions for the board based on the data
6. **Notable Quotes** — 2–3 standout member comments (if open-text responses exist)

Rules:
- Ground everything in the actual data — cite percentages and counts
- Write in a direct, practical tone appropriate for a fishing club board meeting
- Be honest about both positives and negatives
- If response rates are low, note that as a caveat
- Make recommendations specific and actionable, not generic
- Use plain language — no corporate jargon`,
        },
        {
          role: 'user',
          content: `Analyze this survey data and generate the full report:\n\n${dataSummary}`,
        },
      ],
    });

    const aiSummary = completion.choices[0]?.message?.content ?? '';

    // Save the AI summary to the survey record
    await supabase
      .from('surveys')
      .update({ ai_summary: aiSummary, updated_at: new Date().toISOString() })
      .eq('id', surveyId);

    return NextResponse.json({ ok: true, aiSummary });
  } catch (error) {
    console.error('[survey-analyze] error:', error);
    return NextResponse.json({ error: 'AI analysis failed. Try again.' }, { status: 500 });
  }
}
