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

/** Bassin' Everyday business Drive subfolders — set folder IDs in Vercel env vars */

interface FolderEntry {
  key: string;
  label: string;
  icon: string;
  envKey: string;
}

const BUSINESS_FOLDERS: FolderEntry[] = [
  { key: 'dev_sync',    label: '00 Dev Sync',             icon: '💻', envKey: 'BE_DRIVE_DEV_SYNC' },
  { key: 'trophy_cast', label: '01 Trophy Cast Root',     icon: '🏆', envKey: 'BE_DRIVE_TROPHY_CAST' },
  { key: 'admin_legal', label: '02 Admin & Legal',        icon: '📋', envKey: 'BE_DRIVE_ADMIN_LEGAL' },
  { key: 'marketing',   label: '03 Marketing Assets',     icon: '📣', envKey: 'BE_DRIVE_MARKETING' },
  { key: 'research',    label: '04 Research Library',      icon: '📚', envKey: 'BE_DRIVE_RESEARCH' },
  { key: 'archive',     label: 'Archive – Reference Only', icon: '🗄️', envKey: 'BE_DRIVE_ARCHIVE' },
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
