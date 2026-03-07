'use client';

import { useState, useCallback } from 'react';
import { weeklyUpdates } from '@/lib/weeklyUpdates';

const DEEP_DIVE_OPTIONS = [
  'Dock Talk',
  'Voice Catch Logging',
  'AI Coaching',
  'Tournament Dashboard',
  'AOY Standings',
  'Trophy Room',
  'Member Directory',
  'Weather & Conditions',
  'Video Notes',
  'Board & Officer Tools',
] as const;

function getNextSundayLocal(): string {
  const now = new Date();
  const daysUntilSunday = now.getDay() === 0 ? 7 : 7 - now.getDay();
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(18, 0, 0, 0); // 6PM local
  // Format as "YYYY-MM-DDTHH:MM" for datetime-local input
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}T${pad(next.getHours())}:00`;
}

function getDefaultSubject(): string {
  return `Trophy Cast Weekly 🎣 — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
}

export default function WeeklyEmailAdminPage() {
  const latest = weeklyUpdates[0];

  const [password, setPassword] = useState('');
  const [subject, setSubject] = useState(getDefaultSubject);
  const [bullets, setBullets] = useState('');
  const [deepDive, setDeepDive] = useState<string>(DEEP_DIVE_OPTIONS[0]);
  const [deepDiveNote, setDeepDiveNote] = useState('');
  const [meetingFocus, setMeetingFocus] = useState(latest?.suggestedMeetingFocus ?? '');
  const [sendNow, setSendNow] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(getNextSundayLocal);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultMsg, setResultMsg] = useState('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('loading');
      setResultMsg('');

      const bulletList = bullets
        .split('\n')
        .map((b) => b.replace(/^[-•*]\s*/, '').trim())
        .filter(Boolean);

      if (bulletList.length === 0) {
        setStatus('error');
        setResultMsg("Add at least one bullet point in \"What's New\".");
        return;
      }

      // Convert local datetime to ISO UTC string for Mailchimp
      let isoScheduleTime: string | null = null;
      if (!sendNow && scheduleTime) {
        isoScheduleTime = new Date(scheduleTime).toISOString();
      }

      try {
        const res = await fetch('/api/admin/weekly-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password,
            subject,
            bullets: bulletList,
            deepDive,
            deepDiveNote: deepDiveNote.trim() || undefined,
            meetingFocus: meetingFocus.trim() || undefined,
            scheduleTime: isoScheduleTime,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus('error');
          setResultMsg(data.error ?? 'Something went wrong.');
          return;
        }

        setStatus('success');
        const action =
          data.action === 'sent'
            ? 'Campaign sent immediately!'
            : `Campaign scheduled for ${new Date(data.scheduleTime).toLocaleString()}.`;
        setResultMsg(`✅ ${action} Mailchimp ID: ${data.campaignId}`);
      } catch {
        setStatus('error');
        setResultMsg('Network error. Check your connection and try again.');
      }
    },
    [password, subject, bullets, deepDive, deepDiveNote, meetingFocus, sendNow, scheduleTime]
  );

  return (
    <div className="min-h-screen bg-midnight py-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-sm text-electric font-semibold uppercase tracking-widest mb-2">
            Admin
          </p>
          <h1 className="text-3xl font-heading font-bold text-trophyGold mb-2">
            Weekly Email
          </h1>
          <p className="text-copyMuted text-sm">
            Creates and schedules a Mailchimp campaign to all <span className="text-copyLight font-medium">app-user</span> subscribers.
          </p>
        </div>

        {/* ── Ready-to-use bullets ─────────────────────────────────── */}
        {latest && (
          <div className="bg-deepPanel border border-electric/30 rounded-xl p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-electric mb-0.5">
                  This Week&apos;s Updates
                </p>
                <p className="text-copyMuted text-xs">{latest.week}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBullets(latest.bullets.join('\n'));
                  setSubject(latest.suggestedSubject);
                  setDeepDive(latest.suggestedDeepDive);
                  setMeetingFocus(latest.suggestedMeetingFocus ?? '');
                }}
                className="shrink-0 bg-electric/10 hover:bg-electric/20 text-electric text-sm font-bold px-4 py-2 rounded-lg transition-colors duration-150 border border-electric/30"
              >
                Use These →
              </button>
            </div>
            <ul className="space-y-2">
              {latest.bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm text-copyLight">
                  <span className="text-electric shrink-0 mt-0.5">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-copyMuted mb-1">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-deepPanel border border-liftedPanel rounded-lg px-4 py-3 text-copyLight focus:outline-none focus:border-electric placeholder:text-copyMuted/40"
              placeholder="••••••••"
            />
          </div>

          {/* Subject line */}
          <div>
            <label className="block text-sm font-semibold text-copyMuted mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full bg-deepPanel border border-liftedPanel rounded-lg px-4 py-3 text-copyLight focus:outline-none focus:border-electric"
            />
          </div>

          {/* What's New bullets */}
          <div>
            <label className="block text-sm font-semibold text-copyMuted mb-1">
              What&apos;s New{' '}
              <span className="font-normal text-copyMuted/60">— one item per line, 2–3 bullets</span>
            </label>
            <textarea
              value={bullets}
              onChange={(e) => setBullets(e.target.value)}
              required
              rows={4}
              placeholder={
                'New AI coaching feedback on saltwater catches\nTournament results now export to PDF\nBug fix: AOY standings refresh in real time'
              }
              className="w-full bg-deepPanel border border-liftedPanel rounded-lg px-4 py-3 text-copyLight focus:outline-none focus:border-electric placeholder:text-copyMuted/40 resize-none font-body"
            />
          </div>

          {/* Deep Dive topic */}
          <div>
            <label className="block text-sm font-semibold text-copyMuted mb-1">
              Deep Dive Feature Spotlight
            </label>
            <select
              value={deepDive}
              onChange={(e) => setDeepDive(e.target.value)}
              className="w-full bg-deepPanel border border-liftedPanel rounded-lg px-4 py-3 text-copyLight focus:outline-none focus:border-electric"
            >
              {DEEP_DIVE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Deep Dive custom note */}
          <div>
            <label className="block text-sm font-semibold text-copyMuted mb-1">
              Deep Dive Note{' '}
              <span className="font-normal text-copyMuted/60">— optional, overrides the auto blurb</span>
            </label>
            <textarea
              value={deepDiveNote}
              onChange={(e) => setDeepDiveNote(e.target.value)}
              rows={2}
              placeholder="Leave blank to use the pre-written description."
              className="w-full bg-deepPanel border border-liftedPanel rounded-lg px-4 py-3 text-copyLight focus:outline-none focus:border-electric placeholder:text-copyMuted/40 resize-none"
            />
          </div>

          {/* Monday Meeting Focus */}
          <div>
            <label className="block text-sm font-semibold text-copyMuted mb-1">
              Monday Meeting Focus
              <span className="font-normal text-copyMuted/60"> — one sentence: what will you cover live?</span>
            </label>
            <input
              type="text"
              value={meetingFocus}
              onChange={(e) => setMeetingFocus(e.target.value)}
              placeholder="e.g. Live walkthrough of AI Coach with real catch data"
              className="w-full bg-deepPanel border border-liftedPanel rounded-lg px-4 py-3 text-copyLight focus:outline-none focus:border-electric placeholder:text-copyMuted/40"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-liftedPanel" />

          {/* Send Now toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sendNow}
              onChange={(e) => setSendNow(e.target.checked)}
              className="w-5 h-5 rounded accent-electric shrink-0"
            />
            <span className="text-sm font-semibold text-copyLight">
              Send Now{' '}
              <span className="font-normal text-copyMuted">— skip scheduling, send immediately</span>
            </span>
          </label>

          {/* Schedule datetime */}
          {!sendNow && (
            <div>
              <label className="block text-sm font-semibold text-copyMuted mb-1">
                Schedule For{' '}
                <span className="font-normal text-copyMuted/60">— pre-filled: next Sunday 6PM local</span>
              </label>
              <input
                type="datetime-local"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                required={!sendNow}
                className="w-full bg-deepPanel border border-liftedPanel rounded-lg px-4 py-3 text-copyLight focus:outline-none focus:border-electric"
              />
              <p className="text-xs text-copyMuted/60 mt-1">
                Mailchimp requires at least 15 minutes from now. Time will be converted to UTC automatically.
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-bass hover:bg-bassLight text-white font-bold py-4 rounded-xl transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-heading text-lg"
          >
            {status === 'loading'
              ? 'Working…'
              : sendNow
              ? '🚀 Send Campaign Now'
              : '📅 Schedule Campaign'}
          </button>

          {/* Result messages */}
          {status === 'success' && (
            <div className="bg-bass/20 border border-bass rounded-lg p-4 text-sm text-copyLight leading-relaxed">
              {resultMsg}
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-sm text-red-300 leading-relaxed">
              {resultMsg}
            </div>
          )}
        </form>

        {/* Reminder */}
        <div className="mt-12 bg-deepPanel border border-liftedPanel rounded-lg p-4 text-xs text-copyMuted space-y-1">
          <p className="font-semibold text-copyLight">📌 Reminder</p>
          <p>Monday meetings: every Monday 7–8PM MT · <a href="https://meet.google.com/kys-cuub-idb" target="_blank" rel="noopener noreferrer" className="text-electric underline">meet.google.com/kys-cuub-idb</a></p>
          <p>Campaign targets the <strong>app-user</strong> segment. Waitlist-only subscribers are excluded.</p>
          <p>After sending, verify delivery in <a href="https://mailchimp.com" target="_blank" rel="noopener noreferrer" className="text-electric underline">Mailchimp dashboard</a>.</p>
        </div>
      </div>
    </div>
  );
}
