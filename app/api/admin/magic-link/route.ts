import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

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
    const { password, email, reason } = (await request.json()) as {
      password?: string;
      email?: string;
      reason?: string;
    };

    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const appUrl = process.env.SUPPORT_APP_URL ?? 'https://app.trophycast.app';

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: appUrl },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Audit log (best-effort)
    await supabaseAdmin
      .from('support_impersonation_log')
      .insert({
        admin_email: process.env.SUPPORT_ADMIN_EMAIL ?? 'admin',
        target_email: email,
        reason: reason ?? 'Bug report debug',
      })
      .then(({ error: logErr }) => {
        if (logErr) console.error('[admin/magic-link] audit log failed:', logErr.message);
      });

    return NextResponse.json({
      action_link: data.properties?.action_link ?? null,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
