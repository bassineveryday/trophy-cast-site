# trophy-cast-site — Copilot Reference (Verified Patterns)

_Last updated: May 29, 2026_

Verified, in-code patterns for the marketing/operational site. Treat anything
here as the truth; if the docs disagree, this file wins until the docs are
updated.

---

## Content & copy

- **Single source of truth:** all user-facing copy lives in
  [`lib/content.ts`](../lib/content.ts) on the typed `siteContent` object.
- **Never** hardcode strings in components. If a string isn't in `siteContent`,
  add it to `siteContent` first, then read it from the component.

## Brand assets

- **Logo imports:** always from [`lib/brandAssets.ts`](../lib/brandAssets.ts)
  or [`lib/clubBrandAssets.ts`](../lib/clubBrandAssets.ts).
- **Asset locations on disk:** `public/tc-logos/` (Trophy Cast), `public/screenshots/`.
- **Archive policy:** see [`docs/BRAND_GUIDE.md`](../docs/BRAND_GUIDE.md).

## Styling

- **Color tokens** (defined in [`tailwind.config.ts`](../tailwind.config.ts)):
  `bass`, `trophyGold`, `midnight`, `mist`, `deepPanel`, `copyLight`, `copyMuted`.
- **Fonts** (loaded via `next/font/google`): Montserrat (headings,
  `--font-heading`), Raleway (body, `--font-body`).
- **Surface classes** (in [`app/globals.css`](../app/globals.css)):
  `.section-surface`, `.section-surface-lifted`, `.card-hover`.
- **Section variants:** `default`, `lifted`, `dark`, `gold`. Use the component
  prop, don't invent new variants.
- **Design direction:** dark-first, midnight background (`#0C1A23`), gold accents.

## Layout pattern

- Page structure: `Section` → `Container` → content.
- Pages in `app/`. API routes in `app/api/*/route.ts`.
- **Server components by default.** Only add `"use client"` when the component
  needs browser APIs or React state.

## API routes

- Live in `app/api/*/route.ts` as Next.js Route Handlers.
- **Service role:** `SUPABASE_SERVICE_ROLE_KEY` is server-side only. Never
  read it from a client component.
- **Validation:** every input is validated at the route boundary before any
  Supabase call (e.g., email regex check on waitlist).
- **Idempotent operations:** use `upsert` with `onConflict` for repeat-safe
  writes. See [`app/api/waitlist/route.ts`](../app/api/waitlist/route.ts).

## Env vars

| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Metadata base URL (defaults to `https://trophycast.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (client + server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase writes ONLY |

## Branch rules (site)

- No direct commits to `main` or `dev`.
- Run `npm run branch:status` before committing.
- PRs only. There is **no `session:start` workflow in this repo** — keep
  branches focused and merge them promptly via GitHub PRs.

## What this repo does NOT have

- No Supabase MCP server (that's wired in the app repo only).
- No Expo / React Native code.
- No `npm run branch:guard` / `session:quick` (those are app-only utilities).
- No `useCoach*` / `useDashboard*` hooks — those are app-side.

## Known issues / patterns

(Add entries here as they are discovered.)
