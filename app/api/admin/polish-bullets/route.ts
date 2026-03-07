import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(request: Request) {
  try {
    const { password, roughNotes } = await request.json();

    // Auth
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!roughNotes?.trim()) {
      return NextResponse.json({ error: 'No notes provided.' }, { status: 400 });
    }

    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Add OPENAI_API_KEY to Vercel env vars.' },
        { status: 503 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: `You are a copywriter for Trophy Cast, a fishing club app.
Your job is to turn rough notes from the founder (Tai) into 2–3 polished email bullet points.

Rules:
- Write like a casual but enthusiastic fishing club member talking to other anglers
- Keep each bullet under 15 words — punchy and clear
- Use plain English. No jargon, no technical terms
- Do NOT use the term "AI Coach" — use "TC" instead  
- Do NOT use markdown (no bold, no asterisks)
- Output ONLY the bullet points, one per line, no numbers, no dashes, no extra text
- Each bullet should start with the feature name or action (e.g. "TC now...", "Dock Talk...", "Tournament results...")`,
        },
        {
          role: 'user',
          content: `Here are my rough notes. Turn them into 2–3 clean bullet points for this week's email:\n\n${roughNotes.trim()}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    // Split into individual bullets, strip any leading punctuation/dashes
    const bullets = raw
      .split('\n')
      .map((l) => l.replace(/^[-•*\d.)\s]+/, '').trim())
      .filter(Boolean);

    return NextResponse.json({ bullets });
  } catch (error) {
    console.error('[polish-bullets] error:', error);
    return NextResponse.json({ error: 'AI polish failed. Try again.' }, { status: 500 });
  }
}
