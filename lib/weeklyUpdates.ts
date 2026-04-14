/**
 * Weekly update bullets for Trophy Cast email campaigns.
 *
 * HOW TO UPDATE (AI does this at the end of every session):
 * 1. Add a new entry to the TOP of the `weeklyUpdates` array.
 * 2. Fill in `week`, `bullets` (2–3 lines), `suggestedSubject`, and `suggestedDeepDive`.
 * 3. The admin form at trophycast.app/admin/weekly-email will show the latest entry automatically.
 *
 * Deep Dive options:
 * Dock Talk | Voice Catch Logging | TC Coach | Tournament Dashboard
 * AOY Standings | Trophy Room | Member Directory | Weather & Conditions
 * Video Notes | Board & Officer Tools
 */

export interface WeeklyUpdate {
  /** Display date, e.g. "March 7, 2026" */
  week: string;
  /** 2–3 short bullets. Plain text only — no markdown. */
  bullets: string[];
  suggestedSubject: string;
  suggestedDeepDive: string;
  /**
   * What the Monday meeting will focus on — shown in the email and
   * pre-filled in the admin form. Keep it to one sentence.
   * E.g. "Live demo of TC Coach's inline catch panel"
   */
  suggestedMeetingFocus: string;
  /** Optional metadata for AI-generated idea sets shown in the admin UI. */
  source?: 'static' | 'generated';
  sourceLabel?: string;
  generatedAt?: string;
}

export const weeklyUpdates: WeeklyUpdate[] = [
  // ─── Most recent week first ──────────────────────────────────────────────
  {
    week: 'April 8, 2026',
    suggestedSubject: 'Trophy Cast Weekly 🎣 — April 8 | Norton is THIS Weekend',
    suggestedDeepDive: 'Tournament Dashboard',
    suggestedMeetingFocus: 'Live demo of Card Certification — scan and certify your tournament score card right in the app, with missed fish tracking and over-limit guards built in',
    bullets: [
      'Card Certification is live — scan your weigh-in card at the ramp, the app reads scores, flags missed fish, and locks in results for the TD',
      'Norton is April 11–12 — draw happened at the April 1st meeting. Safe light to 3 PM Saturday, safe light to 2 PM Sunday',
      'Partner notifications added — your partner gets an in-app ping when you submit your score card so everyone stays in sync at the ramp',
    ],
  },
  {
    week: 'April 1, 2026',
    suggestedSubject: 'Trophy Cast Weekly 🎣 — April 1',
    suggestedDeepDive: 'Video Notes',
    suggestedMeetingFocus: 'Show the catch rate dashboard live — TDs can see entry fees collected, Big Fish pot totals, and per-angler stats in real time from the tournament screen',
    bullets: [
      'Big Fish Yearly opt-in is now in the app — sign up for the $20 annual pot right at check-in before your tournament starts',
      'Catch rate dashboard is live for TDs — real-time financial totals, Big Fish pot tracking, and per-angler catch stats all in one place',
      'Video ruler got smarter — AI now picks the sharpest frames from anywhere in your video for more accurate fish length reads',
    ],
  },
  {
    week: 'March 15, 2026',
    suggestedSubject: 'Trophy Cast Weekly 🎣 — March 15',
    suggestedDeepDive: 'TC Coach',
    suggestedMeetingFocus: 'Live walkthrough of TC Coach — we\'ll pull up your real catch history, see your pattern insights, and show how the inline coaching panel works right inside the app',
    bullets: [
      'Weekly email admin now shows a full history of what shipped each week — hit Refresh to reload the latest',
      'Catch photos now stored on Cloudinary for faster loading and better image quality across the app',
      'Tournament visibility controls added — TDs can now control who sees a tournament before it\'s published',
    ],
  },
  {
    week: 'March 7, 2026',
    suggestedSubject: 'Trophy Cast Weekly 🎣 — March 7',
    suggestedDeepDive: 'Dock Talk',
    suggestedMeetingFocus: 'Live walkthrough of Dock Talk — we\'ll set up channels together, send messages, and show how to share catch photos with your crew right from the app',
    bullets: [
      'New members now get a welcome email with Monday meeting info the moment they sign up',
      'TC got smarter — your coaching panel now shows live weather, moon phase, and water conditions right alongside your catch history',
      'Share photos in any chat — tap the camera icon in Dock Talk to send catches, maps, or rigging pics to your crew',
    ],
  },
  // ─── Add new entries above this line ─────────────────────────────────────
];
