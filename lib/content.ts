export const siteContent = {
  brand: {
    name: "Trophy Cast",
    motto: "Log the day. Trust the water.",
    logoText: "TC",
  },
  waitlist: {
    email: "hello@trophycast.app",
    subject: "Trophy Cast Waitlist",
    body: "I would like to join the Trophy Cast waitlist.",
    primaryCta: "Join the waitlist",
    secondaryCta: "See how it works",
    secondaryHref: "#how",
  },
  nav: [
    { label: "What it does", href: "#what" },
    { label: "How it works", href: "#how" },
    { label: "For anglers", href: "#anglers" },
    { label: "Coach insights", href: "#coach" },
    { label: "For clubs", href: "#clubs" },
    { label: "Club-in-a-Box", href: "#club-in-a-box" },
    { label: "Screenshots", href: "#screenshots" },
    { label: "Trust", href: "#trust" },
  ],
  hero: {
    eyebrow: "Multi-species logging, cleaned up",
    title: "Grounded fishing intelligence from your own log",
    description:
      "Trophy Cast helps anglers capture context-rich catches in real time, keep season stats tight, and share credible updates with their club without hype.",
    highlights: [
      {
        label: "Real clubs",
        value: "Denver Bassmasters is already tracking AOY with Trophy Cast.",
      },
      {
        label: "Optional AI",
        value: "Behind-the-scenes assistance only—no coaching, just tidier logs.",
      },
    ],
    statRibbon: "Built alongside anglers who fish rivers, reservoirs, and everything between.",
  },
  what: {
    id: "what",
    title: "What Trophy Cast does",
    summary:
      "Everything revolves around confident logging: photo + voice capture, contextual weather data, and season stats that you actually trust.",
    items: [
      {
        title: "Catch logging that fits the moment",
        description:
          "Log live on the water with voice or quick photo uploads, or backfill with past shots when the day settles down.",
      },
      {
        title: "Season insights from your observations",
        description:
          "See confidence-first summaries drawn only from your own history—no borrowed spots, no random tips, just your data.",
      },
      {
        title: "Club-ready reporting",
        description:
          "AOY tracking, attendance, and club stats that match how real anglers record contests.",
      },
    ],
  },
  how: {
    id: "how",
    title: "How it works",
    tagline: "Log → organize → reflect",
    steps: [
      {
        title: "Log",
        description:
          "Snap a photo or add a past catch, speak the story, and Trophy Cast tags species, time, and location context for you.",
      },
      {
        title: "Organize",
        description:
          "Optional AI cleans up the voice note so every detail lands in the log without changing your intent.",
      },
      {
        title: "Reflect",
        description:
          "Dashboards highlight what you already noticed—temperature swings, bait families, partners—so you can fish the next day with clarity.",
      },
    ],
  },
  anglers: {
    id: "anglers",
    title: "Built for anglers first",
    description:
      "Cross-species support lets you pivot from bass to walleye to trout without hacking together new templates.",
    bulletPoints: [
      "Photo and voice logging honors the pace of real tournament days.",
      "Profiles show your progression, partners, and confidence cues over the entire season.",
      "Observational insights stay private until you choose to share.",
    ],
  },
  coachInsights: {
    id: "coach",
    title: "Coach insights, not coaching",
    description:
      "We call them coach insights because they keep you honest without trying to predict or promise anything.",
    bullets: [
      "Confidence-first summaries surfaced only from your own entries.",
      "Callouts focus on observation quality, not prescriptive advice.",
      "No strategy scripts, no guaranteed patterns—just clarity on what you actually logged.",
    ],
  },
  clubs: {
    id: "clubs",
    title: "For fishing clubs",
    lead:
      "Denver Bassmasters uses Trophy Cast today to keep AOY standings and event recaps aligned with reality.",
    items: [
      {
        title: "AOY + roster tracking",
        description: "Import members, record events, and keep live AOY points updated instantly.",
      },
      {
        title: "Voice-to-recap",
        description:
          "Optional AI tidies the secretary's voice notes into clean recaps without editorializing.",
      },
      {
        title: "Club transparency",
        description:
          "Share high-level summaries with anglers without ever exposing spots or sensitive info.",
      },
    ],
  },
  clubInABox: {
    id: "club-in-a-box",
    badge: "Coming",
    title: "Club-in-a-Box",
    description:
      "We are packaging onboarding, bylaws templates, scoring sheets, and live leaderboards so new clubs can launch faster—designed with current clubs before release.",
    checklist: [
      "Guided onboarding built from Denver Bassmasters workflows",
      "Configurable divisions for multi-species formats",
      "Sponsor-ready recaps and exportable graphics",
    ],
  },
  screenshots: {
    id: "screenshots",
    title: "Screenshots",
    caption:
      "Expo web app views showing live logging, season stats, and club dashboards. Real UI built with anglers, placeholders shown here for privacy.",
    images: [
      {
        src: "/screenshots/placeholder-1.svg",
        alt: "Catch logging screen",
        label: "Live log capture",
      },
      {
        src: "/screenshots/placeholder-2.svg",
        alt: "Season stats overview",
        label: "Season stats",
      },
      {
        src: "/screenshots/placeholder-3.svg",
        alt: "Club AOY board",
        label: "Club dashboard",
      },
      {
        src: "/screenshots/placeholder-4.svg",
        alt: "Confidence insights",
        label: "Confidence insights",
      },
    ],
  },
  trust: {
    id: "trust",
    title: "Trust + transparency",
    pillars: [
      {
        title: "Optional AI only",
        description:
          "AI cleans up your logging language behind the scenes and never offers strategy or spots.",
      },
      {
        title: "No spot sharing",
        description:
          "Your locations stay yours. Clubs control exactly what shows up in shared recaps.",
      },
      {
        title: "Expo web app today",
        description:
          "Runs as an Expo web app with responsive layouts—no claims of native downloads or offline promises.",
      },
    ],
  },
  finalCta: {
    id: "waitlist",
    title: "Join the Trophy Cast waitlist",
    description:
      "We add new clubs and anglers in waves so feedback lands individually. Hop on the list and we will reach out with timing and access details.",
    message: "Tell us about your club or crew, and we will reply with onboarding steps.",
  },
  footer: {
    motto: "Log the day. Trust the water.",
    aiDisclaimer: "AI is optional and only restructures logs—you steer every insight.",
    links: [{ label: "Email", href: "mailto:hello@trophycast.app" }],
  },
};

export type SiteContent = typeof siteContent;
