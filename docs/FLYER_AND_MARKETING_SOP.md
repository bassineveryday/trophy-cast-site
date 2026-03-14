# Trophy Cast — Flyer & Marketing Materials SOP

_Last updated: March 12, 2026_

This document is the Standard Operating Procedure for designing, building, and deploying promotional flyers and marketing materials for Trophy Cast. Follow this every time so the process is consistent and nothing important gets missed.

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

| URL | File | Purpose |
|-----|------|---------|
| `/flyer` | `app/flyer/page.tsx` | Dark/digital full-page flyer (general TC) |
| `/flyer/print` | `app/flyer/print/page.tsx` | White 2-up print version (letter size, Epson home printer) |
| `/flyer/dbm` | `app/flyer/dbm/page.tsx` | Denver BassMasters dark version with club/sponsor branding |
| `/flyer/dbm/print` | `app/flyer/dbm/print/page.tsx` | DBM white 2-up print version |

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
**CTA:** "Join the Waitlist" / "Early Access" (NOT "Join Free" — app is in beta)

---

## Logo & Image Files

All public images live in `/public`. Always reference them as `/filename.png` in code.

### Trophy Cast Logos
| File | Use When |
|------|----------|
| `/trophy-cast-logo-256.png` | Base `/flyer` and `/flyer/print` pages |
| `/Trophy cast transparent background..png` | Dark backgrounds (general) |
| `/Trophy cast white background.png` | Light backgrounds |
| `/trophy-cast-logo-48.png` | Small favicon/nav uses |
| `/flood-filled-logo.png` | Stylized alternate mark |

### DBM Club Logos
| File | Use When |
|------|----------|
| `/Loge Transparent background.png` | DBM flyer headers (the Loge/DBM mark) |
| `/dbm-logo-transparent.png` | Alternative DBM mark |
| `/Denver Bassmaster Junior's logo transparent..png` | DBM Juniors specific |
| `/DBMJ Long Logo (2).jpg` | DBM long horizontal lockup |
| `/Copy of Copy of Copy of DBM Banner logo 800px x 200px  (2).png` | DBM banner (800×200) |

### DBM Sponsor Logos
| File | Sponsor |
|------|---------|
| `/BassproShop.png` | Bass Pro Shops |
| `/Eagle Claw logo transparent..png` | Eagle Claw |
| `/Militia Marine logo. Transparent..png` | Milicia Marine |
| `/Discount fishing tackle. Logo. Transparent..png` | Discount Fishing Tackle Denver |
| `/JJ-logo-trim (2).png` | JJ Bass Jigs |
| `/Topper Sales.png` | AA Toppers |
| `/Rapala logo transparent..png` | Rapala |
| `/FRBC Logo.png` | Front Range Bass Club |
| `/bass-pro-logo-2x.png` | Bass Pro (2x variant) |

> **Tip:** Prefer transparent-background PNGs for logos on colored backgrounds. If a logo has a white box, remove the background using Cloudinary or remove.bg before adding the file to `/public`.

---

## QR Code

Generate QR codes inline — no static image file needed:

```tsx
<img
  src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://trophycast.app&bgcolor=0C1A23&color=D4AF37&margin=4"
  alt="QR Code"
  width={160}
  height={160}
/>
```

Adjust `&bgcolor=` and `&color=` to match the flyer's background. For white/print flyers:
```
&bgcolor=ffffff&color=0C1A23
```

For print/export-sensitive flyers, prefer a checked-in QR asset in `/public` when the route must render reliably without depending on a remote image service. This avoids broken print previews or PNG exports when a third-party QR URL is blocked or validated strictly.

---

## Download PNG Button (Required on Every Flyer)

Every flyer page must have a **Download PNG** button that exports the flyer as a high-res image.

```tsx
'use client';
import { toPng } from 'html-to-image';

const handleDownloadPng = async () => {
  const node = document.getElementById('flyer'); // must match the id on your flyer div
  if (!node) return;
  setDownloading(true);
  try {
    const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true });
    const link = document.createElement('a');
    link.download = 'trophy-cast-flyer.png'; // customize filename
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
- [ ] Print button → browser print preview looks correct, fits letter page
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
│   ├── FLYER_COPY.md             ← approved copy & messaging
│   ├── FLYER_AND_MARKETING_SOP.md (this file)
│   └── WEBSITE_BRIEF.md          ← brand/site brief
└── public/
    ├── trophy-cast-logo-256.png  ← main TC logo
    ├── Loge Transparent background.png  ← DBM logo
    ├── [sponsor logos...]
    └── [other assets...]
```
