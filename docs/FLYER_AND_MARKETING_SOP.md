# Trophy Cast — Flyer & Marketing Materials SOP

_Last updated: March 12, 2026_

This document is the Standard Operating Procedure for designing, building, and deploying promotional flyers and marketing materials for Trophy Cast. Follow this every time so the process is consistent and nothing important gets missed.

**Canonical brand reference:** `docs/BRAND_GUIDE.md`

---

## Overview: How This System Works

All flyers and marketing materials live as **Next.js pages** inside `trophy-cast-site` → the same codebase as `trophycast.app`. When a flyer page is merged to `main`, Vercel auto-deploys it and it's live at a public URL instantly.

**Why This Approach (Not Canva/Figma):**

- Flyers are always up-to-date — change the code, redeploy, done
- Built-in **Download PNG** button (3× resolution) for print/email
- Built-in **Print** button for home printing with correct page margins
- QR codes, sponsor logos, and copy are all version-controlled
- Shareable URLs: hand someone `trophycast.app/flyer/dbm` and they can print it themselves

---

## Flyer Routes (Existing)

| URL                | File                           | Purpose                                                    |
| ------------------ | ------------------------------ | ---------------------------------------------------------- |
| `/flyer`           | `app/flyer/page.tsx`           | Dark/digital full-page flyer (general TC)                  |
| `/flyer/print`     | `app/flyer/print/page.tsx`     | White 2-up print version (letter size, Epson home printer) |
| `/flyer/dbm`       | `app/flyer/dbm/page.tsx`       | Denver BassMasters dark version with club/sponsor branding |
| `/flyer/dbm/print` | `app/flyer/dbm/print/page.tsx` | DBM white 2-up print version                               |

**Naming convention for new flyers:** `/flyer/<slug>` and `/flyer/<slug>/print`

---

## Brand Tokens (Always Use These)

```
midnight (background):  #0C1A23
trophy gold:            #D4AF37
electric teal:          #4FC3F7
bass green:             #2E6E3D
mist (light bg):        #F5F1E6
```

**Official tagline:** "Where Every Cast Counts."
**Body hook line:** "Gets smarter the more you fish."
**App URL:** https://trophycast.app
**General signup URL:** https://eepurl.com/jAjfYY
**CTA:** "Join the Waitlist" / "Early Access" (NOT "Join Free" — app is in beta)

### TC Coach Visual Rule

- Use the sparkle mark to represent TC Coach.
- TC Coach sparkles should always use `trophy gold: #D4AF37`.
- Do not reuse sparkles as a generic decorative icon in marketing layouts.
- If a sparkle is shown in a CTA, badge, or eyebrow, the surrounding pill should use the standard gold treatment: `border-trophyGold/30` + `bg-trophyGold/10` + `text-trophyGold`.

---

## Logo & Image Files

All public images live in `/public`. Always reference them as `/filename.png` in code.

### Trophy Cast Logos

| File                                                             | Use When                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `/tc-logos/TrophyCast_FishMark_transparent.png`                  | Primary hero mark on dark or light layouts                                     |
| `/tc-logos/tc-email-header-solid.png`                            | Email-safe Trophy Cast header mark when inbox rendering can break transparency |
| `/tc-logos/trophy-cast-logo-256.png`                             | Square brand mark for email headers, exports, and app-adjacent placements      |
| `/tc-logos/trophy-cast-logo-48.png`                              | Small nav/favicon-adjacent usage                                               |
| `/tc-logos/TrophyCast_Wordmark_transparent.png`                  | Text-first lockup for print support and secondary placements                   |
| `/tc-logos/TrophyCast_Horizontal_Side_FullColor_transparent.png` | Wide lockup for headers, sponsor rows, and press-style placements              |

**Do not treat these as primary brand assets:** white-background exports, duplicate horizontal variants, or process-only files in `public/tc-logos/`. Use the brand guide to decide what is canonical.

### DBM Club Logos

| File                                                              | Use When                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| `/dbm-logo-transparent.png`                                       | Clean transparent DBM master for web or light-background use       |
| `/dbm-logo-white-bg.png`                                          | Email-safe DBM mark for Gmail and dark-background email placements |
| `/Denver Bassmaster Junior's logo transparent..png`               | DBM Juniors specific                                               |
| `/DBMJ Long Logo (2).jpg`                                         | DBM long horizontal lockup                                         |
| `/Copy of Copy of Copy of DBM Banner logo 800px x 200px  (2).png` | Legacy DBM banner source, not the clean master                     |

**DBM rule:** use `/dbm-logo-transparent.png` for web/light backgrounds and `/dbm-logo-white-bg.png` for email. Always import the path through `lib/clubBrandAssets.ts` (consumed by `lib/clubEmailConfig.ts`); do not hardcode it. Deprecated variants such as `Loge Transparent background.png` and `dbm-logo-email-solid.png` now live in `public/_archive/` and must not be referenced.

### DBM Sponsor Logos

| File                                               | Sponsor                        |
| -------------------------------------------------- | ------------------------------ |
| `/BassproShop.png`                                 | Bass Pro Shops                 |
| `/Eagle Claw logo transparent..png`                | Eagle Claw                     |
| `/Militia Marine logo. Transparent..png`           | Milicia Marine                 |
| `/Discount fishing tackle. Logo. Transparent..png` | Discount Fishing Tackle Denver |
| `/JJ-logo-trim (2).png`                            | JJ Bass Jigs                   |
| `/Topper Sales.png`                                | AA Toppers                     |
| `/Rapala logo transparent..png`                    | Rapala                         |
| `/FRBC Logo.png`                                   | Front Range Bass Club          |
| `/bass-pro-logo-2x.png`                            | Bass Pro (2x variant)          |

> **Tip:** Prefer transparent-background PNGs for logos on colored backgrounds. If a logo has a white box, remove the background using Cloudinary or remove.bg before adding the file to `/public`.

---

## QR Code

Generate QR codes inline — no static image file needed:

```tsx
<img
  src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Feepurl.com%2FjAjfYY&bgcolor=0C1A23&color=D4AF37&margin=4"
  alt="QR Code"
  width={160}
  height={160}
/>
```

For general Trophy Cast acquisition flyers, the QR target and printed signup label should use `eepurl.com/jAjfYY`. Keep `trophycast.app` as the brand website in headers, footers, and support copy unless the flyer specifically needs the email signup destination.

Adjust `&bgcolor=` and `&color=` to match the flyer's background. For white/print flyers:

```
&bgcolor=ffffff&color=0C1A23
```

For print/export-sensitive flyers, prefer a checked-in QR asset in `/public` when the route must render reliably without depending on a remote image service. This avoids broken print previews or PNG exports when a third-party QR URL is blocked or validated strictly.

---

## Download PNG Button (Required on Every Flyer)

Every flyer page must have a **Download PNG** button that exports the flyer as a high-res image.

```tsx
"use client";
import { toPng } from "html-to-image";

const handleDownloadPng = async () => {
  const node = document.getElementById("flyer"); // must match the id on your flyer div
  if (!node) return;
  setDownloading(true);
  try {
    const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true });
    const link = document.createElement("a");
    link.download = "trophy-cast-flyer.png"; // customize filename
    link.href = dataUrl;
    link.click();
  } finally {
    setDownloading(false);
  }
};
```

- `pixelRatio: 3` = 3× resolution (print-ready)
- Always add `id="flyer"` (or `id="print-sheet"` for 2-up) to the top-level flyer div
- Add `'use client'` at top since this uses browser APIs

---

## Print Layout (2-up on Letter Size)

For home printing on standard 8.5×11" letter paper:

```tsx
/* Sheet wrapper */
style={{
  width: '8.5in',
  height: '11in',
  display: 'flex',
  flexDirection: 'column',
  background: '#fff',
}}

/* Each half flyer */
style={{
  height: '5.5in',
  // ... flyer content
}}

/* Divider line */
<div style={{
  borderTop: '1px dashed #ccc',
  textAlign: 'center',
  fontSize: 10,
  color: '#aaa',
  lineHeight: '0'
}}>
  <span style={{ background: '#fff', padding: '0 8px' }}>✂ CUT HERE</span>
</div>
```

Print CSS:

```tsx
<style>{`
  @media print {
    .no-print { display: none !important; }
    body { margin: 0; padding: 0; }
    @page { size: letter portrait; margin: 0.25in; }
  }
`}</style>
```

### ⚠️ Gotcha: `100vh` + flex column breaks print pagination

Found 2026-07-01 in `app/flyer/catch-rate/page.tsx`: the screen preview's outer wrapper used
`minHeight: '100vh'` with `display:'flex', flexDirection:'column'` (a common pattern for
centering the flyer on screen). Under Chrome's print engine, `vh` does not reliably resolve to
one physical page — combined with `overflow: hidden !important` on `html`/`body` (set globally
in `app/globals.css` for print), this pushed the **second half-sheet onto its own separate,
mostly-blank page** instead of stacking directly under the "cut here" line. On screen it looked
completely fine; only the actual print/PDF output was broken.

**Verified 2026-07-06 (real print-PDF render of every flyer route):**

- `app/flyer/dbm-juniors/page.tsx` — **1 clean page, no bug.** It shares the unguarded
  `.page-wrap` pattern, but its `.flyer-card` is pinned to `height: 11in !important` +
  `overflow: hidden !important` in print, which forces exactly one page and can never spill.
  (Trade-off: content taller than 11in would be *clipped* rather than paginated — currently it
  fits, footer and bottom bar included.) Left as-is.
- `app/flyer/catch-rate/page.tsx` — **1 clean page** (the original fix, re-confirmed).
- `app/flyer/page.tsx` (general dark flyer) — **was 3 pages, now 2** (see the flyer-specific
  notes below).

**Fix:** in the page's own `@media print` block, kill the vh/flex dependency entirely for print:

```css
@media print {
  html, body {
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }
  .page-wrap {
    display: block !important;
    min-height: 0 !important;
    height: auto !important;
  }
  /* also strip overflow:hidden from any wrapper div around the sheet(s) */
  .sheet-pair { overflow: visible !important; }
}
```

`app/flyer/dbm/print/page.tsx` already does this correctly (`.print-wrap { display: block !important; }` under `@media print`) — use it as the reference pattern for any new print-enabled flyer.

#### Two more gotchas found while fixing `app/flyer/page.tsx` (2026-07-06)

The general dark flyer printed as **3 pages**. Two extra causes on top of the `100vh`/flex one:

1. **Hide the site chrome, or it prints on its own pages.** The layout
   (`app/layout.tsx`) wraps every route in a sticky `header`/`nav` (Navbar) and a `footer`
   (Footer). `app/flyer/page.tsx`'s print block only hid `.no-print`, so the nav printed on
   page 1 and the site footer on page 3. Every flyer's `@media print` must include
   `header, nav, footer { display: none !important; }` (catch-rate and dbm-juniors already do).

2. **Never put `'`, `<`, or `>` inside a `<style>{`…`}`} child — it breaks hydration.** React's
   SSR HTML-escapes those characters (`'` → `&#x27;`), but the browser parses `<style>` as a
   *rawtext* element and does **not** decode entities, so server and client text differ →
   `Text content does not match server-rendered HTML` and the whole root falls back to client
   rendering. A CSS comment reading "the wrapper's minHeight" was enough to trigger it. Fix:
   inject the CSS with `<style dangerouslySetInnerHTML={{ __html: `…` }} />` (same as
   `app/flyer/dbm/print/page.tsx`), which bypasses React escaping. Screen-preview looks fine; you
   only see it via the dev overlay's red "1 error" badge or a console/CDP check — so **run a
   client-console/hydration check, not just a print-PDF render**, after editing an inline `<style>`.

**Result:** general flyer is now **2 clean pages** with no leaked chrome and clean hydration.
It is not 1 page because the card's real content is ~1.3 letter pages tall — a content/design
matter, not a pagination bug. Its primary use is the **Download PNG** button (one full-height
image, unaffected), so the 2-page PDF is acceptable; forcing 1 page would require trimming
content or a redesign, not a CSS pagination tweak.

**Verify print output for real, not just the screen preview** — the screen render can look
perfect while the print output is broken. Render the actual print PDF and inspect it:

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --no-sandbox \
  --print-to-pdf="C:\path\to\out.pdf" --print-to-pdf-no-header \
  --run-all-compositor-stages-before-draw --virtual-time-budget=10000 \
  "http://localhost:3001/flyer/<slug>"
```

Then render each page to an image to eyeball it (`pip install pymupdf` if not already installed):

```python
import fitz
doc = fitz.open("out.pdf")
print("pages:", len(doc))  # more pages than expected = a pagination bug
for i, page in enumerate(doc):
    page.get_pixmap(dpi=100).save(f"page_{i+1}.png")
```

A flyer meant to be one page that renders as 2+ pages (with blank space) is the tell.

---

## Step-by-Step: Creating a New Flyer

### 1. Create a feature branch

```bash
npm run branch:feature flyer-<event-or-club-name>
# e.g.: npm run branch:feature flyer-bass-pro-april
```

### 2. Create the page file

```
app/flyer/<slug>/page.tsx          ← dark/digital version
app/flyer/<slug>/print/page.tsx    ← white 2-up print version (if needed)
```

### 3. Copy a template

- **Dark/digital:** Copy `app/flyer/dbm/page.tsx` as your starting point
- **Print 2-up:** Copy `app/flyer/dbm/print/page.tsx` as your starting point

### 4. Update copy

Refer to `docs/FLYER_COPY.md` for approved messaging. Key things to update:

- Event name / club name in the header
- Feature bullets (pick 4–6 most relevant)
- Stat chips (relevant to the audience)
- CTA (always "Join the Waitlist" — never "Join Free")
- QR code URL and colors
- Download filename in `handleDownloadPng`

### 5. Add any new logos/images

1. Remove backgrounds first (use remove.bg or Cloudinary background removal)
2. Drop PNG files in `/public/`
3. Reference as `/filename.png` in the `src` attribute
4. Name files clearly: `Sponsor Name logo transparent.png`

### 6. Test locally

```bash
npx next dev -p 3001
# Visit: http://localhost:3001/flyer/<slug>
# Visit: http://localhost:3001/flyer/<slug>/print
```

Check:

- [ ] All logos load (no broken images)
- [ ] QR code renders
- [ ] Download PNG button works — open the downloaded file, verify it looks sharp
- [ ] Print button → **render the actual print PDF and check page count/layout** (see the `100vh` + flex gotcha above) — the on-screen print preview can look correct while the real output is broken
- [ ] No overflow / nothing cut off on mobile viewport

### 7. Commit and push

```bash
git add app/flyer/<slug>/ public/<any-new-images>
git commit -m "feat: <slug> flyer pages"
git push origin feature/flyer-<slug>
```

### 8. Merge to main → Vercel deploys

Open a PR on GitHub: `feature/flyer-<slug>` → `main`

After merge, live at: `https://trophycast.app/flyer/<slug>`

Sync dev branch after merge:

```bash
git checkout dev
git merge main
git push origin dev
```

---

## Printing at Home (Epson ET-2800)

1. Go to `trophycast.app/flyer/<slug>/print` (or `localhost:3001/...`)
2. Click **⬇ Download PNG** → save the PNG file
3. Or click **🖨 Print / Save PDF** then:
   - Margins: Minimum (or None)
   - Scale: 100%
   - Fit to page: Off
4. 1 sheet = 2 half-page flyers → cut along the dashed line
5. Print 15 sheets = 30 flyers

---

## Printing at a Print Shop

For bigger runs (50–200 flyers):

- Use **FedEx Office** or **Staples** (not Office Depot — quality is inconsistent)
- Export the PNG at `pixelRatio: 3` using the Download button
- Request: **Color, Letter, Single-Sided, Cut in half**
- File specs: PNG, 300 DPI equivalent (the 3× export handles this)

---

## Adding a New Club Variant

To create a flyer for a new club (not DBM):

1. Duplicate `app/flyer/dbm/` → `app/flyer/<club-code>/`
2. Replace DBM logo with the club's logo (add to `/public/`)
3. Replace sponsor logos with club's sponsors (or remove the sponsor row)
4. Update colors if the club has its own palette
5. Update QR code destination if the club has a dedicated landing page
6. Route: `/flyer/<club-code>` and `/flyer/<club-code>/print`

---

## Checklist Before Merging

- [ ] `'use client'` at the top of every flyer page
- [ ] `html-to-image` `toPng()` wired to the Download button
- [ ] `id="flyer"` on the top-level card div (matches `document.getElementById` in handler)
- [ ] QR code points to the correct URL
- [ ] CTA says "Join the Waitlist" or "Early Access" — NOT "Join Free"
- [ ] All logo PNGs have transparent backgrounds (no white boxes)
- [ ] Sponsor logos section is accurate (no placeholder sponsors)
- [ ] Print page has `@media print` styles hiding the buttons
- [ ] Download filename is descriptive (`trophy-cast-dbm-flyer.png`, not `flyer.png`)
- [ ] No `console.log` left in the page code
- [ ] Runs `npx next build` without errors

---

## File Quick Reference

```
trophy-cast-site/
├── app/
│   └── flyer/
│       ├── page.tsx              ← general dark flyer
│       ├── print/page.tsx        ← general print 2-up
│       └── dbm/
│           ├── page.tsx          ← DBM dark flyer
│           └── print/page.tsx    ← DBM print 2-up
├── docs/
│   ├── BRAND_GUIDE.md           ← canonical brand reference
│   ├── FLYER_COPY.md             ← approved copy & messaging
│   ├── FLYER_AND_MARKETING_SOP.md (this file)
│   └── WEBSITE_BRIEF.md          ← brand/site brief
└── public/
  ├── tc-logos/                 ← canonical Trophy Cast logo family
  │   └── _archive/             ← deprecated TC variants
  ├── _archive/                 ← deprecated club/legacy binaries (Loge Transparent background.png, dbm-logo-email-solid.png, …)
  ├── dbm-logo-transparent.png  ← canonical DBM web/light-bg master
  ├── dbm-logo-white-bg.png     ← canonical DBM email master
  ├── [sponsor logos...]
  └── [other assets...]
```
