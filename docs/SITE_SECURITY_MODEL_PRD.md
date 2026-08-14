# trophy-cast-site — Security Model & Backlog (as-built)

> **Status:** ✅ **ALL CRITICAL + HIGH ITEMS FIXED 2026-08-14** — found and closed the same day. Auth now lives in one place: **`lib/apiAuth.ts`**. Remaining items are MEDIUM and listed below.
> **The one structural fact:** every API route in this repo uses the **service-role Supabase key**, so RLS is bypassed on every DB call — the route's own check is the only wall. The repo now has its **first officer check**: `lib/apiAuth.ts` resolves the caller from a bearer token and verifies **presence in `v_org_current_board`** for the club in question. Presence-based, never a role-code allowlist — TLO's officers are `Owner` and DBMJ/FRBC-HS only `President`, so an allowlist would take those clubs dark. Verified live: 22 current officers across DBM/DBMJ/FRBC-HS/TLO, all carrying a `profile_id`.

## How auth works today

- **Public routes** (`/api/waitlist`, `/api/dbm/subscribe`, `/api/tlo/register`, `/api/bug-report`, `/api/surveys/[id]`): unauthenticated by design (public forms) — `bug-report` verifies a member JWT and writes the server-derived `user.id`.
- **Admin routes** (15 under `/api/admin/*`): one shared `ADMIN_PASSWORD`, sent **in the JSON body**, compared with `crypto.timingSafeEqual` (one route drifted to `!==`). No rate limit or lockout on any of them.
- **Support/impersonation** (`/api/support/magic-link`): `SUPPORT_ADMIN_SECRET` in an `x-admin-secret` header, non-constant-time compare.
- **Client admin gate** (`lib/useAdminAuth.ts`): password in `sessionStorage` key `tc_admin_pw`, re-sent per request. No middleware — page shells render for anyone; the API layer is the only real wall.

## ✅ Fixed 2026-08-14 (found and closed the same day)

1. **`admin/weekly-updates` POST had NO auth at all** — anyone could drive `gpt-4o-mini` and cause an authenticated GitHub API fetch with `TROPHY_CAST_GITHUB_TOKEN` against the private app repo. **Now:** `hasAdminPassword` + a 10/min rate limit; the admin composer sends the password with its refresh call.
2. **`surveys/[id]/send` accepted ANY valid JWT** — any signed-in account (including a self-registered junior) could activate a draft survey and Resend-blast every `waitlist_subscribers` row for that club. The same `verifyAuth` was copy-pasted into `analyze` (→ paid OpenAI + overwrote `ai_summary`) and `suggest` (→ free OpenAI proxy). **Now:** the survey's `club_id` is resolved *before* authorization and all three call `requireClubOfficer` / `requireAnyOfficer`. A bare JWT no longer passes anywhere.
3. **`surveys` GET was unauthenticated** — returned every survey, draft, `ai_summary` and `created_by` for any `club_id` in the query string. **Now:** officer-gated like its POST/PATCH siblings; the password rides in the `x-admin-password` header (GET has no body) and the admin page was updated to send it.
4. **Public survey POST let anyone overwrite another member's answers** — `respondentId` is caller-supplied and unverified, and the upsert keyed on it. **Now:** one submission per respondent — a second attempt returns **409** instead of replacing the first. Plus a 10/min rate limit.
5. **`support/magic-link` — account-takeover surface.** Non-constant-time secret compare (a timing oracle on an endpoint that issues a login link for ANY account) and a **PostgREST filter injection**: raw user input was interpolated straight into the `.or()` phone lookup. **Now:** `checkSecret` (constant-time), the filter is built from **digits only** with a length guard, and a 5/min rate limit.
6. **`admin/polish-bullets` used a plain `!==`** — the one drifted password compare in the repo. **Now:** constant-time via the shared helper.
7. **Permissive CORS** — `origin.endsWith('.vercel.app')` reflected *any* attacker's preview deployment while `Allow-Headers` includes `Authorization`. **Now:** preview origins must match this project's own deployment prefixes; `Vary: Origin` added.
8. **`tlo/register` HTML-injected the admin inbox** — name/phone/email interpolated raw into the notification email. **Now:** escaped through `esc()`. Both `tlo/register` and `dbm/subscribe` gained the email-format check `waitlist` already had, plus rate limits; `waitlist` got one too.

**Structural fix that made the above possible:** `lib/apiAuth.ts` is now the single source for `checkPassword` (was ~12 copies, one drifted), the officer lookup, CORS, and rate limiting. Fix it once, it lands everywhere.

## 🟡 Still open (MEDIUM — accepted for now)

- **One shared `ADMIN_PASSWORD` across 14 routes, sent in the request body** (so it lands in any body logging). Rate limiting now blunts brute force, but the real fix is per-user admin identity rather than a shared secret.
- **Two secrets, two transports** (`ADMIN_PASSWORD` body/header + `SUPPORT_ADMIN_SECRET` header) for the same trust level — consolidate.
- **`/support` and `/admin/member-access` are duplicate impersonation tools** behind different secrets; the impersonation log still records a static env `admin_email`, so it cannot say who actually pulled a link.
- **No schema validation** (zod) anywhere — all validation is hand-rolled.
- **Rate limiting is per-instance and in-memory** — a speed bump on serverless, not a wall. Durable limiting needs a shared store.
- **No unsubscribe endpoint** for the email lists this site writes to.

## Invariants for any new site route
- **Import auth from `lib/apiAuth.ts`. Never hand-roll a password compare or a token check** — that duplication is exactly what produced these holes.
- Never expose the service-role key to the client; validate at the boundary; `upsert` with `onConflict` (AGENTS.md rule 4).
- **A valid JWT proves authentication, never authorization.** Signup is open, so "somebody is logged in" includes minors and walk-ups. A route acting on club data calls `requireClubOfficer(request, body, clubId)` where `clubId` is derived from the RECORD, not the request body.
- Officer checks key on **presence** in `v_org_current_board` — never a role-code allowlist.
- Public write endpoints validate format AND rate-limit.
- Every check **fails closed**: missing env, missing club, failed lookup ⇒ denied.

## Related docs
`SITE_ARCHITECTURE_PRD.md` · `ADMIN_AND_SUPPORT_TOOLS_PRD.md` · `SIGNUP_AND_REGISTRATION_PRD.md` · app repo `docs/product/SURVEYS_PRD.md` (the app-side survey officer screens) · app repo `docs/product/CLUB_ISOLATION_SECURITY_MODEL_PRD.md` (the app's fail-closed model this site does NOT yet share).
