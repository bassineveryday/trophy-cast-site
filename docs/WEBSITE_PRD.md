# Trophy Cast Website — Living PRD

_Owner: the public marketing site at **trophycast.app** (this repo)._
_Created: 2026-09-09 · **Status: ⚠️ current on positioning, voice and feature-truth (§2-§5) — §7 carries open items that are NOT resolved.** This doc is LIVING: it is updated every time a feature ships, and its status stays ⚠️ until §7 is empty or every item is explicitly punted with a reason._

> **Parent authority:** `Trophy-Cast-MVP-v2-1/docs/product/BRAND_AND_VISION_MASTER.md` is the SSOT for
> brand, mission, and audience. This doc does not restate it — it applies it to the website. **If this
> doc and the brand SSOT ever disagree, the SSOT wins and this doc is the bug.**

> **Supersedes** [`SITE_REFRESH_PRD_2026-07.md`](SITE_REFRESH_PRD_2026-07.md) on positioning only.
> That PRD shipped a deliberate *"lead with clubs"* repositioning on 2026-07-31 (PR #19). It was a
> reasonable go-to-market bet — clubs were the provable story — but it put the public site in direct
> conflict with brand SSOT §3, and by 2026-09-09 the site's own SEO title read *"Run Your Fishing Club
> From Your Pocket."* Tai reversed it on 2026-09-09. **Its section-order and copy rules are retired;
> its page inventory and its "no mechanism words" rule remain useful.**

---

## 1. Why this site exists

To make a stranger want to become a better angler with Trophy Cast — and to make an angler who
already loves it able to bring their people in.

It is **not** a product manual, not a club-software brochure, and not a place we explain how the
technology works.

---

## 2. The positioning spine (the one thing to get right)

The order below is the site's argument. Every page, every section, every nav item follows it.

| # | The claim | Why it's first |
|---|---|---|
| **1** | **You get better at bass fishing, and TC Coach is who makes that happen.** It learns how YOU fish and gets smarter every time you go. | This is the product and the moat. Brand SSOT §4: *"The Coach that remembers YOU."* |
| **2** | **You can see yourself getting better.** Your catches become your record — trophies, waters, personal bests. | The proof. Without it, claim 1 is a promise nobody can check. |
| **3** | **You don't fish alone.** Family clubs, a crew of five, a 50-member season. | Brand SSOT §1: *"outside, fishing, and **connected**."* |
| **4** | **Clubs and tournaments run beautifully on it.** | Real, valuable, and genuinely differentiated — but it is the **on-ramp and the proof**, never the identity. |

### ⛔ Hard rules — these are not style preferences

- **Never** describe Trophy Cast as a club-management app, a club OS, a tournament app, or tournament
  software. Brand SSOT §3: *"Not a generic tournament SaaS or club-only management tool. Clubs are
  distribution; the Coach is the product."*
- **Never** put clubs or tournaments in the SEO title, the H1, or nav slot 1.
- **Never** frame the individual angler as the fallback option. (The old hero CTA pair was
  *"Bring your club"* primary and *"**Fish solo?** Join the waitlist"* secondary. That is the exact
  inversion this doc exists to prevent.)
- Clubs **always** get a real section — demoting them is not the goal. Reframing them is.

### 2.1 ⛔ Nobody joins another organization through trophycast.app

**Tai, 2026-09-09:** *"We do not run all these clubs… they're not gonna join a club through Trophy Cast. It's only for Trophy Cast."*

- This site has exactly **one** signup: **Trophy Cast**. `/join` means join Trophy Cast.
- We do **not** host another club's membership form, mailing list, or paid tournament
  registration. We do not publish their guides, their phone numbers, or their entry fees.
- **Deleted 2026-09-09:** `/join/dbm`, `/join/tlo`, `/api/dbm/subscribe`, `/api/tlo/register`,
  and the third-party promo sections on `/clubs`.
- Clubs appear on this site **only** as evidence that real clubs run their season on Trophy Cast —
  never as an audience being recruited to something else.
- ⬜ **Still on the site:** `/flyer/dbm`, `/flyer/dbm/print`, `/flyer/dbm-juniors`,
  `/flyer/catch-rate` — these are print-generation tools, not signup paths. **Tai has not ruled on
  them.** They do not collect anything; they render a flyer to print.

---

## 3. ⛔ The voice rule: we never say "AI"

**Tai, 2026-09-09:** TC Coach is a character people know by name. It *is* an agent — we simply do not
talk about it that way in public. People are frightened of "AI" right now, and the name is the brand.

### Forbidden in any public or member-facing string

`AI` · `artificial intelligence` · `A.I.` · `algorithm` · `machine learning` · `LLM` · `GPT` ·
`chatbot` · `bot` (as a product descriptor) · any model-vendor name.

### Say this instead

| Instead of… | Write… |
|---|---|
| "AI-powered coaching" | "TC Coach" |
| "our AI analyzes your catches" | "TC Coach reads your catches" |
| "the algorithm learns" | "TC Coach learns you" / "it gets smarter every time you fish" |
| "AI-generated summary" | "TC Coach pulls it together" |
| "powered by machine learning" | "it's been trained on real fishing, and on yours" |

**Approved TC Coach verbs:** learns · notices · remembers · reads the water · has been trained ·
gets smarter · pays attention · knows how you fish · is in your corner.

### The two exceptions

1. **The privacy policy's third-party processor list.** Naming the real vendor is a legal
   requirement. It must also name the **correct** one — see §6.
2. **Internal docs, PRDs, and code comments.** Describe the machinery freely. This rule governs what
   a *reader* sees, not what an engineer reads.

**Enforcement:** a grep over `app/ components/ lib/` for the forbidden list must return zero
user-visible hits. Run it before any PR that touches copy.

---

## 4. Page ownership

| Route | Job | Positioning | Owner doc |
|---|---|---|---|
| `/` | Convert a stranger. Runs the §2 spine top to bottom. | Coach-first | **this doc** |
| `/coach` | The deep TC Coach story **and the honesty floor**. | Coach-first | **this doc** |
| `/anglers` | The individual angler's day: log it, see it, chase it. | Angler-growth | **this doc** |
| `/clubs` | Your people — family clubs, a crew, a full club season. | Connection-first | **this doc** |
| `/join` | **Trophy Cast only.** Where every flyer and QR lands. | Coach-first | **this doc** |
| `/privacy`, `/terms`, `/sms-consent`, `/sms-optin-proof` | Legal + carrier compliance. | Neutral | ⬜ **unowned — see §7** |
| `/support` | Staff impersonation tool at a public, guessable URL. | Internal | `ADMIN_AND_SUPPORT_TOOLS_PRD.md` |
| `/flyer/*` | Print + screen flyers. | Per-flyer | `FLYER_AND_MARKETING_SOP.md` |
| `/admin/*` | Officer/staff tools behind a shared password. | Internal | `ADMIN_AND_SUPPORT_TOOLS_PRD.md` |

**Homepage section order (locked 2026-09-09):**
Hero → **TC Coach** → How it works → For anglers → The loop → For clubs → Founding clubs →
Screenshots → Trust → Waitlist.

---

## 5. Feature truth — what the site may claim

**⛔ This table is the whole point of a living PRD. A feature ships → this table updates → the copy
may change. Copy that is not backed by a row here does not go on the site.**

_Verified 2026-09-09 against the app repo._

### ✅ May claim today

| Claim | The honest version | Source |
|---|---|---|
| TC Coach learns you | "learns how YOU fish", "gets smarter every time you go" | `src/domain/coachCatchRecall.ts`, coach PRDs |
| TC Coach talks | Voice conversation, sentence-by-sentence, tap to interrupt. **Web.** | `COACH_VOICE_POLISH_PRD_2026-09.md` |
| Real catch recall | "what did I catch in March" is answered from real rows, not guessed | `src/domain/coachCatchRecall.ts` |
| Bite forecast | "tells you whether today is worth fishing" + one reason + best window | `BITE_FORECAST_PRD_2026-09.md` |
| **19** trophies | 19 winnable from your own fishing | `src/features/trophies/earnableTrophies.ts` |
| Your photo is the trophy | Trophy Room v2 — your own catch photo in the frame | `TROPHY_ROOM_V2_BUILD_LEDGER_2026-09-04.md` |
| One-breath logging | Quick Log sheet; photo, voice, GPS | `LOG_A_FISH_PRD_2026-09.md` |
| GPS names your lake | **when the photo carries GPS** — say "when your photo has location" | `GPS_NAMES_THE_LAKE_PRD_2026-09.md` |
| Live tournament standings | Live weight board on Home during a weight tournament | `LIVE_WEIGHT_BOARD_ADDENDUM_2026-09-06.md` |
| Family clubs | Private, invite-only; shared catches; family trophy case; 52 live | `FAMILY_CLUBS_PRD.md`, `NEXT_STEPS.md` |
| Works in any browser | Web app, no download | — |
| Your spots stay yours | Private by default; sharing takes an explicit tap | `ShareCatchPrompt.tsx` |

### ⛔ DO NOT CLAIM

| Never say | Because |
|---|---|
| "predicts the bite" / "tells you where the fish are" | It's a conditions verdict with a hazard cap. It refuses to speak at low confidence. |
| "**30** trophies" | 19 are winnable. 4 of the 30 have no logic at all. *(The site said 30 until 2026-09-09.)* |
| "it already knows you" | 4 anglers had any learned fact on 2026-09-03. **"It learns you" is true. "It knows you" is not yet.** |
| "follow other anglers" / "share to Instagram" / "public profile" | None exist. Deliberately held. |
| "see your clubmates' catches in a feed" | The community feed is behind a flag that is **off**. |
| "the app celebrates your win" | Nothing on Home reads `trophy_awards` as of 2026-09-09. |
| any price, tier, or "Pro" | Nothing is paid. Tai: no price shown anywhere while in beta. |
| "on the App Store" | Web only. |
| "streaks" | The coaching streak is phone-local and can't award anything. Home shows a **weekly goal**, and that was a deliberate youth-safety choice. |
| "AI photo prefill" | Never built. Ruler reading is tournament-video only. |
| "under-13 accounts" / "the whole family" | Under 13 gets **no account** — 7 restrictive DB policies. |
| money moving through the app | Clubs *track* dues. No processor. |

---

## 6. Known-wrong things this PR fixed (2026-09-09)

| Was | Now |
|---|---|
| SEO title *"Run Your Fishing Club From Your Pocket"* | *"Become a Better Angler"* |
| Hero *"Stop running your club out of a group text and a spreadsheet."* | *"Every cast teaches your coach something."* |
| Nav: clubs slots 1-2, TC Coach slot 5 | TC Coach slot 1; nav links to the real pages |
| `/coach`, `/clubs`, `/anglers` had **zero** inbound links | Linked from nav and footer |
| `/join` **was the Denver BassMasters signup form** — every Trophy Cast path (`/signup`, `/sign-up`, the flyer QR) landed there | `/join` is Trophy Cast and nothing else |
| `/join/tlo` taking registrations + $20/species for a season that ended Aug 19 | **Route deleted** |
| `/join/dbm`, `/api/tlo/register`, `/api/dbm/subscribe` | **Deleted** — see §2.1 |
| `/clubs` was ~60% a third-party guide service's ad — their guides, stats, phone number, entry fees | **Removed** |
| Privacy policy: *"**OpenAI / Anthropic** — powers TC Coach"* | **Google Cloud (Vertex AI)** — the actual vendor. The old line was factually false. |
| "30 trophies" ×3 | 19 |
| DBM logo 404 on `/join` + 2 flyers | Restored from `public/_archive/` |
| `/favicon.ico` + `/apple-touch-icon.png` 404 site-wide | Point at real files in `/tc-logos/` |
| `/coach` shipped internal audit notes as live copy | Angler-facing honesty section |
| Footer = one `mailto:` | Privacy · Terms · SMS consent · the three feature pages |
| "Trophy Cast's **AI** will compile a report" (survey page + survey email + weekly email) | TC Coach voice |
| `/anglers` rendered the same sentence twice | Distinct H1 + supporting line |

---

## 7. Open — needs a decision or a follow-up PR

- ✅ **CLOSED 2026-09-09 — the under-13 collection path.** `/terms` set a 13+ floor while `/join`
  collected a first name, last name and email for a **DBM Juniors, ages 8-14** program. That route was
  deleted the same day (§2.1). **Verified:** the only public forms left on the site are the waitlist
  (club name + email) and the member survey — neither asks for or implies an under-13 user.
- ✅ **CLOSED 2026-09-09 — `/privacy` had NO children's section at all.** Verified by word-boundary
  grep: zero occurrences of `child`, `minor`, `under 13`, `parental`, `guardian`, or `COPPA` in the
  entire policy, on a service whose users include 13-17 year olds. That was a larger exposure than the
  contradiction above. Added **"Children & Anglers Under 18"**, written to match what the app actually
  enforces (`lib/ageRule.ts`, `utils/ageGate.ts`, 7 restrictive DB policies): under 13 gets no account;
  confirmed 13-17 use the full app; unknown age fails closed; minors are excluded from all model
  training; youth surfaces show first names only and never a location; and a parent/guardian route to
  review or delete. `/terms` now cross-links it.
- ✅ **CLOSED 2026-09-09 — accuracy pass on both legal pages.** Tai: *"I do not and cannot afford a
  lawyer right now… I'm asking you to protect me by running the law skills and double checking it."*
  Fixed, in both pages:
  - **A false claim removed.** The privacy policy said *"the legal sections below say the same thing
    in terms **lawyers approved**."* No lawyer has read it. Line rewritten.
  - **Deletion timeline contradicted itself** — "immediately" in two places vs. the real 30-day
    window. Both pages now say: we act on the request as soon as we verify it, deletion completes
    within 30 days.
  - **"We do not transfer your personal data outside the United States"** is not defensible when
    photos are delivered by a global CDN. Rewritten to what is actually true: storage is US, we
    never hand data to anyone for their own use, and some providers serve from an edge near you.
  - **Missing processors added:** Cloudinary (catch photos/video, signed links) and Resend
    (transactional email) — both were live and neither was disclosed.
  - **New section: "How Long We Keep Your Data"** — the policy had no retention terms at all.
  - **New section: "If Something Goes Wrong"** — breach notification, including notifying a
    parent/guardian when a minor's data is involved. Also absent before.
  - **Both dated forward to September 9, 2026.**
- ✅ **CLOSED 2026-09-09 — "Trophy Cast, Inc." is a real registered company.** Confirmed by Tai.
  The name is claimed as the operating legal entity in 15 places (privacy ×2, terms ×7, the waitlist
  email ×4, the club email template ×2); all are accurate. No change needed. Recorded here so this
  does not get re-flagged as a risk by a future audit.
- ⬜ **Still no lawyer.** ⚠️ *Assistant's note, not Tai's instruction:* everything above makes the
  pages accurate to how the system actually behaves, which is the part that gets founders in
  trouble. It is not the same as counsel. When there is budget, the two things worth paying for are
  the Colorado Privacy Act's minor provisions and COPPA's "actual knowledge" standard.
- ✅ **CLOSED 2026-09-09 — the two SMS compliance pages agreed.** `/sms-consent` documented ONE
  opt-in method and a DBM-only audience; `/sms-optin-proof` documented TWO and "any active club".
  `/sms-consent` now carries both methods, worded verbatim from the proof page, and the wider
  audience. Message frequency, STOP/HELP language and the carrier-liability line were NOT touched —
  those are filed with Twilio.
  - ⬜ Still open: `/sms-optin-proof` renders on hardcoded hex outside the design system while
    inheriting the marketing nav, so a carrier reviewer sees two pages that look like two sites.
- ⚠️ **PARTLY CLOSED 2026-09-09 — `/support` is a member-impersonation console at a public,
  guessable URL.** It now returns `noindex, nofollow` (as do all `/admin/*` and `/survey/*`), and
  `robots.txt` disallows them. **That stops search engines; it does not stop a person who guesses the
  URL.** The page still has no server-side auth — the admin secret is only checked by the API it
  calls. Proper fix is a server-side gate on the route itself.
- 🔴 ✅ **FOUND AND REMOVED 2026-09-09 — a live Cloudinary API secret was committed in a PUBLIC repo.**
  Three one-off logo scripts (`fix-eagle-claw.mjs`, `fix-dbm-logos.mjs`, `remove-logo-backgrounds.mjs`)
  hardcoded `CLOUD_NAME`, `API_KEY` and `API_SECRET` as plaintext literals — no `process.env` anywhere.
  `gh repo view` confirms this repo is **PUBLIC**. All three deleted. ⛔ **Deleting them does NOT undo
  the exposure — the secret is still in git history and must be assumed compromised. Tai must rotate
  the Cloudinary API secret.** That is the one item here only he can do.
- ⬜ **No `robots.txt`** — ✅ closed; `app/robots.ts` and `app/sitemap.ts` now build as real routes,
  sitemap lists the 8 public pages only. Link-preview card fixed (solid image, `summary_large_image`,
  `siteName`/`url`), though the image is 300×300 where X wants ~1200×630 — a purpose-built share
  image is the finishing touch.
- 🙋 **OPEN — stale screenshots.** 4 of 12 are from March 2026 and predate the desktop nav rail,
  Trophy Room v2 and the one-form catch flow. **The blocker is not login** — Tai's Chrome is already
  signed into the app. It is a Chrome permission: the Claude extension's site access for
  `trophy-cast-mvp-v2.vercel.app` is off, so every capture returns *"Chrome blocked the extension from
  accessing this page."* Attempted 2026-09-09 and abandoned after repeated failures. Once that site
  access is enabled, this is a ~5 minute job: the app's desktop layout (nav rail, Trophy Room v2,
  bite forecast, one-form catch) looks nothing like the March captures. Cosmetic only.
- ✅ **CLOSED 2026-09-09 — a personal cell number was printed on a flyer aimed at kids' parents.**
  Removed from `/flyer/dbm-juniors`; contact is now the trophycast.app email only. Its QR and printed
  host also moved off the raw `trophy-cast-mvp-v2.vercel.app` preview address to `trophycast.app/join`.
- ✅ **CLOSED 2026-09-09 — every Trophy Cast flyer printed the wrong QR, or fetched one at render
  time.** `/flyer` printed the **Denver BassMasters** QR under "Scan to join Trophy Cast"; `/flyer/print`
  and `/flyer/dbm-juniors` generated theirs live from `api.qrserver.com`, so a print run during an
  outage would ship a blank square. All three now use one committed asset,
  `public/trophycast-join-qr.svg`, generated from `https://trophycast.app/join`.
  **Verified: zero `qrserver` references remain anywhere in the codebase.**

- ✅ **CLOSED 2026-09-09 — dead weight removed:** `components/LogoGrid.tsx` (zero importers),
  ~840 KB of stray flyer PNGs at the repo root, 4 scaffold placeholder SVGs, and a committed
  `desktop.ini`. Also deleted `/flyer/catch-rate` — a flyer for a tournament series that ended
  2026-08-19, for a club we no longer host anything for.

---

## 8. How to keep this doc alive

**When a feature ships in the app repo:**
1. Add or update its row in §5 — the honest one-sentence version plus the source file.
2. If it can't be sourced, it goes in **DO NOT CLAIM** until it can.
3. Only then may site copy mention it.

**When you touch site copy:** re-read §2 and §3. Grep for the forbidden words. If a sentence would let
a stranger call us a tournament app, rewrite it.

**When the positioning itself changes:** that is a founder decision. Record it in the brand SSOT §14
with a date, then update §2 here — never the other way around.
