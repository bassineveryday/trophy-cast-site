import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { getClubEmailConfig } from '@/lib/clubEmailConfig';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = new Uint8Array(Buffer.from(provided));
  const b = new Uint8Array(Buffer.from(expected));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, clubId, audience: rawAudience } = body;
    const validAudiences = ['club', 'all', 'app_users_club', 'app_users_all', 'combined_club', 'combined_all'] as const;
    type AudienceSource = typeof validAudiences[number];
    const audience: AudienceSource = validAudiences.includes(rawAudience as AudienceSource)
      ? (rawAudience as AudienceSource)
      : 'club';

    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD ?? '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clubConfig = getClubEmailConfig(clubId);

    // App-user-only audiences: count from profiles table
    if (audience === 'app_users_club' || audience === 'app_users_all') {
      let q = supabase.from('profiles').select('id', { count: 'exact', head: true });
      if (audience === 'app_users_club' && clubId) q = q.eq('club_id', clubId);
      const { count, error } = await q;
      if (error) return NextResponse.json({ count: null }, { status: 200 });
      return NextResponse.json({ count });
    }

    // Combined audiences: waitlist + profiles (approximate; may overlap at edges)
    if (audience === 'combined_club' || audience === 'combined_all') {
      const isClub = audience === 'combined_club';
      let wQuery = supabase.from('waitlist_subscribers').select('id', { count: 'exact', head: true });
      if (isClub && clubConfig?.clubName) wQuery = wQuery.eq('club_name', clubConfig.clubName);
      let pQuery = supabase.from('profiles').select('id', { count: 'exact', head: true });
      if (isClub && clubId) pQuery = pQuery.eq('club_id', clubId);
      const [wRes, pRes] = await Promise.all([wQuery, pQuery]);
      return NextResponse.json({ count: (wRes.count ?? 0) + (pRes.count ?? 0) });
    }

    // Legacy waitlist-only audiences
    let query = supabase.from('waitlist_subscribers').select('id', { count: 'exact', head: true });
    if (audience === 'club' && clubConfig?.clubName) {
      query = query.eq('club_name', clubConfig.clubName);
    }
    const { count, error } = await query;

    if (error) return NextResponse.json({ count: null }, { status: 200 });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: null }, { status: 200 });
  }
}
