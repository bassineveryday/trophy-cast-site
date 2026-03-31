/**
 * Canonical Trophy Cast brand asset paths.
 *
 * Import from here — never hardcode logo paths directly in components.
 * Web-relative paths work with Next.js <Image> and plain <img>.
 * TC_EMAIL_LOGOS provides absolute URLs for email HTML bodies where
 * relative paths do not resolve.
 *
 * Canonical set (see docs/BRAND_GUIDE.md):
 *   icon48      — navbar, small lockups, favicon-adjacent
 *   icon256     — square placements, sponsor grid, app-style exports
 *   fishMark    — hero sections, large transparent placements, email headers
 *   wordmark    — text-first lockups, print support
 *   horizontal  — wide headers, sponsor boards, press
 *
 * ⛔  Do NOT use: Trophy cast white background.png or any *WhiteBG* variant.
 *     Those files are archived for print proof reference only.
 */

const LOGO_FOLDER = "/TC%20Logo%27s";
const DOMAIN = 'https://trophycast.app';

export const TC_LOGOS = {
  /** 48×48 app icon — navbar, small lockups, favicon-adjacent */
  icon48: `${LOGO_FOLDER}/trophy-cast-logo-48.png`,
  /** 256×256 app icon — square placements, sponsor grid, exports */
  icon256: `${LOGO_FOLDER}/trophy-cast-logo-256.png`,
  /** Primary fish mark — hero sections, large transparent placements, email headers */
  fishMark: `${LOGO_FOLDER}/TrophyCast_FishMark_transparent.png`,
  /** Wordmark — text-first lockups, print support */
  wordmark: `${LOGO_FOLDER}/TrophyCast_Wordmark_transparent.png`,
  /** Full horizontal lockup — wide headers, sponsor boards, press */
  horizontal: `${LOGO_FOLDER}/TrophyCast_Horizontal_Side_FullColor_transparent.png`,
} as const;

/**
 * Absolute URLs for email HTML bodies.
 * fishMark is the default primary email header logo.
 * icon48 is available for compact utility placements.
 */
export const TC_EMAIL_LOGOS = {
  fishMark: `${DOMAIN}${TC_LOGOS.fishMark}`,
  icon48: `${DOMAIN}${TC_LOGOS.icon48}`,
} as const;
