import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { siteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

// Admin email for new registrations — override with TLO_ADMIN_EMAIL env var
const ADMIN_EMAIL = process.env.TLO_ADMIN_EMAIL ?? 'tai@trophycast.app';

const SPECIES_LABELS: Record<string, string> = {
  bass: 'Bass',
  walleye: 'Walleye',
  trout: 'Trout',
  carp: 'Carp',
};

const catchRateContent = siteContent.tightLineOutdoors.catchRate;
const registrationContent = catchRateContent.registration;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, species } = body as {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      species: string[];
    };

    // ── Validate ───────────────────────────────────────────────────────────────
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'First name, last name, and email are required.' }, { status: 400 });
    }
    if (!species || species.length === 0) {
      return NextResponse.json({ error: 'Select at least one species division.' }, { status: 400 });
    }
    const validSpecies = ['bass', 'walleye', 'trout', 'carp'];
    if (species.some((s) => !validSpecies.includes(s))) {
      return NextResponse.json({ error: 'Invalid species selection.' }, { status: 400 });
    }

    const emailClean = email.toLowerCase().trim();
    const speciesLabels = species.map((s) => SPECIES_LABELS[s] ?? s).join(', ');
    const feeTotal = species.length * 20;

    // ── 1. Save to Supabase waitlist (primary backup record) ──────────────────
    // We store what columns we know exist. Species go into the role field as a
    // searchable prefix so staff can filter the list.
    const { error: dbError } = await supabase.from('waitlist_subscribers').upsert(
      {
        email: emailClean,
        first_name: firstName.trim(),
        role: `tlo-catch-rate-2026|${species.join(',')}`,
        club_name: 'Tightline Outdoors',
      },
      { onConflict: 'email' }
    );

    if (dbError) {
      console.error('[tlo/register] Supabase upsert error:', dbError);
      // Don't block the user on a DB write failure — emails are the backup
    }

    // ── 2. Admin notification ─────────────────────────────────────────────────
    if (resend) {
      const adminHtml = `
        <h2 style="font-family:sans-serif;color:#0B1A2F">New TLO Catch Rate Registration</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#555">Name</td><td>${firstName.trim()} ${lastName.trim()}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#555">Email</td><td>${emailClean}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#555">Phone</td><td>${phone?.trim() || '—'}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#555">Species</td><td>${speciesLabels}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#555">Fee due</td><td><strong>$${feeTotal} cash to ${registrationContent.paymentContact} before the tournament</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#555">Registered</td><td>${new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })} MT</td></tr>
        </table>
      `;
      await resend.emails.send({
        from: 'Trophy Cast <cast@trophycast.app>',
        to: ADMIN_EMAIL,
        subject: `New TLO Registration: ${firstName.trim()} ${lastName.trim()} — ${speciesLabels}`,
        html: adminHtml,
      }).catch((err) => console.warn('[tlo/register] Admin email failed:', err));
    }

    // ── 3. Welcome email to angler ────────────────────────────────────────────
    if (resend) {
      const welcomeHtml = `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff">
          <h1 style="color:#0B1A2F;font-size:22px;margin:0 0 8px">You're registered! 🎣</h1>
          <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px">
            Hey ${firstName.trim()}, you're in for the <strong>2026 Tightline Outdoors Catch Rate Tournament</strong>
            at ${catchRateContent.locationShort}.
          </p>
          <div style="background:#F9FAFB;border-radius:10px;padding:16px 20px;margin-bottom:24px">
            <p style="margin:0 0 6px;font-size:14px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Your Registration</p>
            <p style="margin:0 0 4px;font-size:15px;color:#111827"><strong>Species:</strong> ${speciesLabels}</p>
            <p style="margin:0 0 4px;font-size:15px;color:#111827"><strong>Pay ${registrationContent.paymentContact} before the tournament:</strong> $${feeTotal} cash</p>
            <p style="margin:0;font-size:13px;color:#6B7280">${species.length} species × $20 each</p>
          </div>
          <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px">
            ${registrationContent.paymentInstruction} ${registrationContent.followUpInstruction}
            Have your phone ready to record video catches. The TD will tell you the code word at check-in.
          </p>
          <a href="https://trophycast.app" style="display:inline-block;background:#C9A646;color:#0B1A2F;font-weight:700;font-size:15px;padding:12px 24px;border-radius:8px;text-decoration:none;margin-bottom:24px">
            Open Trophy Cast →
          </a>
          <p style="color:#9CA3AF;font-size:13px;line-height:1.6;margin:0">
            Questions? Visit <a href="https://tightlineoutdoors.com" style="color:#C9A646">tightlineoutdoors.com</a> or find Nate at the event.
          </p>
        </div>
      `;
      await resend.emails.send({
        from: 'Trophy Cast <cast@trophycast.app>',
        to: emailClean,
        subject: `You're registered for TLO Catch Rate 2026 — pay ${registrationContent.paymentContact} before the tournament`,
        html: welcomeHtml,
      }).catch((err) => console.warn('[tlo/register] Welcome email failed:', err));
    }

    return NextResponse.json({ success: true, feeTotal, speciesLabels });
  } catch (err) {
    console.error('[tlo/register] Unexpected error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
