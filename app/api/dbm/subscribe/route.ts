import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, source } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json({ error: 'First name and email are required.' }, { status: 400 });
    }

    const emailClean = email.toLowerCase().trim();
    const tag = source ?? '2026-Print-Flyer';

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
    await supabase.from('waitlist_subscribers').upsert(
      {
        email: emailClean,
        first_name: firstName.trim(),
        role: 'dbm-member',
        club_name: 'Denver BassMasters',
      },
      { onConflict: 'email', ignoreDuplicates: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[dbm/subscribe] Unexpected error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
