import { NextResponse } from 'next/server';
import { weeklyUpdates } from '@/lib/weeklyUpdates';
import OpenAI from 'openai';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const DEEP_DIVE_OPTIONS = [
  'Dock Talk', 'Voice Catch Logging', 'TC Coach', 'Tournament Dashboard',
  'AOY Standings', 'Trophy Room', 'Member Directory', 'Weather & Conditions',
  'Video Notes', 'Board & Officer Tools',
];

/** Try to grab recent git log from the main app repo for grounding. */
function getRecentCommits(): string {
  const repoPath = process.env.TROPHY_CAST_REPO_PATH || 'C:\\Projects\\Trophy-Cast-MVP-v2-1';
  try {
    const log = execSync(
      'git log --oneline --since="7 days ago" --no-merges',
      { cwd: repoPath, timeout: 5000, encoding: 'utf-8' }
    ).trim();
    return log || '';
  } catch {
    return '';
  }
}

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Fallback: return static data if no key
    return NextResponse.json(weeklyUpdates);
  }

  const recentCommits = getRecentCommits();
  const alreadyCovered = weeklyUpdates
    .slice(0, 3)
    .flatMap((u) => u.bullets)
    .map((b) => `- ${b}`)
    .join('\n');

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const systemPrompt = `You write short, exciting weekly email bullets for Trophy Cast — a bass fishing club app.
Your audience is club members (not developers). Write about FEATURES THEY CAN USE, not code changes.
Tone: friendly, enthusiastic, casual — like a fishing buddy telling you what's new.
Each bullet: 1 sentence, 15-25 words, plain text (no markdown, no emoji, no quotes).
Focus on what the member can DO with the feature.`;

  const userPrompt = `Generate 3 fresh weekly update bullets for Trophy Cast (week of ${today}).

${recentCommits ? `Recent development work (translate into member-friendly language):\n${recentCommits}\n` : ''}
Trophy Cast features: Dock Talk (messaging), Voice Catch Logging, TC Coach (AI fishing coach), Tournament Dashboard, AOY Standings, Trophy Room, Member Directory, Weather & Conditions, Board & Officer Tools, Broadcast Announcements.

ALREADY COVERED (do NOT repeat these):\n${alreadyCovered}

Also suggest:
- A catchy email subject line (include 🎣)
- One Deep Dive feature to highlight (pick from: ${DEEP_DIVE_OPTIONS.join(', ')})
- A one-sentence Monday meeting focus related to that Deep Dive

Respond in EXACTLY this JSON format (no markdown fences):
{"bullets":["bullet 1","bullet 2","bullet 3"],"suggestedSubject":"subject line","suggestedDeepDive":"Feature Name","suggestedMeetingFocus":"one sentence"}`;

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.9,
      max_tokens: 400,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? '';
    const parsed = JSON.parse(raw);

    const aiSuggestion = {
      week: today,
      bullets: Array.isArray(parsed.bullets) ? parsed.bullets.slice(0, 3) : [],
      suggestedSubject: parsed.suggestedSubject || `Trophy Cast Weekly 🎣 — ${today}`,
      suggestedDeepDive: parsed.suggestedDeepDive || DEEP_DIVE_OPTIONS[0],
      suggestedMeetingFocus: parsed.suggestedMeetingFocus || '',
    };

    // Return AI suggestion as the first entry, with static history behind it
    return NextResponse.json([aiSuggestion, ...weeklyUpdates]);
  } catch {
    // On any failure, fall back to static data
    return NextResponse.json(weeklyUpdates);
  }
}
