# trophy-cast-site — Security Model & Backlog (as-built)

> **Status:** ⚠️ AS-BUILT AUDIT, 2026-08-14. This documents how auth works on trophycast.app today and the ranked holes found while writing the doc set. Docs-only — no code changed. The 🔴 items are LIVE on prod.
> **The one structural fact:** every API route in this repo uses the **service-role Supabase key**, so RLS is bypassed on every DB call. There is **no officer/role concept anywhere in the codebase** — nothing reads `profiles.role` or club-officer status. Auth is one of: a shared `ADMIN_PASSWORD`, a shared secret header, "any valid JWT", or nothing.

## How auth works today

- **Public routes** (`/api/waitlist`, `/api/dbm/subscribe`, `/api/tlo/register`, `/api/bug-report`, `/api/surveys/[id]`): unauthenticated by design (public forms) — `bug-report` verifies a member JWT and writes the server-derived `user.id`.
- **Admin routes** (15 under `/api/admin/*`): one shared `ADMIN_PASSWORD`, sent **in the JSON body**, compared with `crypto.timingSafeEqual` (one route drifted to `!==`). No rate limit or lockout on any of them.
- **Support/impersonation** (`/api/support/magic-link`): `SUPPORT_ADMIN_SECRET` in an `x-admin-secret` header, non-constant-time compare.
- **Client admin gate** (`lib/useAdminAuth.ts`): password in `sessionStorage` key `tc_admin_pw`, re-sent per request. No middleware — page shells render for anyone; the API layer is the only real wall.

## Ranked backlog (fix top-down)

### 🔴 CRITICAL — live, unauthenticated or any-JWT
1. **`admin/weekly-updates` POST has NO auth at all** (`app/api/admin/weekly-updates/route.ts:131`) — anyone can drive `gpt-4o-mini` and cause an authenticated GitHub API fetch with `TROPHY_CAST_GITHUB_TOKEN` against the private repo. Attacker-controlled `seenBullets`/`seenSubjects` interpolated into the prompt.
2. **`surveys/[id]/send` accepts ANY valid JWT** (`app/api/admin/surveys/[id]/send/route.ts:56-65`, the `data.user` branch at `:62`) — any signed-in account (incl. a self-registered junior) can activate a draft survey and Resend-blast every `waitlist_subscribers` row for the club. The identical `verifyAuth` is copy-pasted in **`analyze/route.ts:43-52`** (any JWT → paid OpenAI + overwrites `ai_summary`) and **`suggest/route.ts:43-52`** (any JWT → OpenAI proxy). **Fix once:** extract a shared `requireOfficer(token, clubId)` helper into `lib/` — it must do the repo's FIRST role lookup (service-role read of `data.user.id` against the officer source), scoped to `survey.club_id`. Fixing only `send` leaves the other two open.
3. **`surveys` GET is unauthenticated** (`app/api/admin/surveys/route.ts:22-36`) — reads all surveys/drafts/`ai_summary`/`created_by` for any `club_id` from the query string. POST/PATCH on the same file ARE password-gated, so the open GET is an oversight.

### 🟠 HIGH
4. **Public survey POST takes a caller-supplied `respondentId`** (`app/api/surveys/[id]/route.ts:41`) with no identity binding; upsert `onConflict: 'question_id,respondent_id'` (`:87`) lets anyone who knows an id **overwrite** that member's answers. No rate limit / captcha.
5. **`support/magic-link` — account-takeover surface** (`app/api/support/magic-link/route.ts`): non-constant-time secret compare (`:6-9`); `generateLink` issues a live login link for ANY email (`:57`, `:82`); the phone branch **string-interpolates raw user input into a PostgREST `.or()` filter** (`:36`) = filter injection into `profiles`; audit log records a static env `admin_email`, so it doesn't identify the caller.

### 🟡 MEDIUM
6. 14 admin routes share one brute-forceable body password, no rate limit; `admin/polish-bullets:12` uses non-constant-time `!==`.
7. **Permissive CORS** on 5 token-bearing routes: `origin.endsWith('.vercel.app')` reflects any attacker's preview deployment, and `Allow-Headers` includes `Authorization` (`bug-report:10-23` + the 3 survey routes). Combined with the any-JWT holes above, a page on any `*.vercel.app` can drive them.
8. `tlo/register` interpolates `firstName/lastName/phone/email` raw into HTML email bodies (`:80-107`) — HTML injection into the admin inbox. `dbm/subscribe` and `tlo/register` skip email-format validation that `waitlist` has.

### Structural fixes (do once, prevents recurrence)
- Extract the duplicated `checkPassword` (~12 copies, 1 drifted) and `verifyAuth` (3 copies) into `lib/` single sources.
- Introduce the first role/officer lookup helper — every "admin/officer" route should call it, not a shared password.
- Add rate limiting to every unauthenticated and password-gated route.
- Standardize one secret transport (header) and one validation approach (zod) — today there are 3 transports and 11 routes with no validation.

## Invariants for any new site route
- Never expose the service-role key to the client; validate at the boundary; `upsert` with `onConflict` (AGENTS.md rule 4).
- A route that acts on club data must verify the caller is an **officer of that club** — a valid JWT is not authorization.
- Public write endpoints validate format AND rate-limit.

## Related docs
`SITE_ARCHITECTURE_PRD.md` · `ADMIN_AND_SUPPORT_TOOLS_PRD.md` · `SIGNUP_AND_REGISTRATION_PRD.md` · app repo `docs/product/SURVEYS_PRD.md` (the app-side survey officer screens) · app repo `docs/product/CLUB_ISOLATION_SECURITY_MODEL_PRD.md` (the app's fail-closed model this site does NOT yet share).
