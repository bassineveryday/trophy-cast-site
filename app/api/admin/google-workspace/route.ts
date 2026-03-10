import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

function checkPassword(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = new Uint8Array(Buffer.from(provided));
  const b = new Uint8Array(Buffer.from(expected));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Bassin' Everyday business Drive folders — set in Vercel env vars */
const BUSINESS_FOLDERS = [
  { key: 'root', label: 'Bassin Everyday Drive', icon: '🗂️', envKey: 'BE_DRIVE_ROOT' },
  { key: 'product', label: 'Product & Development', icon: '🛠️', envKey: 'BE_DRIVE_PRODUCT' },
  { key: 'marketing', label: 'Marketing & Content', icon: '📣', envKey: 'BE_DRIVE_MARKETING' },
  { key: 'finance', label: 'Finance & Accounting', icon: '💰', envKey: 'BE_DRIVE_FINANCE' },
  { key: 'operations', label: 'Operations', icon: '⚙️', envKey: 'BE_DRIVE_OPERATIONS' },
  { key: 'clients', label: 'Clubs & Clients', icon: '🎣', envKey: 'BE_DRIVE_CLIENTS' },
];

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!checkPassword(String(password ?? ''), ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const folders = BUSINESS_FOLDERS.map((f) => ({
      key: f.key,
      label: f.label,
      icon: f.icon,
      folderId: process.env[f.envKey] ?? null,
    }));

    const configured = folders.some((f) => f.folderId !== null);

    return NextResponse.json({ configured, folders });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
