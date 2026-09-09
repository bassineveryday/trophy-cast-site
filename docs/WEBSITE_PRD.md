# Trophy Cast Website — Living PRD

_Owner: the public marketing site at **trophycast.app** (this repo)._
_Created: 2026-09-09 · Status: ✅ current · **This doc is LIVING — it is updated every time a feature ships.**_

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
| `/join` | DBM club mailing list. ⚠️ Also the target of every flyer QR. | Club (correct) | `SIGNIN_AND_REGISTRATION_PRD` |
| `/join/tlo` | TLO season registration. **Closed — season ended 2026-08-19.** | Tournament (correct) | `SIGNUP_AND_REGISTRATION_PRD.md` |
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
| `/join/tlo` taking registrations + $20/species for a season that ended Aug 19 | Season-complete state; `SEASON_OPEN = false` |
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

- ⬜ **No doc owns the legal pages.** `/privacy` + `/terms` are effective-dated **March 12, 2026** and
  have drifted: Cloudinary processes catch photos and is not in the third-party list; `/terms` §3 sets
  a 13+ floor while `/join` offers a DBM Juniors option for **ages 8-14**. **Needs Tai + a lawyer's
  eye — not a copy edit.**
- ⬜ **`/sms-consent` vs `/sms-optin-proof` contradict each other** on the number of opt-in methods
  (one vs two) and the audience (DBM only vs any club). A carrier reading both sees two programs.
- ⬜ **`/support` is a member-impersonation console at a public, guessable URL** with no `noindex`.
- ⬜ **Stale screenshots** — 4 of 12 are from March 2026 and predate the desktop rail, Trophy Room v2,
  and the new catch form.
- ⬜ **The DBM Juniors flyer publishes a personal mobile number** and points its QR at the raw
  `trophy-cast-mvp-v2.vercel.app` host.
- ⬜ **`/flyer` prints the DBM QR under a "Scan to join Trophy Cast" label.** `public/trophycast-qr.svg`
  exists and is referenced nowhere.
- ⬜ **No `robots.txt`, no `sitemap.ts`, no OG card.** Nothing stops `/admin` or `/support` indexing.
- ⬜ **Dead weight:** `components/LogoGrid.tsx` (no importers), 8 unused `content.ts` keys, ~840 KB of
  flyer PNGs at the repo root, `desktop.ini` committed.

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
