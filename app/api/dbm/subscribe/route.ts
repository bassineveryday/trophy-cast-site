import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { waitlistConfirmationHtml, waitlistConfirmationText } from '@/lib/emails/waitlistConfirmation';
import { getClubEmailConfig } from '@/lib/clubEmailConfig';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

const MC_API_KEY = process.env.MAILCHIMP_DBM_API_KEY ?? '';
const MC_AUDIENCE_ID = process.env.MAILCHIMP_DBM_AUDIENCE_ID ?? '';
// API key format: <key>-<dc> (e.g. abc123-us12)
const MC_DC = MC_API_KEY.split('-').pop() ?? 'us12';
const MC_BASE = `https://${MC_DC}.api.mailchimp.com/3.0`;

let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, source, program } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json({ error: 'First name and email are required.' }, { status: 400 });
    }

    const emailClean = email.toLowerCase().trim();
    const tag = source ?? '2026-Print-Flyer';

    // Map program to club_name (must match CLUB_EMAIL_CONFIGS clubName values)
    const PROGRAM_TO_CLUB: Record<string, { clubName: string; role: string }> = {
      adult:      { clubName: 'Denver BassMasters', role: 'dbm-member' },
      juniors:    { clubName: 'DBM Juniors',        role: 'dbm-juniors-member' },
      highschool: { clubName: 'DBM High School',    role: 'dbm-hs-member' },
    };
    const clubEntry = PROGRAM_TO_CLUB[program as string] ?? PROGRAM_TO_CLUB.adult;

    // ── 1. Add/update member in Mailchimp audience ────────────────────────────
    // Using PUT so it upserts (creates or updates)
    const mcRes = await fetch(
      `${MC_BASE}/lists/${MC_AUDIENCE_ID}/members/${Buffer.from(emailClean).toString('hex')}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${MC_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: emailClean,
          status_if_new: 'subscribed',
          merge_fields: {
            FNAME: firstName.trim(),
            LNAME: (lastName ?? '').trim(),
          },
          tags: [tag],
        }),
      }
    );

    if (!mcRes.ok) {
      const mcErr = await mcRes.json().catch(() => ({}));
      console.error('[dbm/subscribe] Mailchimp error:', mcErr);
      // Don't block the user — still save to Supabase
    }

    // ── 2. Apply tag explicitly (tags endpoint is separate from member PUT) ───
    try {
      await fetch(
        `${MC_BASE}/lists/${MC_AUDIENCE_ID}/members/${Buffer.from(emailClean).toString('hex')}/tags`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`anystring:${MC_API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tags: [{ name: tag, status: 'active' }],
          }),
        }
      );
    } catch (tagErr) {
      console.warn('[dbm/subscribe] Tag apply failed:', tagErr);
    }

    // ── 3. Save to Supabase as backup ─────────────────────────────────────────
    // Use ignoreDuplicates: false so a re-signup with a different program
    // correctly updates club_name and role instead of silently keeping stale data.
    const { error: dbWriteError } = await supabase.from('waitlist_subscribers').upsert(
      {
        email: emailClean,
        first_name: firstName.trim(),
        role: clubEntry.role,
        club_name: clubEntry.clubName,
      },
      { onConflict: 'email' }
    );
    if (dbWriteError) {
      console.error('[dbm/subscribe] Supabase upsert failed:', dbWriteError);
      return NextResponse.json({ error: 'Could not save your registration. Please try again.' }, { status: 500 });
    }
    // ── 4. Send branded confirmation email via Resend ───────────────────────────
    const resend = getResend();
    if (resend) {
      const clubId = (
        { adult: 'DBM', juniors: 'DBMJ', highschool: 'DBMHS' } as Record<string, string>
      )[program as string] ?? 'DBM';
      const clubConfig = getClubEmailConfig(clubId);
      const fromName = clubConfig?.fromName ?? 'Tai — Trophy Cast';
      const subjectPrefix = clubConfig?.subjectPrefix ?? '';

      await resend.emails.send({
        from: `${fromName} <cast@trophycast.app>`,
        to: emailClean,
        subject: `${subjectPrefix}You’re signed up! 🎣`,
        html: waitlistConfirmationHtml(firstName.trim(), {
          clubLogoUrl: clubConfig?.logoAbsoluteUrl ?? null,
          clubDisplayName: clubConfig?.displayName,
          clubName: clubConfig?.displayName,
        }),
        text: waitlistConfirmationText(firstName.trim()),
      }).catch((err) => console.warn('[dbm/subscribe] Resend confirmation failed:', err));
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[dbm/subscribe] Unexpected error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
