import { NextResponse } from "next/server";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_SERVER = MAILCHIMP_API_KEY?.split("-")[1]; // e.g. "us18"

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
