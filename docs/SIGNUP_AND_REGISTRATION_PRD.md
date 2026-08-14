# Site Signup & Registration Flows — PRD (as-built)

> **Status:** ✅ SHIPPED — documents the live conversion paths on trophycast.app as of 2026-08-14. Previously undocumented: the July site PRD explicitly declared sign-up pages out of scope.
> **Why it matters:** these four endpoints are the app's entire top-of-funnel, they are all unauthenticated by design, and they write real member rows.

## The four paths

| Path | Page | API | Writes | Sends |
|---|---|---|---|---|
| General waitlist | `/` + all feature pages (`WaitlistForm`) | `POST /api/waitlist` | upsert `waitlist_subscribers` on `email` | — |
| DBM club join | `/join` | `POST /api/dbm/subscribe` | Mailchimp list upsert + program tag, then upsert `waitlist_subscribers` | Resend confirmation to the registrant |
| TLO Catch Rate | `/join/tlo` | `POST /api/tlo/register` | upsert `waitlist_subscribers` | Resend ×2 — `TLO_ADMIN_EMAIL` + registrant |
| In-app bug report | (native app, not a site page) | `POST /api/bug-report` | `bug_reports` | Resend to `SUPPORT_ADMIN_EMAIL` |

## Rules that hold today

- **Waitlist is the best-validated route:** regex email check, `joinAs` allow-listed to `club|waitlist`, `clubName` trimmed and capped at 200 chars.
- **DBM programs** are adult / juniors (ages 8–14) / high school, each mapped to a Mailchimp tag (`2026-Print-Flyer*`); the program value is allow-listed via a lookup map with a safe default.
- **TLO species** are allow-listed to `bass|walleye|trout|carp`; the $20-per-species fee is computed client-side for display only — money is collected in person, never by this site.
- **Bug report** is the model to copy: verifies a member JWT, writes the **server-derived** `user.id` (never a client value), rate-limits 1 per 60s per user, regex-validates the screenshot data-URL and caps it at 3.5 MB.
- `/signup` and `/sign-up` both redirect to `/join`. **`/signup` is the URL baked into flyer QR codes** (`lib/flyerSignup.ts`) — do not delete it; deleting `/sign-up` is safe but pointless.

## Known gaps & scars

- ⚠️ `dbm/subscribe` and `tlo/register` **skip email-format validation** that `waitlist` has — a typo'd address silently becomes a dead subscriber row plus a bounced Resend send.
- ⚠️ `tlo/register` interpolates `firstName`, `lastName`, `phone`, and the email **raw into HTML email bodies** — HTML injection into the admin notification. (Ranked MEDIUM-8 in `SITE_SECURITY_MODEL_PRD.md`.)
- ⚠️ **No rate limiting** on any of the three public signup routes — only `bug-report` has it.
- ⚠️ `bug-report` takes client-supplied `memberName`/`memberEmail` and uses them as the Resend `replyTo` — spoofable into the admin inbox.
- 📌 Everything lands in `waitlist_subscribers`, which is also the **audience list for survey blasts and weekly emails** — a signup here means the person can be emailed by those tools. There is no unsubscribe endpoint in this repo.
- 📌 `/join` copy is hardcoded in the page, violating the `lib/content.ts` rule in AGENTS.md.
- 📌 `/flyer/dbm` QR points at `denverbassmasters.com/join-now` (external), not `/join` — intentional per club, worth knowing when tracing conversion.

## Related docs
`SITE_ARCHITECTURE_PRD.md` · `SITE_SECURITY_MODEL_PRD.md` · `FLYER_AND_MARKETING_SOP.md` (the QR targets) · app repo `docs/product/SIGNUP_FLOW.md` (what happens after they get into the app) · app repo `docs/product/GROWTH_AND_COMMUNICATIONS_PRD.md` §9 (the waitlist pipeline's app-side half).
