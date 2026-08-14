# Site Admin & Support Tools — PRD (as-built)

> **Status:** ✅ SHIPPED (with live security gaps) — documents the admin surface on trophycast.app as of 2026-08-14. Nothing described here had a doc before today.
> ⚠️ **These tools read member PII and can issue login links for any account.** Read `SITE_SECURITY_MODEL_PRD.md` alongside this.

## What exists

| Surface | What it does | Data it touches |
|---|---|---|
| `/admin` (~2,100 lines) | The dashboard: recharts graphs over 9 admin APIs — dashboard stats, analytics trends, growth metrics, usage insights, feature analytics, user activity, subscriber count, bug reports, Google Workspace folder IDs | `profiles`, `user_sessions`, `waitlist_subscribers`, `bug_reports`, `catches`, `coach_interactions`, `ai_conversations`, `messages`, `conversations`, `announcements`, `tournament_registrations`, `tournament_events` |
| `/admin/bugs` | Bug triage queue, incl. `member_email`, `member_name`, `device_info`, `club_id`; per-report magic-link generation | `bug_reports`, `profiles` |
| `/admin/member-access` | Generates a Supabase magic link for any member email | `profiles`, writes `support_impersonation_log` |
| `/support` | Same magic-link capability, different secret — **no route protection on the page itself**; 60-second client-side expiry countdown | `profiles`, `support_impersonation_log` |
| `/admin/survey` | Survey CRUD + AI question suggestions + send-blast | `surveys`, `survey_questions`, `waitlist_subscribers` |
| `/admin/survey/[id]/results` | Results view + AI analysis, writes `ai_summary` back | `surveys`, `survey_questions`, `survey_responses` |
| `/admin/weekly-email` (~1,100 lines) | Weekly/promo composer: 6 audience types, deep-dive feature picker, Resend batch send (100/chunk), optional scheduled send | `waitlist_subscribers`, `profiles` |

## How access is decided

- **Client gate** (`lib/useAdminAuth.ts`): the admin password is typed into the page, held in `sessionStorage` under `tc_admin_pw`, and re-sent in each request body. There is **no middleware** — every admin page shell renders for anyone who visits the URL; only the API layer withholds data.
- **Server gate**: 15 `/api/admin/*` routes compare that password against `ADMIN_PASSWORD` with `crypto.timingSafeEqual`. `/api/support/magic-link` uses a separate `SUPPORT_ADMIN_SECRET` in an `x-admin-secret` header.
- **There is no role or officer concept in this repo.** Admin-ness is possession of a shared password, not an identity.

## Rules & invariants

- Magic-link generation is an **impersonation primitive** — treat every use as a security event. Both routes write `support_impersonation_log` on a best-effort basis.
- The weekly-email composer requires a subject, and club-scoped audiences must resolve a configured `clubId` + matching club name before any send — keep those guards.
- Admin pages are client components by necessity; never move a service-role call into one.

## Known gaps & scars

- 🔴 `admin/weekly-updates` POST has **no auth at all** (drives OpenAI + an authenticated GitHub fetch against the private repo).
- 🔴 The survey `send` / `analyze` / `suggest` routes accept **any valid JWT**, not an officer.
- 🟠 `support/magic-link`: non-constant-time secret compare, and the phone lookup **interpolates raw input into a PostgREST filter**.
- 🟡 One shared password across 14 routes, sent in the request **body** (lands in body logging), with **no rate limit or lockout** — brute-forceable at HTTP speed. `admin/polish-bullets` uses a non-constant-time `!==`.
- 🟡 The impersonation log records a **static env `admin_email`**, so it cannot tell you who actually pulled a link.
- 📌 `/support` and `/admin/member-access` are functional duplicates behind two different secrets — consolidate to one.
- 📌 No audit trail exists for the analytics/PII reads at all — only the magic-link routes log anything.

Full ranked fix order (with file:line): `SITE_SECURITY_MODEL_PRD.md`.

## Related docs
`SITE_SECURITY_MODEL_PRD.md` · `SITE_ARCHITECTURE_PRD.md` · app repo `docs/product/PLATFORM_ADMIN_TOOLS_PRD.md` (the in-app admin surface, which DOES have a real `is_platform_admin` flag — the contrast is the point) · app repo `docs/product/SURVEYS_PRD.md`.
