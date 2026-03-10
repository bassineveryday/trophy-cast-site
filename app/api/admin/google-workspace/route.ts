import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const DEFAULT_CLUB_ID = process.env.NEXT_PUBLIC_DEFAULT_CLUB_ID ?? 'DBM';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = new Uint8Array(Buffer.from(provided));
  const b = new Uint8Array(Buffer.from(expected));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [connectionResult, meetingsResult, minutesFilesResult] = await Promise.allSettled([
      // Google connection status + folder IDs
      supabase
        .from('google_connections')
        .select(
          'id, user_id, club_id, provider, scope, expires_at, updated_at, members_folder_id, tournaments_folder_id, marketing_folder_id, club_documents_folder_id, minutes_folder_id, committees_folder_id'
        )
        .eq('club_id', DEFAULT_CLUB_ID)
        .eq('provider', 'google')
        .limit(1)
        .maybeSingle(),

      // Recent meetings (type = meeting or where event has minutes)
      supabase
        .from('tournament_events')
        .select('event_id, tournament_name, event_date, is_meeting')
        .eq('club_id', DEFAULT_CLUB_ID)
        .eq('is_meeting', true)
        .order('event_date', { ascending: false })
        .limit(10),

      // Minutes exported to Google Drive
      supabase
        .from('minutes_drive_files')
        .select('id, meeting_id, name, web_view_link, created_at')
        .eq('club_id', DEFAULT_CLUB_ID)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    // Parse connection
    const connData =
      connectionResult.status === 'fulfilled' ? connectionResult.value.data : null;

    const connection = connData
      ? {
          connected: true,
          updatedAt: connData.updated_at,
          folders: {
            members: connData.members_folder_id ?? null,
            tournaments: connData.tournaments_folder_id ?? null,
            marketing: connData.marketing_folder_id ?? null,
            clubDocuments: connData.club_documents_folder_id ?? null,
            minutes: connData.minutes_folder_id ?? null,
            committees: connData.committees_folder_id ?? null,
          },
        }
      : { connected: false, updatedAt: null, folders: null };

    const meetings =
      meetingsResult.status === 'fulfilled'
        ? (meetingsResult.value.data ?? [])
        : [];

    const minutesFiles =
      minutesFilesResult.status === 'fulfilled'
        ? (minutesFilesResult.value.data ?? [])
        : [];

    return NextResponse.json({ connection, meetings, minutesFiles });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
