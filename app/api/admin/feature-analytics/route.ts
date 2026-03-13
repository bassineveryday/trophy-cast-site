import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const DAY_MS = 24 * 60 * 60 * 1000;
const FEATURE_RANGE_OPTIONS = [7, 14, 30, 90] as const;

type RangeDays = (typeof FEATURE_RANGE_OPTIONS)[number];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type MessageType =
  | 'direct_message'
  | 'pairing_chat'
  | 'tournament_ops'
  | 'tournament_chat'
  | 'club_announcement'
  | 'board_message'
  | 'group_chat';

interface CatchRow {
  user_id: string;
  created_at: string;
  photo_url: string | null;
  species: string | null;
  waterbody_name: string | null;
  location_name: string | null;
}

interface CoachInteractionRow {
  interaction_type: string;
  created_at: string;
  prompt: string | null;
}

interface AiConversationRow {
  created_at: string;
  turn_count: number | null;
}

interface MessageRow {
  message_type: MessageType;
  created_at: string;
  event_id: string | null;
}

interface ConversationRow {
  id: string;
  updated_at: string;
}

interface RegistrationRow {
  event_id: string;
  registered_at: string;
  role: 'boater' | 'co_angler';
  entry_paid: boolean;
}

interface EventRow {
  event_id: string;
  tournament_name: string | null;
  event_date: string;
}

function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function toDateKey(isoString: string): string {
  return new Date(isoString).toISOString().split('T')[0];
}

function toDayStartMs(value: string | Date): number {
  const date = new Date(value);
  date.setUTCHours(0, 0, 0, 0);
  return date.getTime();
}

function getRangeDays(value: unknown): RangeDays {
  const parsed = Number(value);
  return FEATURE_RANGE_OPTIONS.includes(parsed as RangeDays) ? (parsed as RangeDays) : 30;
}

function buildRangeSeries(timestamps: string[], dayCount: RangeDays) {
  const countByDay = new Map<number, number>();
  for (const timestamp of timestamps) {
    const dayStartMs = toDayStartMs(timestamp);
    countByDay.set(dayStartMs, (countByDay.get(dayStartMs) ?? 0) + 1);
  }

  const series: { date: string; count: number }[] = [];
  const todayStartMs = toDayStartMs(new Date());

  if (dayCount <= 30) {
    for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
      const dayStartMs = todayStartMs - offset * DAY_MS;
      series.push({
        date: toDateKey(new Date(dayStartMs).toISOString()),
        count: countByDay.get(dayStartMs) ?? 0,
      });
    }
    return series;
  }

  const bucketSize = 7;
  const bucketCount = Math.ceil(dayCount / bucketSize);
  const firstBucketSize = dayCount - (bucketCount - 1) * bucketSize;
  let cursorStartMs = todayStartMs - (dayCount - 1) * DAY_MS;

  for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex += 1) {
    const currentBucketSize = bucketIndex === 0 ? firstBucketSize : bucketSize;
    let count = 0;

    for (let dayOffset = 0; dayOffset < currentBucketSize; dayOffset += 1) {
      const dayStartMs = cursorStartMs + dayOffset * DAY_MS;
      count += countByDay.get(dayStartMs) ?? 0;
    }

    series.push({
      date: toDateKey(new Date(cursorStartMs).toISOString()),
      count,
    });

    cursorStartMs += currentBucketSize * DAY_MS;
  }

  return series;
}

function categorizeCoachTopic(prompt: string | null): string {
  const lower = (prompt ?? '').toLowerCase();
  if (!lower) return 'General';
  if (/(screen|tab|feature|navigate|where do i|how do i|app|inbox|settings|profile|log catch)/i.test(lower)) return 'App Help';
  if (/(front|weather|wind|pressure|temp|temperature|cloud|moon|spawn|cold|muddy|clear)/i.test(lower)) return 'Conditions';
  if (/(crankbait|jig|spinnerbait|frog|swimbait|dropshot|drop shot|topwater|ned|jerkbait|texas rig|technique)/i.test(lower)) return 'Technique';
  if (/(rod|reel|line|gear|setup|lb test|fluoro|braid|mono|color)/i.test(lower)) return 'Gear';
  if (/(lake|reservoir|point|bank|dock|grass|timber|structure|deep|shallow|location|where should)/i.test(lower)) return 'Location';
  if (/(bass|smallmouth|largemouth|walleye|trout|crappie|catfish|bluegill|species)/i.test(lower)) return 'Species';
  if (/(tournament|practice|pattern|plan|game plan|tomorrow|this weekend|strategy)/i.test(lower)) return 'Strategy';
  return 'General';
}

export async function POST(request: Request) {
  try {
    const { password, rangeDays: requestedRangeDays } = await request.json();
    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const nowMs = Date.now();
    const rangeDays = getRangeDays(requestedRangeDays);
    const sinceRange = new Date(nowMs - rangeDays * DAY_MS).toISOString();
    const todayDate = new Date().toISOString().split('T')[0];

    const [
      catchesResult,
      coachResult,
      aiConversationsResult,
      messagesResult,
      conversationsResult,
      announcementsResult,
      registrations30dResult,
      upcomingEventsResult,
    ] = await Promise.allSettled([
      supabase
        .from('catches')
        .select('user_id, created_at, photo_url, species, waterbody_name, location_name')
        .gte('created_at', sinceRange),
      supabase
        .from('coach_interactions')
        .select('interaction_type, created_at, prompt')
        .gte('created_at', sinceRange),
      supabase
        .from('ai_conversations')
        .select('created_at, turn_count')
        .gte('created_at', sinceRange),
      supabase
        .from('messages')
        .select('message_type, created_at, event_id')
        .gte('created_at', sinceRange)
        .is('deleted_at', null),
      supabase
        .from('conversations')
        .select('id, updated_at')
        .gte('updated_at', sinceRange),
      supabase
        .from('announcements')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', sinceRange),
      supabase
        .from('tournament_registrations')
        .select('event_id, registered_at, role, entry_paid')
        .gte('registered_at', sinceRange)
        .neq('status', 'cancelled'),
      supabase
        .from('tournament_events')
        .select('event_id, tournament_name, event_date')
        .gte('event_date', todayDate)
        .order('event_date', { ascending: true })
        .limit(8),
    ]);

    const catches =
      catchesResult.status === 'fulfilled' && !catchesResult.value.error
        ? ((catchesResult.value.data ?? []) as CatchRow[])
        : [];
    const coachInteractions =
      coachResult.status === 'fulfilled' && !coachResult.value.error
        ? ((coachResult.value.data ?? []) as CoachInteractionRow[])
        : [];
    const aiConversations =
      aiConversationsResult.status === 'fulfilled' && !aiConversationsResult.value.error
        ? ((aiConversationsResult.value.data ?? []) as AiConversationRow[])
        : [];
    const messages =
      messagesResult.status === 'fulfilled' && !messagesResult.value.error
        ? ((messagesResult.value.data ?? []) as MessageRow[])
        : [];
    const conversations =
      conversationsResult.status === 'fulfilled' && !conversationsResult.value.error
        ? ((conversationsResult.value.data ?? []) as ConversationRow[])
        : [];
    const registrations30d =
      registrations30dResult.status === 'fulfilled' && !registrations30dResult.value.error
        ? ((registrations30dResult.value.data ?? []) as RegistrationRow[])
        : [];
    const upcomingEvents =
      upcomingEventsResult.status === 'fulfilled' && !upcomingEventsResult.value.error
        ? ((upcomingEventsResult.value.data ?? []) as EventRow[])
        : [];

    const activeCatchAnglers30d = new Set(catches.map((row) => row.user_id)).size;
    const photoCount30d = catches.filter((row) => Boolean(row.photo_url)).length;
    const speciesCounts = catches.reduce<Record<string, number>>((acc, row) => {
      const species = row.species?.trim();
      if (!species) return acc;
      acc[species] = (acc[species] ?? 0) + 1;
      return acc;
    }, {});
    const lakeCounts = catches.reduce<Record<string, number>>((acc, row) => {
      const lake = row.waterbody_name?.trim() || row.location_name?.trim();
      if (!lake) return acc;
      acc[lake] = (acc[lake] ?? 0) + 1;
      return acc;
    }, {});
    const avgCatchLogsPerDay = catches.length ? Math.round((catches.length / rangeDays) * 10) / 10 : 0;

    const askCoachCount = coachInteractions.filter((row) => row.interaction_type === 'pre_trip').length;
    const catchFeedbackCount = coachInteractions.filter((row) => row.interaction_type === 'post_catch').length;
    const patternRunsCount = coachInteractions.filter((row) => row.interaction_type === 'pattern').length;
    const coachTopicCounts = coachInteractions
      .filter((row) => row.interaction_type === 'pre_trip')
      .reduce<Record<string, number>>((acc, row) => {
        const topic = categorizeCoachTopic(row.prompt);
        acc[topic] = (acc[topic] ?? 0) + 1;
        return acc;
      }, {});
    const avgConversationTurns = aiConversations.length
      ? Math.round(
          aiConversations.reduce((sum, row) => sum + (row.turn_count ?? 0), 0) / aiConversations.length
        )
      : null;

    const breakdown30d = messages.reduce<Record<MessageType, number>>(
      (acc, row) => {
        acc[row.message_type] = (acc[row.message_type] ?? 0) + 1;
        return acc;
      },
      {
        direct_message: 0,
        pairing_chat: 0,
        tournament_ops: 0,
        tournament_chat: 0,
        club_announcement: 0,
        board_message: 0,
        group_chat: 0,
      }
    );
    const avgMessagesPerDay = messages.length ? Math.round((messages.length / rangeDays) * 10) / 10 : 0;

    const tournamentChannelCounts = messages.reduce<
      Record<string, { total: number; ops: number; chat: number }>
    >((acc, row) => {
      if (!row.event_id) return acc;
      if (row.message_type !== 'tournament_ops' && row.message_type !== 'tournament_chat') return acc;
      const current = acc[row.event_id] ?? { total: 0, ops: 0, chat: 0 };
      current.total += 1;
      if (row.message_type === 'tournament_ops') current.ops += 1;
      if (row.message_type === 'tournament_chat') current.chat += 1;
      acc[row.event_id] = current;
      return acc;
    }, {});

    const topTournamentEventIds = Object.entries(tournamentChannelCounts)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5)
      .map(([eventId]) => eventId);

    const tournamentNameMap = new Map<string, { name: string; date: string }>();
    if (topTournamentEventIds.length > 0) {
      const { data, error } = await supabase
        .from('tournament_events')
        .select('event_id, tournament_name, event_date')
        .in('event_id', topTournamentEventIds);
      if (!error) {
        for (const row of (data ?? []) as EventRow[]) {
          tournamentNameMap.set(row.event_id, {
            name: row.tournament_name ?? 'Untitled Event',
            date: row.event_date,
          });
        }
      }
    }

    const upcomingEventIds = upcomingEvents.map((row) => row.event_id);
    let upcomingRegistrations: RegistrationRow[] = [];
    if (upcomingEventIds.length > 0) {
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('event_id, registered_at, role, entry_paid')
        .in('event_id', upcomingEventIds)
        .neq('status', 'cancelled');
      if (!error) {
        upcomingRegistrations = (data ?? []) as RegistrationRow[];
      }
    }

    const upcomingByEvent = new Map<string, { registrations: number; paid: number }>();
    for (const row of upcomingRegistrations) {
      const current = upcomingByEvent.get(row.event_id) ?? { registrations: 0, paid: 0 };
      current.registrations += 1;
      if (row.entry_paid) current.paid += 1;
      upcomingByEvent.set(row.event_id, current);
    }

    return NextResponse.json({
      rangeDays,
      catches: {
        logs: catches.length,
        activeAnglers: activeCatchAnglers30d,
        photoRate: catches.length ? Math.round((photoCount30d / catches.length) * 100) : null,
        avgLogsPerDay: avgCatchLogsPerDay,
        trend: buildRangeSeries(catches.map((row) => row.created_at), rangeDays),
        topSpecies: Object.entries(speciesCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([species, count]) => ({ species, count })),
        topLakes: Object.entries(lakeCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([lake, count]) => ({ lake, count })),
      },
      coach: {
        askCoach: askCoachCount,
        catchFeedback: catchFeedbackCount,
        patternRuns: patternRunsCount,
        voiceConversations: aiConversations.length,
        avgConversationTurns,
        trend: buildRangeSeries(
          coachInteractions
            .filter((row) => row.interaction_type === 'pre_trip')
            .map((row) => row.created_at),
          rangeDays
        ),
        topTopics: Object.entries(coachTopicCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([topic, count]) => ({ topic, count })),
      },
      tournaments: {
        registrations: registrations30d.length,
        paidEntries: registrations30d.filter((row) => row.entry_paid).length,
        boaters: registrations30d.filter((row) => row.role === 'boater').length,
        coAnglers: registrations30d.filter((row) => row.role === 'co_angler').length,
        trend: buildRangeSeries(registrations30d.map((row) => row.registered_at), rangeDays),
        upcomingEvents: upcomingEvents.map((row) => ({
          eventId: row.event_id,
          tournamentName: row.tournament_name ?? 'Untitled Event',
          eventDate: row.event_date,
          registrations: upcomingByEvent.get(row.event_id)?.registrations ?? 0,
          paid: upcomingByEvent.get(row.event_id)?.paid ?? 0,
        })),
        topChannels: topTournamentEventIds.map((eventId) => ({
          eventId,
          tournamentName: tournamentNameMap.get(eventId)?.name ?? 'Untitled Event',
          eventDate: tournamentNameMap.get(eventId)?.date ?? '',
          totalMessages: tournamentChannelCounts[eventId]?.total ?? 0,
          opsMessages: tournamentChannelCounts[eventId]?.ops ?? 0,
          chatMessages: tournamentChannelCounts[eventId]?.chat ?? 0,
        })),
      },
      inbox: {
        messages: messages.length,
        activeThreads: conversations.length,
        announcements:
          announcementsResult.status === 'fulfilled' ? (announcementsResult.value.count ?? 0) : 0,
        avgMessagesPerDay,
        trend: buildRangeSeries(messages.map((row) => row.created_at), rangeDays),
        breakdown: breakdown30d,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}