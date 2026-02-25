import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  waitlistConfirmationHtml,
  waitlistConfirmationText,
} from "@/lib/emails/waitlistConfirmation";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_SERVER = MAILCHIMP_API_KEY?.split("-")[1]; // e.g. "us18"
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const { firstName, email, role, clubName } = await request.json();

    if (!email || !firstName || !role) {
      return NextResponse.json(
        { error: "First name, email, and role are required." },
        { status: 400 }
      );
    }

    // Build tags based on role
    const tags: string[] = ["waitlist", role];
    if (clubName) tags.push("has-club");

    const mcRes = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            ROLE: role,
            CLUB: clubName || "",
          },
          tags,
        }),
      }
    );

    const mcData = await mcRes.json();

    // "Member Exists" is fine — they're already subscribed
    if (!mcRes.ok && mcData.title !== "Member Exists") {
      console.error("Mailchimp error:", mcData);
      return NextResponse.json(
        { error: "Failed to join waitlist. Please try again." },
        { status: 500 }
      );
    }

    // Send confirmation email via Resend (non-blocking — domain may still be verifying)
    try {
      if (resend) {
        await resend.emails.send({
          from: "Tai at Trophy Cast <cast@trophycast.app>",
          to: email,
          subject: "You're on the Trophy Cast waitlist 🏆",
          html: waitlistConfirmationHtml(firstName),
          text: waitlistConfirmationText(firstName),
        });
      }
    } catch (emailErr) {
      // Don't fail the whole request if email sending fails (e.g. domain still verifying)
      console.warn("Resend email failed (domain may still be verifying):", emailErr);
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
