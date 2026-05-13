/**
 * Canonical Trophy Cast brand asset paths.
 *
 * Import from here — never hardcode logo paths directly in components.
 * Web-relative paths work with Next.js <Image> and plain <img>.
 * TC_EMAIL_LOGOS provides absolute URLs for email HTML bodies where
 * relative paths do not resolve.
 *
 * Master references:
 *   TC_MASTER_LOGO       — canonical Trophy Cast production mark for most web/product use
 *   TC_MASTER_EMAIL_LOGO — email-safe master with dark background baked in
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

const LOGO_FOLDER = "/tc-logos";
const DOMAIN = 'https://trophycast.app';
const EMAIL_LOGO_VERSION = 'v=6';

export const TC_MASTER_LOGO = `${LOGO_FOLDER}/TrophyCast_FishMark_transparent.png`;
export const TC_MASTER_EMAIL_LOGO = `${DOMAIN}${LOGO_FOLDER}/tc-email-header-solid.png?${EMAIL_LOGO_VERSION}`;

export const TC_LOGOS = {
  /** 48×48 app icon — navbar, small lockups, favicon-adjacent */
  icon48: `${LOGO_FOLDER}/trophy-cast-logo-48.png`,
  /** 256×256 app icon — square placements, sponsor grid, exports */
  icon256: `${LOGO_FOLDER}/trophy-cast-logo-256.png`,
  /** Master Trophy Cast production mark — hero sections, large transparent placements */
  fishMark: TC_MASTER_LOGO,
  /** Wordmark — text-first lockups, print support */
  wordmark: `${LOGO_FOLDER}/TrophyCast_Wordmark_transparent.png`,
  /** Full horizontal lockup — wide headers, sponsor boards, press */
  horizontal: `${LOGO_FOLDER}/TrophyCast_Horizontal_Side_FullColor_transparent.png`,
} as const;

/**
 * Absolute URLs for email HTML bodies.
 * emailHeader is the default primary email header logo.
 * icon48 is available for compact utility placements.
 * The ?v= param busts CDN and Gmail proxy caches after image updates.
 */
export const TC_EMAIL_LOGOS = {
  /** 300×300 email header logo — high-res from FishMark source, dark background baked in. */
  emailHeader: TC_MASTER_EMAIL_LOGO,
  fishMark: `${DOMAIN}${TC_LOGOS.fishMark}?${EMAIL_LOGO_VERSION}`,
  icon48: `${DOMAIN}${TC_LOGOS.icon48}?${EMAIL_LOGO_VERSION}`,
} as const;
