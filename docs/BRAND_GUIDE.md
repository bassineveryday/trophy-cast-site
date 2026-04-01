# Trophy Cast Brand Guide

_Last updated: March 24, 2026_

This document is the canonical brand reference for Trophy Cast marketing, website, flyer, and product-adjacent visual work in the site repo.

It is grounded in the actual logo assets currently stored in `public/tc-logos/`.

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

| Token       | Hex       | Role                                     |
| ----------- | --------- | ---------------------------------------- |
| Trophy Gold | `#D4AF37` | CTA, highlight, brand accent             |
| Midnight    | `#0C1A23` | Primary dark background                  |
| Bass Green  | `#2E6E3D` | Secondary accent                         |
| Mist        | `#F5F1E6` | Light surface and readable contrast text |
| Deep Panel  | `#132532` | Cards and secondary surfaces             |

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

### Canonical production assets

These are the assets that should anchor all current brand usage.

| Asset             | File                                                                   | Best use                                                      |
| ----------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| Primary fish mark | `public/tc-logos/TrophyCast_FishMark_transparent.png`                  | Hero sections, large placements, primary brand symbol         |
| Primary app icon  | `public/tc-logos/trophy-cast-logo-256.png`                             | App-style square branding, email header mark, export graphics |
| Small icon        | `public/tc-logos/trophy-cast-logo-48.png`                              | Navbar, small lockups, favicon-adjacent usage                 |
| Wordmark          | `public/tc-logos/TrophyCast_Wordmark_transparent.png`                  | Text-only brand lockup, print support, secondary placements   |
| Horizontal lockup | `public/tc-logos/TrophyCast_Horizontal_Side_FullColor_transparent.png` | Wide headers, sponsor boards, footer lockups, press usage     |

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

Email headers should default to the FishMark at 80 x 80 with a transparent background.

This gives Trophy Cast one recognizable visual family instead of several competing logo styles.

---

## Related Files

- `docs/WEBSITE_BRIEF.md`
- `docs/FLYER_AND_MARKETING_SOP.md`
- `docs/FLYER_COPY.md`
- `lib/content.ts`
