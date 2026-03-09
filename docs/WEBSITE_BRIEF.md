# Trophy Cast – Website Brief
_Last Updated: February 26, 2026_

---

## 🌟 North Star

> **Trophy Cast exists to get people outside, fishing, and connected — building confidence and community through a sport they love, and it gets smarter every time they fish.**

**Tagline:** _"Trophy Cast gets smarter the more you fish."_

---

## 🎯 Who Visits This Website?

| Visitor | What They Want | What We Show Them |
|---------|---------------|-------------------|
| **Angel investor / VC** | Is this real? Is the tech impressive? Is there traction? | Feature depth, real screenshots, club usage, North Star |
| **Club leader / president** | Can this help my club? | Club features, AOY, tournament management, "Club-in-a-Box" |
| **Angler who got a business card** | What is this? Is it cool? | Hero, screenshots, "How it works", waitlist |
| **Potential partner / sponsor** | Is this professional? | Clean design, clear value prop, contact |
| **Curious angler** | What makes Trophy Cast different? | Voice AI catch logging, community focus, not just a fish tracker |

---

## 🏗️ Website Sections (In Order)

| # | Section | Purpose | Key Message |
|---|---------|---------|-------------|
| 1 | **Hero** | First impression – 5 seconds to hook them | "Where Every Cast Counts" + North Star |
| 2 | **Social Proof** | Credibility | "Live with Denver Bassmasters" + member count |
| 3 | **What It Does** | Quick feature overview (3 cards) | Log catches, track seasons, run your club |
| 4 | **How It Works** | Simple 3-step flow | Log → Organize → Reflect |
| 5 | **For Anglers** | Individual value | Voice-first AI logging, trophy room, patterns, weather |
| 6 | **AI Coach** | Differentiator | "Coach insights, not coaching" – honest, personal, private |
| 7 | **For Clubs** | Club leader value | AOY, tournaments, rosters, announcements, treasury |
| 8 | **Club-in-a-Box** | Growth / scale story | Any club can launch on Trophy Cast |
| 9 | **Screenshots** | Show Trophy Cast | 4-6 real screenshots from Trophy Cast |
| 10 | **Trust** | Address concerns | Optional AI, no spot sharing, your data is yours |
| 11 | **Waitlist / CTA** | Convert the visitor | Email signup → "Join the waitlist" |
| 12 | **Footer** | Links, contact, legal | Email, socials (future), motto |

---

## 🎨 Brand Requirements

### Logo
- **Status:** Being redesigned by Tai (Feb 2026)
- **Needed sizes:** 256px (hero), 48px (navbar), favicon (16/32px)
- **Format:** PNG with transparent background
- **Placeholder:** Leave logo spaces visible but with current/temp image

### Colors (Already in Tailwind Config)
| Color | Hex | Use |
|-------|-----|-----|
| Trophy Gold | `#D4AF37` | CTAs, accents, highlights |
| Midnight | `#0C1A23` | Background |
| Bass Green | `#2E6E3D` | Secondary accent |
| Mist | `#F5F1E6` | Body text |
| Deep Panel | `#132532` | Cards, surfaces |

### Typography
| Use | Font | Weight |
|-----|------|--------|
| Headings | Montserrat | 600, 700 |
| Body | Raleway | 400, 500 |

### Tone of Voice
- **Confident but not arrogant** – "We built this with real anglers"
- **Grounded** – No hype, no fake promises
- **Community-first** – Not "tracking fish" but "growing together through fishing"
- **Modern** – Tech-forward but accessible
- **Fishing-forward** – Everything ties back to being on the water

### Words We Use
| ✅ Use | ❌ Avoid |
|--------|---------|
| Anglers | Users |
| Community | Platform |
| Confidence | Accuracy |
| Grounded | Revolutionary |
| Your data | Our data |
| Coach insights | AI predictions |
| Where Every Cast Counts | #1 fishing app |
| Trophy Cast (just the name) | "the app" / "the fishing app" |

---

## 📸 Screenshots Needed (Pick Best 4-6)

| # | Screenshot | What It Shows | Why It Matters |
|---|-----------|--------------|----------------|
| 1 | **Home Dashboard** | Weather strip, streak, trophy carousel | "This is what you see every day" |
| 2 | **Catch Logging (Voice AI)** | Conversational AI helper, photo | "Log with your voice – game changer" |
| 3 | **Tournament List** | Upcoming events with registration | "Your club's tournaments, right here" |
| 4 | **AOY Leaderboard** | Gold/silver/bronze standings | "Live standings, always current" |
| 5 | **Trophy Room** | Achievement plaques, share cards | "Your fishing accomplishments" |
| 6 | **Weather Screen** | Conditions + pressure sparkline | "Know what the fish know" |
| 7 | **Officer Dashboard** | Club pulse, treasury, quick actions | "Run your club from your phone" |
| 8 | **Catch Map** | GPS pins colored by species | "See where you've been" |

**For the website grid (4 slots):** Recommend #1, #2, #4, #5 or #6

**For investor pitch (extra):** Add #7 and #8

---

## 📊 Stats to Highlight (When Available)

| Stat | Where to Show | Current |
|------|--------------|---------|
| Active club | Hero / social proof | Denver Bassmasters |
| Features built | Credibility | 30+ screens, voice AI, weather, tournaments |
| User roles | Depth | 6 role types (member → admin) |
| Tournament features | Club value | Full tournament lifecycle |

---

## 🔗 CTA Strategy

### Primary CTA: "Join the Waitlist"
- Appears in: Hero, mid-page, bottom section, navbar
- Action: Email capture → stores in database (needs Supabase integration)
- Why waitlist (not "Sign Up"): Creates exclusivity, manages growth, collects leads for investors

### Secondary CTA: "See How It Works"
- Scrolls to #how section
- Low commitment action for curious visitors

### Future CTA (Post March 4): "Open Trophy Cast"
- Direct link to Trophy Cast
- Add when ready for open signups

---

## 📱 Design Principles

1. **Mobile-first** – Most visitors will come from a phone (business card → website)
2. **Dark theme** – Matches Trophy Cast, stands out from generic fishing sites
3. **Screenshots sell** – Real screenshots > words
4. **Fast** – Under 3 seconds load time
5. **One page** – No clicking around, scroll down and see everything
6. **Every section has a purpose** – If it doesn't convert, cut it

---

## 🔧 Technical Notes

| Item | Detail |
|------|--------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Content | Single file: `lib/content.ts` |
| Hosting | Vercel (assumed) |
| Domain | trophycast.app |
| Waitlist API | `app/api/waitlist/route.ts` (needs Supabase connection) |
| Images | `public/` folder – optimized via `next/image` |

---

## ✅ Website Update Checklist

### Content Updates (lib/content.ts)
- [ ] Update hero messaging to reflect North Star
- [ ] Update feature descriptions to match real Trophy Cast capabilities
- [ ] Remove "Coming Soon" from screenshots
- [ ] Update "Club-in-a-Box" – remove "Coming" badge or update messaging
- [ ] Tighten midCta and finalCta copy
- [ ] Add social proof stats where possible
- [ ] Ensure tone matches brand voice guide above

### Visual Updates
- [ ] Replace placeholder screenshots with real Trophy Cast screenshots
- [ ] Add new logo (256px hero + 48px navbar)
- [ ] Verify favicon and OG image match new brand
- [ ] Check mobile responsiveness on all sections

### Technical
- [ ] Connect waitlist API to Supabase (store emails)
- [ ] Verify build passes (`npm run build`)
- [ ] Test on Chrome Desktop + Chrome Android + Safari iPhone
- [ ] Deploy to Vercel

### Future
- [ ] Add "Open Trophy Cast" CTA when ready for open signups
- [ ] Add video embed (tutorial videos from VIDEO_SCRIPTS.md)
- [ ] Add social media links to footer
- [ ] Consider testimonials section after launch

---

## 📄 Related Documents

| Document | Location |
|----------|----------|
| Onboarding Plan | `Trophy-Cast-MVP-v2-1/docs/MEMBER_ONBOARDING_PLAN.md` |
| Video Scripts | `Trophy-Cast-MVP-v2-1/docs/VIDEO_SCRIPTS.md` |
| Tech Checklist | `Trophy-Cast-MVP-v2-1/docs/TECH_CHECKLIST.md` |
| Trophy Cast PRD | `Trophy-Cast-MVP-v2-1/docs/product/MASTER_PRD.md` |
