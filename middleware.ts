import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Brute-force brake on the password-protected surfaces.
 *
 * WHY THIS EXISTS (2026-09-10). Every `/api/admin/*` route and the support
 * magic-link route are guarded by a SHARED password, compared constant-time and
 * failing closed — that part was already correct. What was missing was a limit on
 * how many times you may guess it. Measured against production: **12 wrong
 * passwords in a row against `/api/admin/dashboard-stats` returned 401 twelve
 * times and never once blocked.** An attacker could sit there forever.
 *
 * Doing it here rather than in each route is deliberate: there are 19 admin routes
 * today, and a route added tomorrow would silently ship without a brake. Middleware
 * cannot be forgotten.
 *
 * ⚠️ This is per-instance memory, not a shared store. On serverless it blunts a
 * single-source brute force, it does not defeat a distributed one. The password
 * itself is still the real wall — this buys time and makes hammering loud.
 */

const WINDOW_MS = 60_000; // 1 minute
const MAX_ATTEMPTS = 10; // per IP, per minute, per protected surface

const attempts = new Map<string, number[]>();

function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(key, recent);
    return true;
  }

  recent.push(now);
  attempts.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (attempts.size > 5000) attempts.clear();

  return false;
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for') ?? '';
  return forwarded.split(',')[0]?.trim() || 'unknown';
}

export function middleware(request: NextRequest) {
  // Only POSTs carry a password guess; GETs on these routes are already 401'd
  // by the route itself and are not worth throttling.
  if (request.method !== 'POST') return NextResponse.next();

  const key = `${request.nextUrl.pathname}:${clientIp(request)}`;

  if (tooManyAttempts(key)) {
    return NextResponse.json(
      { error: 'Too many attempts. Wait a minute and try again.' },
      {
        status: 429,
        headers: { 'Retry-After': '60' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/support/:path*'],
};
