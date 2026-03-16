import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { weeklyUpdates, type WeeklyUpdate } from '@/lib/weeklyUpdates';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const DEEP_DIVE_OPTIONS = [
  'Dock Talk', 'Voice Catch Logging', 'TC Coach', 'Tournament Dashboard',
  'AOY Standings', 'Trophy Room', 'Member Directory', 'Weather & Conditions',
  'Video Notes', 'Board & Officer Tools',
];

const DEFAULT_REPO_OWNER = 'bassineveryday';
const DEFAULT_REPO_NAME = 'Trophy-Cast-MVP-v2';
const DEFAULT_REPO_BRANCH = 'main';
const MAX_RECENT_COMMITS = 20;
const MAX_SEEN_ITEMS = 24;

interface WeeklyIdeasRequest {
  seenBullets?: string[];
  seenSubjects?: string[];
}

interface GithubCommitResponseItem {
  commit?: {
    message?: string;
  };
}

interface SuggestionPayload {
  bullets?: unknown;
  suggestedSubject?: unknown;
  suggestedDeepDive?: unknown;
  suggestedMeetingFocus?: unknown;
}

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function sanitizeJsonPayload(value: string): string {
  return value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

function buildFallbackSuggestion(today: string): WeeklyUpdate {
  const latest = weeklyUpdates[0];
  return {
    ...latest,
    week: `${today} · Saved ideas`,
    source: 'generated',
    sourceLabel: 'Saved weekly ideas from your recent Trophy Cast notes',
    generatedAt: new Date().toISOString(),
  };
}

async function fetchRecentCommitsFromGithub(): Promise<string[]> {
  const owner = process.env.TROPHY_CAST_GITHUB_OWNER || DEFAULT_REPO_OWNER;
  const repo = process.env.TROPHY_CAST_GITHUB_REPO || DEFAULT_REPO_NAME;
  const branch = process.env.TROPHY_CAST_GITHUB_BRANCH || DEFAULT_REPO_BRANCH;
  const token = process.env.TROPHY_CAST_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const searchParams = new URLSearchParams({
    sha: branch,
    per_page: String(MAX_RECENT_COMMITS),
    since,
  });
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'trophy-cast-site',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?${searchParams.toString()}`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const commits = (await response.json()) as GithubCommitResponseItem[];
    return commits
      .map((item) => item.commit?.message?.split('\n')[0]?.trim() ?? '')
      .filter((message) => Boolean(message) && !/^merge\b/i.test(message));
  } catch {
    return [];
  }
}

function parseSuggestion(rawContent: string, today: string, usedGithub: boolean): WeeklyUpdate {
  const parsed = JSON.parse(sanitizeJsonPayload(rawContent)) as SuggestionPayload;
  const bullets = Array.isArray(parsed.bullets)
    ? parsed.bullets.map((bullet: unknown) => String(bullet).trim()).filter(Boolean).slice(0, 3)
    : [];
  const suggestedDeepDive = typeof parsed.suggestedDeepDive === 'string' && DEEP_DIVE_OPTIONS.includes(parsed.suggestedDeepDive)
    ? parsed.suggestedDeepDive
    : DEEP_DIVE_OPTIONS[0];

  return {
    week: `${today} · Fresh ideas`,
    bullets: bullets.length > 0 ? bullets : buildFallbackSuggestion(today).bullets,
    suggestedSubject: typeof parsed.suggestedSubject === 'string' && parsed.suggestedSubject.trim()
      ? parsed.suggestedSubject.trim()
      : `Trophy Cast Weekly 🎣 — ${today}`,
    suggestedDeepDive,
    suggestedMeetingFocus: typeof parsed.suggestedMeetingFocus === 'string' && parsed.suggestedMeetingFocus.trim()
      ? parsed.suggestedMeetingFocus.trim()
      : '',
    source: 'generated',
    sourceLabel: usedGithub
      ? 'Generated from recent Trophy Cast app work'
      : 'Generated from Trophy Cast feature history',
    generatedAt: new Date().toISOString(),
  };
}

export function GET() {
  return NextResponse.json(weeklyUpdates);
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (!apiKey) {
    return NextResponse.json({
      suggestion: buildFallbackSuggestion(today),
      usedGithub: false,
      commitCount: 0,
    });
  }

  const body = (await request.json().catch(() => ({}))) as WeeklyIdeasRequest;
  const seenBullets = Array.isArray(body.seenBullets)
    ? body.seenBullets.map((bullet) => String(bullet)).slice(0, MAX_SEEN_ITEMS)
    : [];
  const seenSubjects = Array.isArray(body.seenSubjects)
    ? body.seenSubjects.map((subject) => String(subject)).slice(0, MAX_SEEN_ITEMS)
    : [];

  const githubCommits = await fetchRecentCommitsFromGithub();
  const usedGithub = githubCommits.length > 0;
  const alreadyCoveredBullets = dedupeStrings([
    ...weeklyUpdates.slice(0, 4).flatMap((update) => update.bullets),
    ...seenBullets,
  ]);
  const alreadyCoveredSubjects = dedupeStrings([
    ...weeklyUpdates.slice(0, 4).map((update) => update.suggestedSubject),
    ...seenSubjects,
  ]);

  const groundingContext = usedGithub
    ? githubCommits.map((commit, index) => `${index + 1}. ${commit}`).join('\n')
    : weeklyUpdates
      .slice(0, 4)
      .flatMap((update) => update.bullets.map((bullet) => `- ${bullet}`))
      .join('\n');

  const systemPrompt = `You write weekly email ideas for Trophy Cast, a bass fishing club app. Your job is to turn real product work into member-facing marketing bullets that make anglers want to open the app and try features.
Write like a confident marketing assistant, not a developer.
Rules:
- 3 bullets only
- each bullet is one sentence, 14-24 words
- plain text only, no markdown, no quotes, no emojis in bullets
- explain what members can do or why it matters
- do not mention code, branches, refactors, migrations, schemas, hooks, or admin-only implementation details
- across repeated refreshes, vary the angle and avoid repeating excluded bullets or subjects`;

  const userPrompt = `Today is ${today}.

Feature menu:
Dock Talk, Voice Catch Logging, TC Coach, Tournament Dashboard, AOY Standings, Trophy Room, Member Directory, Weather & Conditions, Video Notes, Board & Officer Tools, Broadcast Announcements.

Grounding context:
${groundingContext}

Avoid repeating these bullets:
${alreadyCoveredBullets.map((bullet) => `- ${bullet}`).join('\n')}

Avoid repeating these subject lines:
${alreadyCoveredSubjects.map((subject) => `- ${subject}`).join('\n')}

Pick the strongest 3 member-facing story angles for this week's email. Prioritize features that help members message each other, learn faster, log catches, see tournament info, follow standings, or stay engaged with the club.

Also provide:
- a catchy subject line that includes 🎣
- one deep-dive feature from this list only: ${DEEP_DIVE_OPTIONS.join(', ')}
- one sentence for the Monday meeting focus tied to that deep-dive feature

Respond as JSON only:
{"bullets":["...","...","..."],"suggestedSubject":"...","suggestedDeepDive":"...","suggestedMeetingFocus":"..."}`;

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 1.1,
      max_tokens: 500,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content?.trim() ?? '';
    return NextResponse.json({
      suggestion: parseSuggestion(rawContent, today, usedGithub),
      usedGithub,
      commitCount: githubCommits.length,
    });
  } catch {
    return NextResponse.json({
      suggestion: buildFallbackSuggestion(today),
      usedGithub,
      commitCount: githubCommits.length,
    });
  }
}
