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
}

export const weeklyUpdates: WeeklyUpdate[] = [
  // ─── Most recent week first ──────────────────────────────────────────────
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
