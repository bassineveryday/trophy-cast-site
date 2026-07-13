# Trophy Cast Brand Guide

_Last updated: July 13, 2026 — colors realigned to the app repo's 2026-07-10/11 brand decisions._

This document is the canonical brand reference for Trophy Cast marketing, website, flyer, and product-adjacent visual work in the site repo. **The app repo (`Trophy-Cast-MVP-v2-1`) is the code source of truth for color values** — see `docs/product/BRAND_AND_VISION_MASTER.md` §13 there (tokens live in `lib/brandConfig.ts` + `lib/colors.ts`). If this doc and that repo ever disagree, the app repo wins; fix this doc to match.

It is grounded in the actual logo assets currently stored in `public/tc-logos/`.

---

## Canonical Owner Modules

Do not hardcode logo paths in components, pages, or email templates. Always import from the canonical owner module that matches the surface:

| Surface                                             | Canonical owner                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| Trophy Cast web/email branding                      | `trophy-cast-site/lib/brandAssets.ts`                              |
| Website club logo surfaces (web, light backgrounds) | `trophy-cast-site/lib/clubBrandAssets.ts`                          |
| Website club email branding (consumes the above)    | `trophy-cast-site/lib/clubEmailConfig.ts`                          |
| Native app local club fallback logos                | `Trophy-Cast-MVP-v2-1/lib/clubLogoSources.ts`                      |
| Supabase email-safe absolute logo URLs              | `Trophy-Cast-MVP-v2-1/supabase/functions/_shared/emailBranding.ts` |

### DBM exception rules

- Clean DBM transparent master is `Trophy-Cast-MVP-v2-1/assets/images/dbm-logo.png`.
- Web/light-background DBM usage resolves through `clubBrandAssets.ts` to `public/dbm-logo-transparent.png`.
- DBM email stays on `public/dbm-logo-white-bg.png` (Gmail breaks transparent DBM marks).
- Trophy Cast email stays on `tc-email-header-solid.png?v=6` via `TC_MASTER_EMAIL_LOGO`.

### Archive locations

- Trophy Cast deprecated variants → `public/tc-logos/_archive/`.
- Site-wide club/legacy binaries → `public/_archive/`.
- Anything in an `_archive/` folder must not be referenced by live code.

---

## Brand Core

**Brand name:** Trophy Cast

**Primary motto:** Where Every Cast Counts.

**Primary positioning line:** Trophy Cast gets smarter the more you fish.

**North Star:**

> Trophy Cast exists to get people outside, fishing, and connected, building confidence and community through a sport they love.

---

## Brand Voice

### We sound like

- confident, not flashy
- modern, but grounded
- fishing-first, not tech-for-tech's-sake
- community-minded, not influencer-driven
- specific and credible, not generic

### Preferred language

- Anglers
- Community
- Your data
- Coach insights
- Trophy Cast
- TC Coach
- Where Every Cast Counts

### Avoid

- Users
- Platform
- Revolutionary
- Generic predictions
- The app
- #1 fishing app

---

## Visual System

### Core colors

_Aligned 2026-07-13 to `tailwind.config.ts` + the app repo's approved dark tokens. The old values (`#D4AF37`/`#0C1A23`/`#F5F1E6`/`#132532`) are superseded — if you find them still in code (e.g. `app/flyer/*`, `app/survey/*` currently hardcode the old gold directly instead of the `trophyGold` token), that's known drift, not the correct value._

| Token       | Hex       | Role                                     |
| ----------- | --------- | ---------------------------------------- |
| Trophy Gold | `#C9A646` | CTA, highlight, brand accent (`trophyGold`) |
| Midnight    | `#0B1A2F` | Primary dark background (`midnight`)     |
| Bass Green  | `#2E6E3D` | Secondary accent (`bass`)                |
| Mist        | `#EAF1F8` | Light surface and readable contrast text (`mist`/`copyLight`) |
| Deep Panel  | `#152B47` | Cards and secondary surfaces (`deepPanel`) |
| Teal        | `#1EBCC8` | Links, info accents                      |

### Typography

| Role     | Font       |
| -------- | ---------- |
| Headings | Montserrat |
| Body     | Raleway    |

### TC Coach cue

- TC Coach is represented by the sparkle mark.
- TC Coach sparkles always render in Trophy Gold.
- Sparkles should not be used as generic decoration when they could imply AI/coaching.

---

## Logo System

All current Trophy Cast logo assets live in `public/tc-logos/`.
Deprecated or process-only variants must stay in `public/tc-logos/_archive/` and must not be referenced by live code.

### Master references

When code needs a single source of truth instead of picking a variant ad hoc:

- `lib/brandAssets.ts` → `TC_MASTER_LOGO` = `/tc-logos/TrophyCast_FishMark_transparent.png`
- `lib/brandAssets.ts` → `TC_MASTER_EMAIL_LOGO` = `https://trophycast.app/tc-logos/tc-email-header-solid.png?v=6`

If a surface needs anything else, that should be an intentional exception.

### Canonical production assets

These are the assets that should anchor all current brand usage.

| Asset             | File                                                                   | Best use                                                                |
| ----------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Primary fish mark | `public/tc-logos/TrophyCast_FishMark_transparent.png`                  | Master brand mark for hero sections, large placements, product identity |
| Primary app icon  | `public/tc-logos/trophy-cast-logo-256.png`                             | App-style square branding, sponsor grid, export graphics                |
| Small icon        | `public/tc-logos/trophy-cast-logo-48.png`                              | Navbar, small lockups, favicon-adjacent usage                           |
| Wordmark          | `public/tc-logos/TrophyCast_Wordmark_transparent.png`                  | Text-only brand lockup, print support, secondary placements             |
| Horizontal lockup | `public/tc-logos/TrophyCast_Horizontal_Side_FullColor_transparent.png` | Wide headers, sponsor boards, footer lockups, press usage               |
| Email-safe master | `public/tc-logos/tc-email-header-solid.png`                            | Inbox/email header usage where transparent rendering is unreliable      |

---

## Logo Usage Rules

### Use the fish mark when

- the brand needs a strong, recognizable symbol
- the space is tall or square
- the logo is acting as the visual hero
- the brand needs to feel bold, modern, and app-native

### Use the square app icon when

- the placement is small
- the layout needs a compact mark
- the usage is product-adjacent, such as nav, avatars, or app-promotional tiles

### Use the fish mark for email headers when

- the email needs the primary Trophy Cast brand symbol
- the header should render on dark or light backgrounds without a white box
- the layout has room for an 80 x 80 transparent mark

### Use the wordmark when

- the logo appears next to other partner marks
- the brand needs clearer readability at medium size
- the fish mark is already present elsewhere on the page

### Use the horizontal lockup when

- the placement is wide and short
- the brand appears in sponsor rows, footers, headers, or media kits
- the layout needs a cleaner press-style lockup than the fish mark alone

---

## Background Rules

- Prefer transparent PNG assets for production use.
- On dark backgrounds, use transparent assets and let the logo colors carry the identity.
- Email is the exception: use the solid-background email export when inbox rendering or proxying can break transparency.
- White-background exports are acceptable for print proofs or internal processing, but they are not the canonical brand assets.
- Do not mix multiple near-identical variants in the same deliverable.

---

## Current Brand Recommendation

For consistency across the website and marketing materials, use this hierarchy:

1. `TrophyCast_FishMark_transparent.png` as the primary hero brand mark
2. `trophy-cast-logo-48.png` for small site chrome like the navbar
3. `trophy-cast-logo-256.png` for square branded placements and sponsor-grid usage
4. `TrophyCast_Wordmark_transparent.png` for print and support lockups
5. `TrophyCast_Horizontal_Side_FullColor_transparent.png` for wide-format branding

Email headers should default to `tc-email-header-solid.png`, the email-safe FishMark export with the dark background baked in.

This gives Trophy Cast one recognizable visual family instead of several competing logo styles.

---

## Email "From" Name Convention

Club emails use `"{ClubDisplayName} via Trophy Cast"` (e.g. `Denver BassMasters via Trophy Cast`) as the Resend `from` display name — set in `lib/clubEmailConfig.ts` here and mirrored in the app repo's `supabase/functions/_shared/emailBranding.ts` (`CLUB_EMAIL_META`). Keep both in sync when adding a club; the app repo's values are live in prod and should be treated as the reference if they ever diverge.

---

## Related Files

- `docs/WEBSITE_BRIEF.md`
- `docs/FLYER_AND_MARKETING_SOP.md`
- `docs/FLYER_COPY.md`
- `lib/content.ts`
- App repo: `Trophy-Cast-MVP-v2-1/docs/product/BRAND_AND_VISION_MASTER.md` §13 (code color/voice SSOT)
- App repo: `Trophy-Cast-MVP-v2-1/.github/copilot-reference.md` §21 (transactional email HTML canon)
