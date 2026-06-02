import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { buildEmailHtml, buildPromoEmailHtml } from '@/lib/emailTemplate';
import { getClubEmailConfig } from '@/lib/clubEmailConfig';

export const dynamic = 'force-dynamic';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

// Timing-safe password comparison using Node.js crypto
function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = new Uint8Array(Buffer.from(provided));
  const b = new Uint8Array(Buffer.from(expected));
  // must be same byte length for timingSafeEqual; early exit is acceptable here
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Fetch emails from waitlist_subscribers, optionally filtered by club name.
async function fetchSubscriberEmails(clubName?: string | null): Promise<string[]> {
  let query = supabase.from('waitlist_subscribers').select('email');
  if (clubName) {
    query = query.eq('club_name', clubName);
  }
  const { data, error } = await query;
  if (error) throw new Error(`Supabase error: ${error.message} (code: ${error.code})`);
  if (!data) throw new Error('Supabase returned no data');
  return data.map((r) => r.email).filter(Boolean) as string[];
}

// Fetch emails for real app users (profiles → auth.users), optionally filtered by club.
// Uses service role to access auth.admin.listUsers().
// TODO: when profiles.email_opt_out is added, filter it here for consent compliance.
async function fetchAppUserEmails(clubId?: string | null): Promise<string[]> {
  // 1. Collect profile IDs for the target club (or all clubs)
  let profileQuery = supabase.from('profiles').select('id');
  if (clubId) profileQuery = profileQuery.eq('club_id', clubId);
  const { data: profiles, error: profileError } = await profileQuery;
  if (profileError) throw new Error(`Profile lookup failed: ${profileError.message}`);
  if (!profiles?.length) return [];

  const profileIdSet = new Set((profiles as { id: string }[]).map((p) => p.id));

  // 2. Page through auth users; collect emails for matched profiles
  const emails: string[] = [];
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`Auth user lookup failed: ${error.message}`);
    for (const user of data.users ?? []) {
      if (user.email && profileIdSet.has(user.id)) {
        emails.push(user.email.toLowerCase());
      }
    }
    if ((data.users?.length ?? 0) < perPage) break;
    page++;
  }
  return emails;
}

// Supported audience sources:
//   'club'           — waitlist subscribers for the selected club (legacy default)
//   'all'            — all waitlist subscribers (legacy)
//   'app_users_club' — app users (profiles → auth.users) for the selected club
//   'app_users_all'  — all app users regardless of club
//   'combined_club'  — waitlist + app users for club, deduped by email
//   'combined_all'   — all waitlist + all app users, deduped by email
type AudienceSource = 'club' | 'all' | 'app_users_club' | 'app_users_all' | 'combined_club' | 'combined_all';

function normalizeAudience(raw: unknown): AudienceSource {
  const valid: AudienceSource[] = ['club', 'all', 'app_users_club', 'app_users_all', 'combined_club', 'combined_all'];
  if (valid.includes(raw as AudienceSource)) return raw as AudienceSource;
  return 'club';
}

async function resolveAudienceEmails(
  source: AudienceSource,
  clubId?: string | null,
  clubName?: string | null,
): Promise<string[]> {
  switch (source) {
    case 'all':
      return fetchSubscriberEmails(null);
    case 'app_users_club':
      return fetchAppUserEmails(clubId);
    case 'app_users_all':
      return fetchAppUserEmails(null);
    case 'combined_club': {
      const [waitlist, appUsers] = await Promise.all([
        fetchSubscriberEmails(clubName),
        fetchAppUserEmails(clubId),
      ]);
      return Array.from(new Set([...waitlist.map((e) => e.toLowerCase()), ...appUsers]));
    }
    case 'combined_all': {
      const [waitlist, appUsers] = await Promise.all([
        fetchSubscriberEmails(null),
        fetchAppUserEmails(null),
      ]);
      return Array.from(new Set([...waitlist.map((e) => e.toLowerCase()), ...appUsers]));
    }
    case 'club':
    default:
      return fetchSubscriberEmails(clubName);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      password,
      subject,
      bullets,
      deepDive,
      deepDiveNote,
      meetingFocus,
      scheduleTime,
      clubId,
      campaignType: rawCampaignType,
      audience: rawAudience,
      promo,
    } = body;
    const campaignType = rawCampaignType === 'promo' ? 'promo' : 'weekly';
    const audience = normalizeAudience(rawAudience);
    const clubConfig = getClubEmailConfig(clubId);

    // ── 1. Auth ───────────────────────────────────────────────────────────────
    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD ?? '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── 2. Validate inputs ────────────────────────────────────────────────────
    if (!subject?.trim()) {
      return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
    }
    // Club-scoped sends require a configured club
    const isClubScoped = (['club', 'app_users_club', 'combined_club'] as AudienceSource[]).includes(audience);
    if (isClubScoped && !clubId) {
      return NextResponse.json({ error: 'A valid club is required for club-scoped sends.' }, { status: 400 });
    }
    // Waitlist-based club sends additionally need a matching club name in waitlist_subscribers
    if ((audience === 'club' || audience === 'combined_club') && !clubConfig?.clubName) {
      return NextResponse.json({ error: 'Selected club is not configured for email sends.' }, { status: 400 });
    }

    const promoPayload = (promo ?? {}) as {
      eyebrow?: string;
      title?: string;
      intro?: string;
      steps?: Array<{ title?: string; body?: string }>;
      primaryCtaLabel?: string;
      primaryCtaUrl?: string;
      secondaryCtaLabel?: string;
      secondaryCtaUrl?: string;
      footerNote?: string;
    };
    const promoSteps = Array.isArray(promoPayload.steps)
      ? promoPayload.steps
          .map((step) => ({
            title: String(step?.title ?? '').trim(),
            body: String(step?.body ?? '').trim(),
          }))
          .filter((step) => step.title && step.body)
      : [];

    if (campaignType === 'weekly') {
      if (!Array.isArray(bullets) || bullets.filter((b: string) => b?.trim()).length === 0) {
        return NextResponse.json(
          { error: 'At least one bullet point is required.' },
          { status: 400 }
        );
      }
      if (!deepDive) {
        return NextResponse.json({ error: 'Deep dive topic is required.' }, { status: 400 });
      }
    } else if (
      !promoPayload.eyebrow?.trim() ||
      !promoPayload.title?.trim() ||
      !promoPayload.intro?.trim() ||
      !promoPayload.primaryCtaLabel?.trim() ||
      !promoPayload.primaryCtaUrl?.trim() ||
      promoSteps.length === 0
    ) {
      return NextResponse.json(
        { error: 'Promo emails require intro copy, at least one step, and a primary CTA.' },
        { status: 400 }
      );
    }

    // ── 3. Resolve recipient list by audience source ──────────────────────────
    let emails: string[];
    try {
      emails = await resolveAudienceEmails(audience, clubId, clubConfig?.clubName ?? null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[weekly-email] Failed to fetch subscribers:', msg);
      return NextResponse.json({ error: `Could not fetch subscriber list: ${msg}` }, { status: 500 });
    }
    if (emails.length === 0) {
      return NextResponse.json({ error: 'No subscribers found.' }, { status: 400 });
    }

    // ── 4. Build email HTML ───────────────────────────────────────────────────
    const htmlBody = campaignType === 'weekly'
      ? buildEmailHtml({
          subject: subject.trim(),
          bullets: (bullets as string[]).filter((b: string) => b?.trim()),
          deepDive,
          deepDiveNote,
          meetingFocus,
          clubLogoUrl: clubConfig?.logoAbsoluteUrl ?? null,
          clubDisplayName: clubConfig?.displayName,
        })
      : buildPromoEmailHtml({
          subject: subject.trim(),
          eyebrow: String(promoPayload.eyebrow ?? '').trim(),
          title: String(promoPayload.title ?? '').trim(),
          intro: String(promoPayload.intro ?? '').trim(),
          steps: promoSteps,
          primaryCtaLabel: String(promoPayload.primaryCtaLabel ?? '').trim(),
          primaryCtaUrl: String(promoPayload.primaryCtaUrl ?? '').trim(),
          secondaryCtaLabel: promoPayload.secondaryCtaLabel?.trim() || undefined,
          secondaryCtaUrl: promoPayload.secondaryCtaUrl?.trim() || undefined,
          footerNote: promoPayload.footerNote?.trim() || undefined,
          clubLogoUrl: clubConfig?.logoAbsoluteUrl ?? null,
          clubDisplayName: clubConfig?.displayName,
        });

    const fromName = clubConfig?.fromName ?? 'Tai — Trophy Cast';

    // ── 5. Send via Resend batch (max 100 per call) ───────────────────────────
    // Enforce the club prefix server-side so it can't be stripped from the UI.
    const prefix = clubConfig?.subjectPrefix ?? '';
    const subjectOut = subject.trim().startsWith(prefix)
      ? subject.trim()
      : `${prefix}${subject.trim()}`;

    const baseEmail = {
      from: `${fromName} <cast@trophycast.app>`,
      subject: subjectOut,
      html: htmlBody,
      ...(scheduleTime ? { scheduledAt: scheduleTime as string } : {}),
    };

    const ids: string[] = [];
    for (let i = 0; i < emails.length; i += 100) {
      const chunk = emails.slice(i, i + 100).map((to) => ({ ...baseEmail, to }));
      const { data, error } = await getResend().batch.send(chunk);
      if (error) {
        console.error('[weekly-email] Resend batch error:', error);
        return NextResponse.json(
          { error: 'Failed to send email.', detail: error.message },
          { status: 500 }
        );
      }
      const sent = (data as { data?: { id: string }[] } | null)?.data ?? [];
      ids.push(...sent.map((d) => d.id));
    }

    return NextResponse.json({
      ok: true,
      action: scheduleTime ? 'scheduled' : 'sent',
      campaignType,
      audience,
      recipientCount: emails.length,
      scheduleTime: scheduleTime ?? null,
      ids,
    });
  } catch (error) {
    console.error('[weekly-email] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
