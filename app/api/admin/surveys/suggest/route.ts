import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { requireAnyOfficer, corsHeaders, rateLimit, clientKey } from '@/lib/apiAuth';

export const dynamic = 'force-dynamic';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export type SuggestedQuestion = {
  text: string;
  type: 'multiple_choice' | 'rating' | 'open_text' | 'yes_no';
  options?: string[];
  ratingMax?: 5 | 10;
};

// ── POST: Suggest survey questions for a given topic ────────────────────────
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const cors = corsHeaders(origin);

  try {
    const body = await request.json();
    const { password, topic, clubName, count = 8 } = body as {
      password?: string;
      topic: string;
      clubName?: string;
      count?: number;
    };

    // No club scope on this action, so: admin password, or an officer of ANY club.
    // A bare valid JWT used to pass here and bought anyone an OpenAI proxy (2026-08-14).
    if (!await requireAnyOfficer(request, { password })) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors });
    }

    // `topic` is free-form text that reaches the model — cap the spend per caller.
    if (!rateLimit(clientKey(request, 'survey-suggest'), 10, 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Try again shortly.' }, { status: 429, headers: cors });
    }

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400, headers: cors });
    }

    if (!openai) {
      return NextResponse.json({ error: 'OpenAI API key not configured.' }, { status: 503, headers: cors });
    }

    const clampedCount = Math.min(Math.max(Number(count) || 8, 3), 15);
    const club = clubName?.trim() || 'Denver Bassmasters fishing club';

    const systemPrompt = `You are Ask DBM, an AI intelligence analyst for the ${club}. 
Your job is to generate practical, clear survey questions for club officers.
Return ONLY a JSON array of question objects. No markdown, no explanation.
Each object must have exactly these fields:
- "text": string — the question text
- "type": one of "multiple_choice" | "rating" | "open_text" | "yes_no"
- "options": array of strings (ONLY for multiple_choice, omit for all other types)
- "ratingMax": 5 or 10 (ONLY for rating, omit for all other types)

Rules:
- Mix question types naturally — don't make them all the same type
- For yes_no: use for simple binary questions
- For rating: use for satisfaction, likelihood, or importance questions. Use ratingMax 5 for simple satisfaction, 10 for nuanced scales
- For multiple_choice: provide 3–5 distinct, non-overlapping options
- For open_text: use for opinions, suggestions, or free-form feedback
- Keep questions concise and relevant to the survey topic`;

    const userPrompt = `Generate exactly ${clampedCount} survey questions about: "${topic.trim()}"
These will be sent to members of ${club}.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt + '\n\nRespond with: { "questions": [ ...array of question objects... ] }' },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    let questions: SuggestedQuestion[] = [];

    try {
      const parsed = JSON.parse(raw);
      questions = Array.isArray(parsed.questions) ? parsed.questions : [];
      // Sanitize: ensure required fields, strip unknown types
      questions = questions
        .filter((q) => q.text && ['multiple_choice', 'rating', 'open_text', 'yes_no'].includes(q.type))
        .map((q) => {
          const clean: SuggestedQuestion = { text: String(q.text).trim(), type: q.type };
          if (q.type === 'multiple_choice' && Array.isArray(q.options) && q.options.length >= 2) {
            clean.options = q.options.map(String);
          }
          if (q.type === 'rating') {
            clean.ratingMax = q.ratingMax === 10 ? 10 : 5;
          }
          return clean;
        })
        .slice(0, clampedCount);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response.' }, { status: 500, headers: cors });
    }

    return NextResponse.json({ questions }, { headers: cors });
  } catch (error: any) {
    console.error('[survey/suggest] Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500, headers: cors });
  }
}
