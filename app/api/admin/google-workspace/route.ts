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

/** Bassin' Everyday business Drive subfolders */

interface FolderEntry {
  key: string;
  label: string;
  icon: string;
  folderId: string;
}

const BUSINESS_FOLDERS: FolderEntry[] = [
  { key: 'dev_sync',    label: '00 Dev Sync',         icon: '💻', folderId: '1NVt31uRG75wxLSbPSLnX93Vs6o1unf0F' },
  { key: 'trophy_cast', label: '01 Trophy Cast Root', icon: '🏆', folderId: '1vzajKVvAbp8TODIaKcORUIjiV2oQmSsC' },
  { key: 'admin_legal', label: '02 Admin & Legal',    icon: '📋', folderId: '1xkAjpBG44-lBL3OHK6JQ_Mu_bBvjOyTd' },
  { key: 'marketing',   label: '03 Marketing Assets', icon: '📣', folderId: '1EjWg99ijdxH6_0VB52l2bxEsXI9qAyQ3' },
  { key: 'research',    label: '04 Research Library', icon: '📚', folderId: '1cWkr5wbikIenhfRmtcvBtx98D7vaV09e' },
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
      folderId: f.folderId,
    }));

    const configured = true;

    return NextResponse.json({ configured, folders });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
