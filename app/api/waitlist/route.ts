import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder',
);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = String(body?.email ?? '').trim().toLowerCase();

    if (!rawEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!emailRegex.test(rawEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const { error } = await supabase
      .from('waitlist_subscribers')
      .upsert({ email: rawEmail, role: 'waitlist', club_name: 'Trophy Cast' }, { onConflict: 'email' });

    if (error) {
      console.error('[waitlist] Supabase upsert failed:', error);
      return NextResponse.json(
        { error: 'Could not save your registration. Please try again.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[waitlist] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
