import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import {
  waitlistConfirmationHtml,
  waitlistConfirmationText,
} from "@/lib/emails/waitlistConfirmation";

export const dynamic = 'force-dynamic';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

export async function POST(request: Request) {
  try {
    const { firstName, email, role, clubName } = await request.json();

    if (!email || !firstName || !role) {
      return NextResponse.json(
        { error: "First name, email, and role are required." },
        { status: 400 }
      );
    }

    // Upsert into Supabase waitlist_subscribers
    const { error: dbError } = await supabase
      .from('waitlist_subscribers')
      .upsert(
        { email: email.toLowerCase().trim(), first_name: firstName, role, club_name: clubName || null },
        { onConflict: 'email', ignoreDuplicates: true }
      );

    if (dbError) {
      console.error("Supabase waitlist error:", dbError);
      return NextResponse.json(
        { error: "Failed to join waitlist. Please try again." },
        { status: 500 }
      );
    }

    // Send confirmation email (non-blocking)
    try {
      await getResend().emails.send({
        from: "Tai at Trophy Cast <cast@trophycast.app>",
        to: email,
        subject: "You're on the Trophy Cast waitlist \uD83C\uDFC6",
        html: waitlistConfirmationHtml(firstName),
        text: waitlistConfirmationText(firstName),
      });
    } catch (emailErr) {
      console.warn("Resend confirmation email failed:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}


