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

// Fetch subscribed emails from Supabase, optionally filtered by club
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
    const audience = rawAudience === 'all' ? 'all' : 'club';
    const clubConfig = getClubEmailConfig(clubId);

    // ── 1. Auth ───────────────────────────────────────────────────────────────
    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── 2. Validate inputs ────────────────────────────────────────────────────
    if (!subject?.trim()) {
      return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
    }
    if (audience === 'club' && !clubConfig?.clubName) {
      return NextResponse.json({ error: 'A valid club is required for club-only sends.' }, { status: 400 });
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

    // ── 3. Fetch subscriber list ──────────────────────────────────────────────
    let emails: string[];
    try {
      emails = await fetchSubscriberEmails(audience === 'all' ? null : clubConfig?.clubName ?? null);
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
