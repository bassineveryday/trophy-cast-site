type LogoRailItem = {
  name: string;
  src: string;
  width: number;
  height: number;
  panel?: "dark" | "light";
};

export const siteContent = {
  brand: {
    name: "Trophy Cast",
    motto: "Log the day. Trust the water.",
    logoText: "TC",
    tagline: "Where Every Cast Counts",
    heroMark: "/TrophyCast_FishMark_transparent.png",
    heroWordmark: "/TrophyCast_Horizontal_Side_FullColor_transparent.png",
  },
  seo: {
    title: "Trophy Cast — Where Every Cast Counts",
    description: "Log your fishing. See patterns. Build confidence. Where Every Cast Counts.",
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
  logoRails: {
    clubs: {
      eyebrow: "Club logos",
      title: "The clubs already shaping the workflow",
      description:
        "These are the downloaded club marks now sitting in the site repo. They are logo assets, not a separate icon package, and they map to the current Trophy Cast club network.",
      items: [
        {
          name: "Trophy Cast",
          src: "/TrophyCast_Horizontal_Side_FullColor_transparent.png",
          width: 220,
          height: 60,
          panel: "dark",
        },
        {
          name: "Denver Bassmasters",
          src: "/Loge%20Transparent%20background.png",
          width: 180,
          height: 72,
          panel: "dark",
        },
        {
          name: "DBM Juniors",
          src: "/Denver%20Bassmaster%20Junior%27s%20logo%20transparent..png",
          width: 150,
          height: 64,
          panel: "dark",
        },
        {
          name: "Front Range Bass Club",
          src: "/FRBC%20Logo.png",
          width: 150,
          height: 64,
          panel: "dark",
        },
        {
          name: "Colorado Bass Nation",
          src: "/CBN.png",
          width: 150,
          height: 64,
          panel: "dark",
        },
        {
          name: "DBM Banner",
          src: "/Copy%20of%20Copy%20of%20Copy%20of%20DBM%20Banner%20logo%20800px%20x%20200px%20%20%282%29.png",
          width: 220,
          height: 56,
          panel: "dark",
        },
      ] satisfies LogoRailItem[],
    },
    sponsors: {
      eyebrow: "Sponsor logos",
      title: "The downloaded sponsor set",
      description:
        "These are the names of the logo files we just added to the website assets. They appear here as a clean sponsor/supporter rail instead of staying buried in public/.",
      items: [
        {
          name: "Bass Pro Shops",
          src: "/bass-pro-logo-2x.png",
          width: 160,
          height: 56,
          panel: "light",
        },
        {
          name: "JJ Bass Jigs",
          src: "/JJ-logo-trim%20%282%29.png",
          width: 120,
          height: 56,
          panel: "light",
        },
        {
          name: "Eagle Claw",
          src: "/Eagle%20Claw%20logo%20transparent..png",
          width: 140,
          height: 56,
          panel: "light",
        },
        {
          name: "Militia Marine",
          src: "/Militia%20Marine%20logo.%20Transparent..png",
          width: 150,
          height: 56,
          panel: "light",
        },
        {
          name: "Rapala",
          src: "/Rapala%20logo%20transparent..png",
          width: 130,
          height: 56,
          panel: "light",
        },
        {
          name: "Topper Sales",
          src: "/Topper%20Sales.png",
          width: 130,
          height: 56,
          panel: "light",
        },
        {
          name: "Discount Fishing Tackle",
          src: "/Discount%20fishing%20tackle.%20Logo.%20Transparent..png",
          width: 150,
          height: 56,
          panel: "light",
        },
      ] satisfies LogoRailItem[],
    },
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
        comingSoon: false,
      },
      {
        src: "/screenshots/placeholder-2.svg",
        alt: "Season stats overview",
        label: "Season stats",
        comingSoon: true,
      },
      {
        src: "/screenshots/placeholder-3.svg",
        alt: "Club AOY board",
        label: "Club dashboard",
        comingSoon: true,
      },
      {
        src: "/screenshots/placeholder-4.svg",
        alt: "Confidence insights",
        label: "Confidence insights",
        comingSoon: true,
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
  midCta: {
    message:
      "Join the Trophy Cast waitlist when you want multi-species logging with the same confidence real clubs rely on.",
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
    tagline: "Where Every Cast Counts",
    aiDisclaimer: "AI is optional and only restructures logs—you steer every insight.",
    links: [{ label: "Email", href: "mailto:hello@trophycast.app" }],
  },
};

export type SiteContent = typeof siteContent;
