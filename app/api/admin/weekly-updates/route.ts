import { NextResponse } from 'next/server';
import { weeklyUpdates } from '@/lib/weeklyUpdates';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(weeklyUpdates);
}
