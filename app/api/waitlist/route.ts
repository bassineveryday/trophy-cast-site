import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  waitlistConfirmationHtml,
  waitlistConfirmationText,
} from "@/lib/emails/waitlistConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY!);
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID!;

export async function POST(request: Request) {
  try {
    const { firstName, email, role, clubName } = await request.json();

    if (!email || !firstName || !role) {
      return NextResponse.json(
        { error: "First name, email, and role are required." },
        { status: 400 }
      );
    }

    // Add to Resend Audience (void role/clubName — stored in confirmation email context only)
    const { error: contactError } = await resend.contacts.create({
      audienceId: RESEND_AUDIENCE_ID,
      email,
      firstName,
      unsubscribed: false,
    });

    if (contactError) {
      // Duplicate contacts are fine — already subscribed
      const isDuplicate = contactError.message?.toLowerCase().includes('already exist');
      if (!isDuplicate) {
        console.error("Resend contact error:", contactError);
        return NextResponse.json(
          { error: "Failed to join waitlist. Please try again." },
          { status: 500 }
        );
      }
    }

    // Send confirmation email (non-blocking)
    try {
      await resend.emails.send({
        from: "Tai at Trophy Cast <cast@trophycast.app>",
        to: email,
        subject: "You're on the Trophy Cast waitlist 🏆",
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
