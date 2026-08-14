import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkSecret, rateLimit, clientKey } from "@/lib/apiAuth";

export async function POST(req: Request) {
  // ── Auth check ──────────────────────────────────────────────────────────────
  // This endpoint issues a live login link for ANY account — full impersonation.
  // Compare in constant time (was a plain `!==`, a timing oracle) and rate-limit,
  // because the secret is otherwise brute-forceable at HTTP speed (2026-08-14).
  const adminSecret = req.headers.get("x-admin-secret");
  if (!checkSecret(adminSecret, process.env.SUPPORT_ADMIN_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!rateLimit(clientKey(req, "support-magic-link"), 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { email: rawInput, reason } = (await req.json()) as {
    email?: string;
    reason?: string;
  };

  if (!rawInput) {
    return NextResponse.json({ error: "email or phone is required" }, { status: 400 });
  }

  // ── Supabase admin client (service role — server only, never in browser) ────
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // ── Resolve input: if it looks like a phone number, look up the email ───────
  const isPhone = /^[\d().\-\s+]+$/.test(rawInput.trim()) && rawInput.replace(/\D/g, "").length >= 7;
  let email = rawInput.trim();

  if (isPhone) {
    const digits = rawInput.replace(/\D/g, "");
    // Build the filter from DIGITS ONLY — never from raw input. The previous version
    // interpolated `rawInput` straight into the `.or()` string, which is PostgREST
    // filter injection into a profiles query (`.` and parens are operator syntax in
    // that grammar, and the input regex permits both). 2026-08-14.
    if (digits.length < 7 || digits.length > 15) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    const { data: match, error: lookupErr } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .or(`mobile_phone.eq.${digits},mobile_phone.eq.${formatted}`)
      .limit(1)
      .maybeSingle();

    if (lookupErr || !match) {
      return NextResponse.json({ error: "No member found with that phone number" }, { status: 404 });
    }

    // Get the email from auth.users
    const { data: userData, error: userErr } = await supabaseAdmin.auth.admin.getUserById(match.id);
    if (userErr || !userData?.user?.email) {
      return NextResponse.json({ error: "Could not resolve email for that phone number" }, { status: 404 });
    }
    email = userData.user.email;
  }

  // ── Generate magic link ─────────────────────────────────────────────────────
  // redirectTo must point to the live app, not localhost
  const appUrl =
    process.env.SUPPORT_APP_URL ?? "https://app.trophycast.app";

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: appUrl,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // ── Audit log (best-effort — don't fail the request if this errors) ─────────
  await supabaseAdmin
    .from("support_impersonation_log")
    .insert({
      admin_email: process.env.SUPPORT_ADMIN_EMAIL ?? "admin",
      target_email: email,
      reason: reason ?? "Support request",
    })
    .then(({ error: logErr }) => {
      if (logErr) console.error("[support] audit log failed:", logErr.message);
    });

  return NextResponse.json({
    action_link: data.properties?.action_link ?? null,
  });
}
