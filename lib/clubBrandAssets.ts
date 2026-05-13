/**
 * Canonical club logo paths for website surfaces.
 *
 * DBM web/logo-light placements use the public copy at /dbm-logo-transparent.png,
 * but the clean transparent master lives in the app repo at
 * Trophy-Cast-MVP-v2-1/assets/images/dbm-logo.png.
 *
 * DBM email must stay on the white-background export to avoid Gmail transparency
 * artifacts.
 */

const DOMAIN = 'https://trophycast.app';

export const CLUB_WEB_LOGOS = {
  DBM: '/dbm-logo-transparent.png',
  DBMJ: "/Denver%20Bassmaster%20Junior%27s%20logo%20transparent..png",
  DBMHS: "/Denver%20Bassmaster%20Junior%27s%20logo%20transparent..png",
} as const;

export const CLUB_EMAIL_LOGOS = {
  DBM: `${DOMAIN}/dbm-logo-white-bg.png`,
  DBMJ: `${DOMAIN}${CLUB_WEB_LOGOS.DBMJ}`,
  DBMHS: `${DOMAIN}${CLUB_WEB_LOGOS.DBMHS}`,
} as const;