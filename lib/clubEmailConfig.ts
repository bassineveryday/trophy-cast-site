/**
 * Club-branded email configuration.
 *
 * Every email Trophy Cast sends on behalf of a club must use:
 *   - The club's logo in the email header (above the TC logo)
 *   - The club abbreviation prefixed on the subject line: "DBM | ..."
 *   - The club name in the "from" display name
 *
 * club_name must match the value stored in waitlist_subscribers.club_name
 * so subscriber list filtering works correctly.
 *
 * logoAbsoluteUrl must be an absolute https:// URL that email clients can
 * fetch — relative paths do not work in email HTML bodies.
 *
 * Set logoAbsoluteUrl to null when no logo is available yet; the email
 * template will skip the club logo row gracefully.
 */

import { CLUB_EMAIL_LOGOS } from './clubBrandAssets';

export interface ClubEmailConfig {
  /** Short internal key — matches club_id in surveys table */
  clubId: string;
  /** Must match waitlist_subscribers.club_name exactly */
  clubName: string;
  /** Human-readable display name used in email body text */
  displayName: string;
  /** Short abbreviation — prepended to subject line */
  abbreviation: string;
  /** Pre-formatted subject prefix including separator, e.g. "DBM | " */
  subjectPrefix: string;
  /** Absolute URL for the club logo — or null if not yet uploaded */
  logoAbsoluteUrl: string | null;
  /** "From" display name used in the Resend `from` field */
  fromName: string;
}

export const CLUB_EMAIL_CONFIGS: Record<string, ClubEmailConfig> = {
  DBM: {
    clubId: 'DBM',
    clubName: 'Denver BassMasters',
    displayName: 'Denver BassMasters',
    abbreviation: 'DBM',
    subjectPrefix: 'DBM | ',
    // Keep email on the white-backed export. The transparent master is fine for
    // web/light-background usage, but Gmail can render transparent club logos poorly.
    logoAbsoluteUrl: CLUB_EMAIL_LOGOS.DBM,
    fromName: 'Tai — DBM × Trophy Cast',
  },
  DBMJ: {
    clubId: 'DBMJ',
    clubName: 'DBM Juniors',
    displayName: 'DBM Juniors',
    abbreviation: 'DBMJ',
    subjectPrefix: 'DBMJ | ',
    // URL-encoded filename — matches the file already in /public/
    logoAbsoluteUrl: CLUB_EMAIL_LOGOS.DBMJ,
    fromName: 'Tai — DBM Juniors × Trophy Cast',
  },
  DBMHS: {
    clubId: 'DBMHS',
    clubName: 'DBM High School',
    displayName: 'DBM High School',
    abbreviation: 'DBMHS',
    subjectPrefix: 'DBMHS | ',
    // Shares the Juniors logo until a dedicated one is provided
    logoAbsoluteUrl: CLUB_EMAIL_LOGOS.DBMHS,
    fromName: 'Tai — DBM High School × Trophy Cast',
  },
  TLO: {
    clubId: 'TLO',
    clubName: 'Tightline Outdoors',
    displayName: 'Tightline Outdoors',
    abbreviation: 'TLO',
    subjectPrefix: 'TLO | ',
    // Upload tlo-logo.png to /public/ to activate — gracefully falls back to TC logo
    logoAbsoluteUrl: null,
    fromName: 'Tai — TLO × Trophy Cast',
  },
};

/** Returns the config for the given clubId, or null if not found. */
export function getClubEmailConfig(clubId: string | null | undefined): ClubEmailConfig | null {
  if (!clubId) return null;
  return CLUB_EMAIL_CONFIGS[clubId] ?? null;
}

/** Options array for club selector dropdowns in the admin UI. */
export const CLUB_SELECTOR_OPTIONS: { value: string; label: string }[] = [
  { value: 'DBM', label: 'DBM — Denver BassMasters' },
  { value: 'DBMJ', label: 'DBMJ — DBM Juniors' },
  { value: 'DBMHS', label: 'DBMHS — DBM High School' },
  { value: 'TLO', label: 'TLO — Tightline Outdoors' },
];
