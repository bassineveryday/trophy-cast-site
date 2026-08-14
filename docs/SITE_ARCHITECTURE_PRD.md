# trophycast.app — Site Architecture & Page Map (as-built)

> **Status:** ✅ SHIPPED — documents the site as it stands 2026-08-14. Written during the cross-repo PRD sweep; before this, 16 of 22 pages and all 21 API routes had no doc anywhere.
> **What this repo is:** the Next.js marketing + companion site at trophycast.app. Separate repo from the app (`Trophy-Cast-MVP-v2-1`), separate rules (`AGENTS.md`), same Supabase project.

## The page map — 22 routes

### Marketing (public, no data)
- `/` — the landing page: hero, club-in-a-box, how-it-works, anglers, coach, loop, screenshots, trust, waitlist form. All copy from `lib/content.ts`. **Owned by `SITE_REFRESH_PRD_2026-07.md`** (shipped, PR #19).
- `/anglers` · `/clubs` · `/coach` — feature pages, bullet grids + device-frame screenshots, each ending in a waitlist form.
- `/privacy` · `/terms` — static legal, effective **March 12, 2026**, copy hardcoded in-page.
- `/sms-consent` · `/sms-optin-proof` — A2P/10DLC program disclosure + carrier verification proof (sample messages, HELP/STOP, opt-in methods).

⚠️ **Reachability gap:** the navbar is 8 same-page anchors only. Nothing in the site chrome links to `/anglers`, `/clubs`, `/coach`, `/join`, `/privacy`, or `/terms` — the feature pages are direct-URL only, and the legal pages are unlinked from the footer (footer is a single mailto).

### Signup / conversion
- `/join` — DBM join form (name, email, program: adult / juniors 8–14 / high school), each program carrying a Mailchimp tag. → `POST /api/dbm/subscribe`.
- `/join/tlo` — Tight Line Outdoors Catch Rate registration (name, email, phone, species multi-select, $20/species computed client-side). → `POST /api/tlo/register`.
- `/signup` and `/sign-up` — two 4-line files, both `redirect('/join')`. `/signup` is the one baked into flyer QR codes (`lib/flyerSignup.ts`). Detail: `SIGNUP_AND_REGISTRATION_PRD.md`.

### Member-facing utility
- `/survey/[id]` — public survey response page; anyone with the UUID can read an `active` survey and respond. Detail + the identity hole: `SITE_SECURITY_MODEL_PRD.md`.
- `/support` — internal magic-link tool with **no route protection** (the form asks for the admin secret; the API validates it). Detail: `ADMIN_AND_SUPPORT_TOOLS_PRD.md`.

### Flyers — print/screenshot surfaces, publicly reachable
- `/flyer` + `/flyer/print` · `/flyer/dbm` + `/flyer/dbm/print` — the SOP-compliant pairs (`FLYER_AND_MARKETING_SOP.md`).
- `/flyer/dbm-juniors` — ⚠️ QR points at **`trophy-cast-mvp-v2.vercel.app`** (stale preview host, not prod), hardcodes Tai's name/email/phone, and has no `/print` sibling the SOP mandates.
- `/flyer/catch-rate` — TLO half-sheet; its header comment documents a known gap (`/auth` drops the eventId).

### Admin — 6 pages, client-side password gate
`/admin` (the dashboard, ~2,100 lines) · `/admin/bugs` · `/admin/member-access` · `/admin/survey` · `/admin/survey/[id]/results` · `/admin/weekly-email` (~1,100 lines). All detailed in `ADMIN_AND_SUPPORT_TOOLS_PRD.md`.

## Data this site touches

Every API route instantiates its **own service-role Supabase client inline** (three with `?? 'placeholder'` fallbacks, so a missing env var fails at runtime rather than boot). Tables read or written from the site: `waitlist_subscribers`, `bug_reports`, `profiles`, `user_sessions`, `surveys`, `survey_questions`, `survey_responses`, `support_impersonation_log`, plus read-only analytics over `catches`, `coach_interactions`, `ai_conversations`, `messages`, `conversations`, `announcements`, `tournament_registrations`, `tournament_events`.

External services: **Resend** (all email, from `cast@trophycast.app`), **Mailchimp** (DBM list), **OpenAI** (`gpt-4o-mini` for survey analysis/suggestions and weekly updates), **GitHub API** (weekly updates). No Twilio in this repo.

## Rules & invariants (from `AGENTS.md`, 2026-05-29)

1. All copy lives in `lib/content.ts` — never hardcoded. ⚠️ Deviations: `/privacy`, `/terms`, `/sms-consent`, `/sms-optin-proof`, `/join`, every flyer page, `/admin/weekly-email`.
2. Logo paths only via `lib/brandAssets.ts` / `lib/clubBrandAssets.ts`.
3. Server components by default; API routes are server-only and never expose the service-role key.
4. Only the four existing `Section` variants.
5. Tailwind tokens only, no hardcoded hex. ⚠️ Deviations: all flyer pages + `/sms-optin-proof` define local hex palettes.
6. No commits to `main`/`dev` — `npm run branch:status` first, PRs only.
7. No RN/Expo imports, no app-side hook patterns.

Build/tooling: no CI workflows exist (`.github/` holds only copilot files), no `vercel.json` crons, no cron-invoked scripts. `scripts/` is 7 files — one local git-state guard wired into `predev`, six one-off PNG utilities; **none touch Supabase**.

## Known drift & dead weight

- `README.md` describes a *"static landing page"* whose *"waitlist CTA opens a mailto"* — inaccurate for 22 pages, 21 API routes, and real Supabase writes.
- `WEBSITE_BRIEF.md` (2026-04-08) section order and gold `#D4AF37` are **superseded** by the July PRD (clubs before coach) and the `#C9A646` migration — not marked stale.
- `FLYER_AND_MARKETING_SOP.md` lists only 4 flyers (missing dbm-juniors, catch-rate) and the retired gold.
- `FLYER_COPY.md` (a Feb expo handout) and `LOGO_DEEP_DIVE_HANDOFF.md` (self-declared COMPLETED) are closed-out historical artifacts still filed alongside live references.
- Six `flyer-*.png` screenshot scratch files sit at the repo root.
- `/signup` + `/sign-up` duplicate; `/support` + `/admin/member-access` are the same capability behind two different secrets.

## Related docs
`SITE_SECURITY_MODEL_PRD.md` (⚠️ read this one) · `SIGNUP_AND_REGISTRATION_PRD.md` · `ADMIN_AND_SUPPORT_TOOLS_PRD.md` · `SITE_REFRESH_PRD_2026-07.md` (owns `/`) · `FLYER_AND_MARKETING_SOP.md` · `BRAND_GUIDE.md` · app repo `docs/product/INDEX.md`.
