# trophy-cast-site — docs INDEX

> **The front door for this repo's docs.** Built 2026-08-14 during the cross-repo PRD sweep (the app repo finished the same week — its map is `Trophy-Cast-MVP-v2-1/docs/product/INDEX.md`).
> **Rule:** every new build here starts with a PRD in this folder, and the PRD isn't done until it has a line below.

**Status key:** ✅ current · ⚠️ current + carries live warnings · 📖 reference · 📦 superseded (history only)

## 🧭 Start here
- ⚠️ [SITE_SECURITY_MODEL_PRD.md](SITE_SECURITY_MODEL_PRD.md) — how auth actually works here (service-role everywhere, no officer concept) + the ranked backlog of live holes. **Read before touching any API route.**
- ✅ [SITE_ARCHITECTURE_PRD.md](SITE_ARCHITECTURE_PRD.md) — the whole map: 22 pages, 21 API routes, the tables and services this site touches, AGENTS.md rules and where the code deviates.

## 🚪 Flows
- ✅ [SIGNUP_AND_REGISTRATION_PRD.md](SIGNUP_AND_REGISTRATION_PRD.md) — waitlist, DBM join, TLO Catch Rate, bug report: what each writes and sends.
- ⚠️ [ADMIN_AND_SUPPORT_TOOLS_PRD.md](ADMIN_AND_SUPPORT_TOOLS_PRD.md) — the 6 admin pages, the magic-link impersonation tooling, and how "admin" is decided (a shared password, not an identity).

## 🎨 Brand & marketing
- ✅ [BRAND_GUIDE.md](BRAND_GUIDE.md) — canonical logo/brand reference per surface (2026-07-13, the most current brand doc). Color truth lives in the app repo.
- 📖 [FLYER_AND_MARKETING_SOP.md](FLYER_AND_MARKETING_SOP.md) — how flyers are built as Next.js pages, `/flyer/<slug>` + `/flyer/<slug>/print` convention. ⚠️ Stale in two ways: its route table misses `/flyer/dbm-juniors` and `/flyer/catch-rate`, and its gold token `#D4AF37` was replaced by `#C9A646`.

## 📄 Page-specific PRDs
- ✅ [SITE_REFRESH_PRD_2026-07.md](SITE_REFRESH_PRD_2026-07.md) — owns the root `/` page: club-first repositioning, section order, coach copy rules. SHIPPED 2026-07-31 (PR #19).

## 📦 Superseded — history only, do not build from these
- 📦 [WEBSITE_BRIEF.md](WEBSITE_BRIEF.md) — 2026-04-08 site outline. Its section order (coach before clubs) and gold `#D4AF37` were both reversed by SITE_REFRESH_PRD_2026-07.
- 📦 [FLYER_COPY.md](FLYER_COPY.md) — copy options for a March 2026 expo handout; superseded by the live flyer pages.
- 📦 [LOGO_DEEP_DIVE_HANDOFF.md](LOGO_DEEP_DIVE_HANDOFF.md) — self-declared COMPLETED 2026-05-13; BRAND_GUIDE.md is its successor.

## ⬜ Known doc debt
- `README.md` still describes a static landing page with a mailto CTA — inaccurate since this repo grew 22 pages, 21 API routes, and Supabase writes.
- No doc owns `/privacy`, `/terms`, `/sms-consent`, or `/sms-optin-proof` — legal/compliance copy, currently effective-dated March 12 2026. Low risk, but they are the pages a carrier or regulator reads.

## Cross-repo
App PRDs (101 entries, complete coverage as of 2026-08-14): `C:\Projects\Trophy-Cast-MVP-v2-1\docs\product\INDEX.md`. Same Supabase project, different rules — see `AGENTS.md` for the boundary.
