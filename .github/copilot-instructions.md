# trophy-cast-site — AI Assistant Instructions

_Last updated: May 29, 2026_

## Multi-root workspace scope

This repo is opened alongside `c:\Projects\Trophy-Cast-MVP-v2-1` (the main
React Native app). **Apply only this repo's rules to site code.** Do not
inherit app-specific rules (MCP, branch:guard, session:quick, useCoach hooks,
React Native patterns).

For the full hierarchy, read [`AGENTS.md`](../AGENTS.md) in this repo.
For verified site patterns, read [`.github/copilot-reference.md`](copilot-reference.md).

## What This Repo Is

Marketing and operational website for Trophy Cast. Targets anglers, club leaders, investors, and partners. Built on **Next.js 14 App Router + TypeScript + Tailwind CSS**, deployed to Vercel.

## Commands

```bash
npm run dev          # dev server (VS Code task uses port 3002)
npm run build        # production build
npm run lint         # ESLint via next lint
npm run branch:status  # check branch state before committing
```

No test suite. Lint + build are the verification gate.

## Architecture

- **App Router** — all pages live in `app/`. API routes are `app/api/*/route.ts`.
- **Single content source** — all site copy lives in [`lib/content.ts`](../lib/content.ts) as the typed `siteContent` object. Never hardcode copy in components.
- **Logo / brand assets** — always import paths from [`lib/brandAssets.ts`](../lib/brandAssets.ts) or [`lib/clubBrandAssets.ts`](../lib/clubBrandAssets.ts). Never hardcode logo paths. See [`docs/BRAND_GUIDE.md`](../docs/BRAND_GUIDE.md) for asset rules.
- **Layout pattern** — `Section` → `Container` → content. Use the four `Section` surface variants (`default`, `lifted`, `dark`, `gold`) instead of inventing new ones.
- **`"use client"` sparingly** — only add when the component actually needs browser APIs or React state/effects. Default to server components.

## Styling

- Tailwind utility-first. Custom design tokens (colors, fonts, animations) are defined in [`tailwind.config.ts`](../tailwind.config.ts).
- Key color tokens: `bass`, `trophyGold`, `midnight`, `mist`, `deepPanel`, `copyLight`, `copyMuted`.
- Reusable surface classes defined in [`app/globals.css`](../app/globals.css): `.section-surface`, `.section-surface-lifted`, `.card-hover`.
- Dark-first design — midnight (`#0C1A23`) background, gold accents.
- Fonts: **Montserrat** (headings via `--font-heading`), **Raleway** (body via `--font-body`), loaded via `next/font/google`.

## API Routes

- Server-side only. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- Validate all input at the route boundary before writing to Supabase.
- Use `upsert` with `onConflict` for idempotent operations (e.g., waitlist).

## Environment Variables

| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Metadata base URL (defaults to `https://trophycast.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase writes only |

## Branch Rules

Same rules as the main app repo — no direct commits to `main` or `dev`. Use `npm run branch:status` before committing. PRs only.

## Docs

- [`docs/BRAND_GUIDE.md`](../docs/BRAND_GUIDE.md) — logo usage, asset map, color palette, archive policy
- [`docs/WEBSITE_BRIEF.md`](../docs/WEBSITE_BRIEF.md) — audience, section layout spec, messaging goals
- [`docs/FLYER_AND_MARKETING_SOP.md`](../docs/FLYER_AND_MARKETING_SOP.md) — marketing ops SOP

