# PRD — trophycast.app Site Refresh (2026-07)

_Status: ✅ SHIPPED 2026-07-31 — PR #19 merged, live-verified on trophycast.app._
_Owner: Tai · Author: Claude (Fable), 2026-07-30._
_Research basis: `docs/research/COMPETITIVE_LANDSCAPE_2026-07.md` in the app repo (PR #772) — live sweep of 15+ competitors, 2026-07-30._

---

## 1. Why (the strategy this encodes)

The current site (copy frozen 2026-05-31, screenshots from 2026-03-10) leads with the AI-coach promise and treats beta as a footnote. The research says flip it:

1. **Lead with clubs.** Nobody in the market does full club operations (treasury, minutes, officer dashboards, member management). The club story is provable TODAY (Denver Bassmasters runs their season on us). The officer funnel is also our real funnel: one officer = a whole roster.
2. **Tease the Coach — hide the HOW.** "AI fishing coach" as a phrase is cheapened (Fish AI's scammy "Fish Coach"); "AI-powered" reads gimmick to serious anglers; loud mechanism talk tips off Fishbrain/onWater. The site says the *outcome* only. **Tai's explicit decision 2026-07-30.**
3. **Beta is the invitation, not the apology.** Founding-club / founding-angler curated access with *authentic* scarcity (a solo founder onboards clubs personally, one at a time — literally true). No fake countdowns.
4. **Privacy stays a pillar** — spot-burning is the category's open wound; we're natively against it.
5. **Say the youth/family/community thing publicly** — zero competitors touch it. COPPA-clean framing (about the mission, never about collecting kids' data).

## 2. What changes (scope)

All copy changes land in `lib/content.ts` (the copy SSOT). Component/layout changes only where a new slot is needed (hero badge, two-door CTA block, founding-clubs strip). **No redesign** — brand tokens (`trophyGold #C9A646`, midnight palette, Raleway/Montserrat) stay exactly as-is.

### 2.1 Hero
- **New headline (officer-pain first):** "Stop running your club out of a group text and a spreadsheet." Subhead carries the angler promise: registration, weigh-ins, live standings, and a season your members actually follow — in one app.
- **Beta badge, hero-level:** `FOUNDING CLUBS — 2026 SEASON · PRIVATE BETA` (gold pill). Beta framed as curated access.
- **Two doors (replaces single waitlist CTA):**
  - Primary: **"Bring your club"** → talk-to-the-founder CTA (mailto with club-intake subject; no self-serve form). Officers in this category expect a conversation — and the personal onboarding IS the moat.
  - Secondary: **"Fish solo? Join the founding-angler waitlist"** → existing waitlist flow.
- **DBM as named proof** stays hero-adjacent, upgraded to the winning format: named club + quantified claim. ⚠️ Get a real officer quote with a number from Tai if available ("saves me X hours per tournament"); ship without a fake one — never invent a testimonial.

### 2.2 Section order (clubs before coach)
1. Hero (officer pain + two doors)
2. Club-in-a-box (promoted up; full feature grid — tournaments, AOY, treasury, minutes, officer dashboards, SMS)
3. Founding Clubs strip (beta as status: locked founding pricing language kept soft — "founding terms", direct line to the founder, name on the site)
4. How it works (angler loop — keep)
5. For anglers (keep, trim)
6. **Coach teaser** (see 2.3)
7. Engagement loop (keep, trim to 4 cards)
8. Screenshots (refreshed — see 2.5)
9. Trust + privacy (keep, sharpen the anti-spot-burning line)
10. Final CTA — two doors repeated

### 2.3 Coach teaser (the "hide the HOW" section)
- ONE section. Outcome language only: it pays attention, it remembers, it gets sharper every catch — "the more you fish, the better it knows you."
- **Forbidden on the entire site:** "AI-powered" as a hero/eyebrow claim; any mechanism vocabulary — personas, Memory Room, knowledge packs, RAG, embeddings, Coach Saw It, truth layer; model/vendor names.
- Canonical name **TC Coach** everywhere ("AI coach" appears nowhere).
- Close with the tease: *"Beta members find out first."*

### 2.4 Copy corrections (fact-checked)
- ✅ Knowledge-pack count: **91** (live DB, `coach_knowledge_embeddings`, verified 2026-07-30) — but per 2.3 the pack count likely disappears from public copy entirely; if a stat survives, it must be this one.
- 🐛 Fix the mojibake `�` bullet in `anglers.bulletPoints` (U+FFFD is unrecoverable — re-pick the emoji, 🏆).
- ⚠️ "30 trophies" claim: **verify against the app catalog during build** (not confirmed in this pass); adjust or drop the number.
- Stat ribbon: prune to claims we can defend; drop anything gated off or beta-broken.
- "Thousands of grassroots anglers" claim: soften or make honest for beta scale ("built with real clubs on real water").

### 2.5 Screenshots
- Retake all 6 from the CURRENT prod app (existing set is 2026-03-10, pre coach-first home + UI sweep).
- Source: demo/test account with presentable data — never Tai's personal account, never a minor's data, no real member PII visible.
- Coach screenshots must not reveal mechanism UI (persona picker, Memory Room internals) — show the outcome moment only.
- **Tai approves every screenshot before merge** (they're public).

### 2.6 SEO/meta
- Title/description rewritten to the club-first positioning; keep "Where Every Cast Counts."

## 3. Non-goals
- No redesign, no new pages, no pricing page (pricing PRD is a separate open decision — research gives whitespace: nobody prices whole-club bundles).
- Flyer pages, sign-up/SMS/legal/support pages: untouched.
- No app-repo changes (research doc already landed separately).
- Adjacent problems discovered: report, don't fix.

## 4. Verification gate (definition of done)
1. `npm run build` green in the site repo.
2. Live check on `localhost:3001`: every section renders, both CTAs work, no console errors, no `�` anywhere (`grep -P "�" lib/content.ts` returns nothing).
3. Every factual claim on the page traced to code or live DB (checklist in the PR description).
4. Mechanism-leak sweep: grep built output for forbidden terms (persona, Memory Room, knowledge pack, RAG, AI-powered) — zero hits.
5. Screenshots individually approved by Tai.
6. Vercel preview READY; Tai's explicit yes to merge.

## 5. Open items for Tai (only these)
1. **Approve this PRD** (or edit).
2. Optional: a real DBM officer quote with a number for the proof block (ship without if none).
