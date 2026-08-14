/**
 * Shared API auth helpers for trophy-cast-site.
 *
 * WHY THIS FILE EXISTS (2026-08-14):
 * `checkPassword` was copy-pasted into ~12 route files (one copy had drifted to a
 * non-constant-time `!==`), and a `verifyAuth` that accepted ANY valid Supabase JWT
 * was copy-pasted into 3 survey routes — letting any signed-in account mass-email a
 * club. Auth logic lives here now so a fix lands everywhere at once.
 *
 * Rules encoded here:
 *  - A valid JWT proves AUTHENTICATION, never AUTHORIZATION. Signup is open, so
 *    "somebody is logged in" includes minors and walk-ups.
 *  - Officer status keys on PRESENCE in `v_org_current_board` for that club — never a
 *    role-code allowlist (TLO's officers are `Owner`; DBMJ/FRBC-HS only `President`,
 *    so an allowlist takes those clubs dark).
 *  - Every check fails closed: missing env, missing club, bad token => false.
 *
 * See docs/SITE_SECURITY_MODEL_PRD.md.
 */
import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';

let _client: SupabaseClient | null = null;
function serviceClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
    );
  }
  return _client;
}

/** Constant-time password compare. Fails closed on empty/missing values. */
export function checkPassword(provided: string, expected: string = ADMIN_PASSWORD): boolean {
  if (!expected || !provided) return false;
  const a = new Uint8Array(Buffer.from(String(provided)));
  const b = new Uint8Array(Buffer.from(String(expected)));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Constant-time compare for any shared secret (e.g. SUPPORT_ADMIN_SECRET). */
export function checkSecret(provided: string | null, expected: string | undefined): boolean {
  if (!expected || !provided) return false;
  return checkPassword(provided, expected);
}

/** True when the request body carries the shared admin password. */
export function hasAdminPassword(body: { password?: unknown } | null | undefined): boolean {
  const pw = body?.password;
  return typeof pw === 'string' && checkPassword(pw, ADMIN_PASSWORD);
}

function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
}

/** Resolves the caller's profile id from a bearer token, or null. Authentication only. */
export async function resolveCallerId(request: Request): Promise<string | null> {
  const token = bearerToken(request);
  if (!token) return null;
  const { data, error } = await serviceClient().auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user.id;
}

/**
 * True when `profileId` holds a CURRENT board seat in `clubId`.
 * Presence-based by design — any position counts. Fails closed on a missing club id.
 */
export async function isClubOfficer(profileId: string, clubId: string | null | undefined): Promise<boolean> {
  if (!profileId || !clubId) return false;
  const { data, error } = await serviceClient()
    .from('v_org_current_board')
    .select('profile_id')
    .eq('club_id', clubId)
    .eq('profile_id', profileId)
    .eq('is_current', true)
    .limit(1);
  if (error) {
    console.error('[apiAuth] officer lookup failed:', error.message);
    return false; // fail closed
  }
  return (data?.length ?? 0) > 0;
}

/**
 * The gate for club-scoped admin actions (send a survey, analyze responses, …).
 *
 * Passes when EITHER the shared admin password is present (Tai's own console) OR the
 * bearer token belongs to a current officer of `clubId`. A bare valid JWT is NOT enough.
 * Pass `clubId: null` only for actions with no club scope — the JWT arm then refuses.
 */
export async function requireClubOfficer(
  request: Request,
  body: { password?: unknown } | null | undefined,
  clubId: string | null | undefined
): Promise<boolean> {
  if (hasAdminPassword(body)) return true;
  const callerId = await resolveCallerId(request);
  if (!callerId) return false;
  return isClubOfficer(callerId, clubId);
}

/**
 * The gate for actions with no club scope (AI question suggestions, etc.).
 * Admin password, or an officer of ANY club. Still never a bare JWT.
 */
export async function requireAnyOfficer(
  request: Request,
  body: { password?: unknown } | null | undefined
): Promise<boolean> {
  if (hasAdminPassword(body)) return true;
  const callerId = await resolveCallerId(request);
  if (!callerId) return false;
  const { data, error } = await serviceClient()
    .from('v_org_current_board')
    .select('profile_id')
    .eq('profile_id', callerId)
    .eq('is_current', true)
    .limit(1);
  if (error) {
    console.error('[apiAuth] any-officer lookup failed:', error.message);
    return false;
  }
  return (data?.length ?? 0) > 0;
}

/**
 * CORS for token-bearing routes.
 * `origin.endsWith('.vercel.app')` used to be allowed here — that reflects ANY attacker's
 * preview deployment while `Allow-Headers` includes `Authorization`. Preview hosts are now
 * matched against this project's own deployment prefixes only.
 */
export function corsHeaders(origin: string | null, methods = 'POST, OPTIONS'): Record<string, string> {
  const allowed =
    !!origin &&
    (origin === 'https://trophycast.app' ||
      origin === 'https://www.trophycast.app' ||
      /^https:\/\/trophy-cast-(site|mvp-v2)[a-z0-9-]*\.vercel\.app$/.test(origin) ||
      /^http:\/\/localhost:\d+$/.test(origin));
  return {
    'Access-Control-Allow-Origin': allowed ? (origin as string) : 'https://trophycast.app',
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  };
}

/** Best-effort in-memory rate limit. Per-instance only — a speed bump, not a wall. */
const hits = new Map<string, number[]>();
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}

/** Caller fingerprint for rate limiting. */
export function clientKey(request: Request, scope: string): string {
  const fwd = request.headers.get('x-forwarded-for') ?? '';
  const ip = fwd.split(',')[0]?.trim() || 'unknown';
  return `${scope}:${ip}`;
}
