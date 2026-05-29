<INSTRUCTIONS>
# trophy-cast-site — Agent Router

_Last updated: May 29, 2026_

This file is the scope boundary for the marketing/operational website repo.
The main app lives at `c:\Projects\Trophy-Cast-MVP-v2-1` and has its own
`AGENTS.md` and `.github/copilot-instructions.md`.

## Scope

**This `AGENTS.md` applies only to `trophy-cast-site` code.**
**Do not apply Trophy-Cast-MVP-v2-1 rules here.**

Differences that matter:
- This repo is **Next.js 14 (App Router) + TypeScript + Tailwind**. The app is
  **React Native + Expo**. Their patterns do not transfer.
- This repo has **no Supabase MCP** wiring. Don't try to run live SQL from
  inside a site task — the tool is on the app side. If you need DB facts for
  the site, write API routes that call Supabase server-side and validate
  inputs at the route boundary.
- This repo has **no `npm run session:start`** workflow. Branch hygiene is
  enforced by `npm run branch:status` and standard GitHub PRs.

## Read order for any new chat in this repo

1. `.github/copilot-instructions.md` — site rules (Next.js, content, brand, API).
2. `.github/copilot-reference.md` — verified site patterns.
3. `docs/BRAND_GUIDE.md`, `docs/WEBSITE_BRIEF.md`, `docs/FLYER_AND_MARKETING_SOP.md`
   as needed.

## Authority order (when sources conflict)

1. User prompt.
2. `.github/copilot-reference.md` (verified site facts).
3. `.github/copilot-instructions.md` (site rules).
4. This file.
5. `docs/` (brand, website, marketing).

## Critical rules

1. **All copy lives in `lib/content.ts`.** Never hardcode strings in
   components.
2. **All logo paths come from `lib/brandAssets.ts` or `lib/clubBrandAssets.ts`.**
   Never hardcode `/public/tc-logos/...`.
3. **Server components by default.** Add `"use client"` only when the
   component needs browser APIs or React state.
4. **API routes are server-side only.** Never expose `SUPABASE_SERVICE_ROLE_KEY`
   to the client. Validate every input at the route boundary. Use `upsert` with
   `onConflict` for idempotent operations like the waitlist.
5. **Section/Container/content layout pattern.** Use the existing four `Section`
   surface variants (`default`, `lifted`, `dark`, `gold`); do not invent new
   ones.
6. **Tailwind design tokens only.** Colors, fonts, animations must use the
   tokens in `tailwind.config.ts` (`bass`, `trophyGold`, `midnight`, `mist`,
   `deepPanel`, `copyLight`, `copyMuted`). No hardcoded hex.
7. **Branch rules.** No commits to `main` or `dev`. Use `npm run branch:status`
   before committing. PRs only.

## What NOT to do here

- Do not import React Native, Expo, or native-platform code.
- Do not assume Supabase MCP is available — it isn't in this repo.
- Do not copy app-side hook patterns (`useDashboard`, `useCoach*`, etc.).
- Do not hardcode copy, colors, fonts, or asset paths.
- Do not add a new `Section` surface variant — extend the existing four.
</INSTRUCTIONS>
