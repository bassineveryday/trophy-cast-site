/**
 * Weekly update bullets for Trophy Cast email campaigns.
 *
 * HOW TO UPDATE (AI does this at the end of every session):
 * 1. Add a new entry to the TOP of the `weeklyUpdates` array.
 * 2. Fill in `week`, `bullets` (2–3 lines), `suggestedSubject`, and `suggestedDeepDive`.
 * 3. The admin form at trophycast.app/admin/weekly-email will show the latest entry automatically.
 *
 * Deep Dive options:
 * Dock Talk | Voice Catch Logging | AI Coaching | Tournament Dashboard
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
   * E.g. "Live demo of the new AI Coach coaching panel"
   */
  suggestedMeetingFocus: string;
}

export const weeklyUpdates: WeeklyUpdate[] = [
  // ─── Most recent week first ──────────────────────────────────────────────
  {
    week: 'March 7, 2026',
    suggestedSubject: 'Trophy Cast Weekly 🎣 — March 7',
    suggestedDeepDive: 'AI Coaching',
    suggestedMeetingFocus: 'Live walkthrough of the new AI Coach — we\'ll look at your real catch history and see what the coach says about your patterns',
    bullets: [
      'New members now get a welcome email with Monday meeting info the moment they sign up',
      'AI Coach got a big upgrade — live score chip tooltips show real pressure, wind, temp, and solunar data',
      'Send photos in any chat — tap the camera icon in Dock Talk to share catches, maps, or rigging pics',
    ],
  },
  // ─── Add new entries above this line ─────────────────────────────────────
];
