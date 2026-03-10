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

/** Bassin' Everyday business Drive — root folder with env-var overrides for subfolders */
const BE_ROOT_FOLDER_ID = '17yVE5tS2G7ySfdIWlrUAkMU6seUCnzGN';

interface FolderEntry {
  key: string;
  label: string;
  icon: string;
  folderId?: string;
  envKey?: string;
}

const BUSINESS_FOLDERS: FolderEntry[] = [
  { key: 'root', label: 'Bassin\' Everyday Drive', icon: '🗂️', folderId: BE_ROOT_FOLDER_ID },
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
      folderId: f.folderId ?? (f.envKey ? process.env[f.envKey] ?? null : null),
    }));

    const configured = folders.some((f) => f.folderId !== null);

    return NextResponse.json({ configured, folders });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
