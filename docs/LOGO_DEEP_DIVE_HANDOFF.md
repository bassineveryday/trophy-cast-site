# Logo Deep Dive Handoff

_Prepared: May 12, 2026_

Use this in the next chat for the cross-repo logo cleanup pass.

## Goal

Audit every live Trophy Cast and club logo reference across the website repo and the app repo, remove bad/legacy logo usage, and leave one clear source of truth for each brand surface.

## Recommended Model

Use GPT-5.4 for the next chat. This is a cross-repo asset audit with image-quality and rendering edge cases.

## Current Source Of Truth

### Trophy Cast masters

- Web/product master logo: `trophy-cast-site/lib/brandAssets.ts` → `TC_MASTER_LOGO`
- Current value: `/tc-logos/TrophyCast_FishMark_transparent.png`
- Email-safe master logo: `trophy-cast-site/lib/brandAssets.ts` → `TC_MASTER_EMAIL_LOGO`
- Current value: `https://trophycast.app/tc-logos/tc-email-header-solid.png?v=6`

### DBM masters

- Clean transparent DBM master: `Trophy-Cast-MVP-v2-1/assets/images/dbm-logo.png`
- Public site transparent copy: `trophy-cast-site/public/dbm-logo-transparent.png`
- Email-safe DBM copy: `trophy-cast-site/public/dbm-logo-white-bg.png`

## Verified Findings

- The old `trophy-cast-site/public/dbm-logo-transparent.png` was not truly clean transparency. It had checkerboard pixels baked into the file.
- `trophy-cast-site/public/Loge Transparent background.png` is also dirty and should not be treated as a master asset.
- The clean DBM transparent source is the app repo file `Trophy-Cast-MVP-v2-1/assets/images/dbm-logo.png`.
- DBM email should stay on the white-background version because Gmail/email rendering is still the failure-prone case.
- Trophy Cast email should stay on the solid-background email header export, not the plain transparent mark.

## High-Value Files To Audit Next

### Website repo

- `trophy-cast-site/lib/brandAssets.ts`
- `trophy-cast-site/lib/clubEmailConfig.ts`
- `trophy-cast-site/lib/emailTemplate.ts`
- `trophy-cast-site/lib/emails/waitlistConfirmation.ts`
- `trophy-cast-site/app/survey/[id]/page.tsx`
- `trophy-cast-site/app/admin/weekly-email/page.tsx`
- `trophy-cast-site/app/api/admin/preview-email/route.ts`
- `trophy-cast-site/app/api/admin/weekly-email/route.ts`
- `trophy-cast-site/app/api/admin/surveys/[id]/send/route.ts`

### App repo

- `Trophy-Cast-MVP-v2-1/supabase/functions/send-broadcast/index.ts`
- `Trophy-Cast-MVP-v2-1/assets/images/dbm-logo.png`
- Any remaining direct image references outside shared brand config

## Known Cleanup Targets

- Find any direct references to `tc-email-header.png` and decide whether they should move to `TC_MASTER_EMAIL_LOGO`.
- Find any direct references to `dbm-logo-transparent.png` used in email contexts and move them to `dbm-logo-white-bg.png`.
- Find any live references to `Loge Transparent background.png` and replace them with the correct DBM asset.
- Confirm whether `dbm-logo-email-solid.png` is still needed or should be archived.
- Confirm whether any website or app surface still hardcodes logo paths instead of going through shared config.

## Rules For The Next Pass

- Transparent logos are for web and light-background placements.
- Email-safe logos are for inbox/email placements where proxying can break transparency.
- Do not introduce new one-off logo filenames when an existing master already works.
- Prefer shared config exports over hardcoded logo paths.
- Validate on both light and dark backgrounds whenever a logo asset changes.

## Working Tree Notes

- `trophy-cast-site/lib/clubEmailConfig.ts` has a local change pointing DBM email to `dbm-logo-white-bg.png`.
- `trophy-cast-site/public/dbm-logo-transparent.png` has been replaced locally with the clean app master.
- `trophy-cast-site/tsconfig.tsbuildinfo` is modified from local builds.
- `Trophy-Cast-MVP-v2-1` still has unrelated local files that should not be touched during the logo pass.

## Paste-Ready Prompt For The Next Chat

Use GPT-5.4. Audit all Trophy Cast and club logo usage across both workspace repos. Treat `trophy-cast-site/lib/brandAssets.ts` as the Trophy Cast source of truth and `Trophy-Cast-MVP-v2-1/assets/images/dbm-logo.png` as the clean DBM transparent master. Find every live logo reference, separate web/light-background usage from email-safe usage, remove dirty legacy assets from live code paths, and leave one canonical asset path per surface. Do not regress the DBM email fix or the Trophy Cast email-header fix.
