import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { buildEmailHtml, buildPromoEmailHtml } from '@/lib/emailTemplate';
import { getClubEmailConfig } from '@/lib/clubEmailConfig';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
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
      clubId,
      campaignType: rawCampaignType,
      promo,
    } = body;
    const campaignType = rawCampaignType === 'promo' ? 'promo' : 'weekly';

    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clubConfig = getClubEmailConfig(clubId);
    const bulletList: string[] = Array.isArray(bullets)
      ? bullets.filter((b: string) => b?.trim())
      : [];
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

    const html = campaignType === 'weekly'
      ? buildEmailHtml({
          subject: subject?.trim() || '(No subject)',
          bullets: bulletList.length ? bulletList : ['(No bullets yet)'],
          deepDive: deepDive || 'Dock Talk',
          deepDiveNote,
          meetingFocus,
          clubLogoUrl: clubConfig?.logoAbsoluteUrl ?? null,
          clubDisplayName: clubConfig?.displayName,
        })
      : buildPromoEmailHtml({
          subject: subject?.trim() || '(No subject)',
          eyebrow: promoPayload.eyebrow?.trim() || 'Tightline Outdoors × Trophy Cast',
          title: promoPayload.title?.trim() || 'Catch Rate registration is open',
          intro: promoPayload.intro?.trim() || 'Register today in Trophy Cast so tomorrow morning is quick at check-in.',
          steps: promoSteps.length
            ? promoSteps
            : [{ title: 'Register for Catch Rate', body: 'Tap below and lock in your spot.' }],
          primaryCtaLabel: promoPayload.primaryCtaLabel?.trim() || 'Register for Catch Rate',
          primaryCtaUrl: promoPayload.primaryCtaUrl?.trim() || 'https://trophycast.app/join/tlo',
          secondaryCtaLabel: promoPayload.secondaryCtaLabel?.trim() || undefined,
          secondaryCtaUrl: promoPayload.secondaryCtaUrl?.trim() || undefined,
          footerNote: promoPayload.footerNote?.trim() || undefined,
          clubLogoUrl: clubConfig?.logoAbsoluteUrl ?? null,
          clubDisplayName: clubConfig?.displayName,
        });

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
