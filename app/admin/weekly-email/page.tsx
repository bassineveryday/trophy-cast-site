'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { weeklyUpdates } from '@/lib/weeklyUpdates';
import { useAdminAuth } from '@/lib/useAdminAuth';
import { buildEmailHtml } from '@/lib/emailTemplate';

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

// When you pick a Deep Dive feature, Monday's meeting focus auto-fills to match.
// Edit any line here to change the default suggestion for that feature.
const MEETING_FOCUS_BY_FEATURE: Record<string, string> = {
  'Dock Talk': "Live walkthrough of Dock Talk — set up channels, send messages, and share catch photos with your crew",
  'Voice Catch Logging': "Live demo of Voice Catch Logging — log a fish hands-free with just your voice, no typing needed",
  'AI Coaching': "Live walkthrough of TC coaching — review your real catch history and see your pattern insights",
  'Tournament Dashboard': "Live demo of the Tournament Dashboard — draw pairings, enter weights, and post results in real time",
  'AOY Standings': "Live look at AOY Standings — see how the leaderboard updates automatically after every tournament",
  'Trophy Room': "Tour of your Trophy Room — your best fish, season highlights, and personal stats all in one place",
  'Member Directory': "Browse the Member Directory together — find club members, see profiles, and connect",
  'Weather & Conditions': "Live look at Weather & Conditions — check the lake forecast and moon phase before your next tournament",
  'Video Notes': "Live demo of Video Notes — record a quick tip about a technique or spot right inside TC",
  'Board & Officer Tools': "Live walkthrough of Board Tools — agenda builder, meeting notes, and member management for officers",
};

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

  // Auth gate
  const { password, unlocked, authError, unlock, lockOut } = useAdminAuth();
  const [pwInput, setPwInput] = useState('');

  // AI polish
  const [roughNotes, setRoughNotes] = useState('');
  const [polishing, setPolishing] = useState(false);
  const [polishError, setPolishError] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Campaign fields
  const [subject, setSubject] = useState(getDefaultSubject);
  const [bullets, setBullets] = useState('');
  const [deepDive, setDeepDive] = useState<string>(DEEP_DIVE_OPTIONS[0]);
  const [deepDiveNote, setDeepDiveNote] = useState('');
  const [meetingFocus, setMeetingFocus] = useState(latest?.suggestedMeetingFocus ?? '');
  const [sendNow, setSendNow] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(getNextSundayLocal);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultMsg, setResultMsg] = useState('');

  // Subscriber count (fetched after unlock)
  const [subCount, setSubCount] = useState<number | null>(null);

  // Send-now confirmation modal
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleUnlock = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!pwInput.trim()) return;
    unlock(pwInput);
  }, [pwInput, unlock]);

  // Fetch subscriber count once after unlock
  useEffect(() => {
    if (!unlocked || !password) return;
    fetch('/api/admin/subscriber-count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then((r) => r.json())
      .then((d) => setSubCount(d.count ?? null))
      .catch(() => {});
  }, [unlocked, password]);

  const toggleVoice = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported here. Try Chrome.'); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    recognitionRef.current = rec;
    let finalTranscript = roughNotes;
    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTranscript += (finalTranscript ? ' ' : '') + t;
        else interim = t;
      }
      setRoughNotes(finalTranscript + (interim ? ' ' + interim : ''));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
  }, [listening, roughNotes]);

  const handlePolish = useCallback(async () => {
    if (!roughNotes.trim()) return;
    setPolishing(true);
    setPolishError('');
    try {
      const res = await fetch('/api/admin/polish-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, roughNotes }),
      });
      const data = await res.json();
      if (!res.ok) { setPolishError(data.error ?? 'Polish failed.'); return; }
      setBullets(data.bullets.join('\n'));
      setRoughNotes('');
    } catch {
      setPolishError('Network error. Try again.');
    } finally {
      setPolishing(false);
    }
  }, [roughNotes, password]);

  // The actual API call — called either directly (scheduled) or from confirm modal (send now)
  const executeSend = useCallback(async () => {
    setConfirmOpen(false);
    setStatus('loading');
    setResultMsg('');

    const bulletList = bullets
      .split('\n')
      .map((b) => b.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean);

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
        if (res.status === 401) { lockOut(); }
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
  }, [password, subject, bullets, deepDive, deepDiveNote, meetingFocus, sendNow, scheduleTime, lockOut]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const bulletList = bullets
        .split('\n')
        .map((b) => b.replace(/^[-•*]\s*/, '').trim())
        .filter(Boolean);

      if (bulletList.length === 0) {
        setStatus('error');
        setResultMsg("Add at least one bullet point in \"What's New\".");
        return;
      }

      // Send Now requires an extra confirmation step
      if (sendNow) {
        setConfirmOpen(true);
        return;
      }

      void executeSend();
    },
    [bullets, sendNow, executeSend]
  );

  const previewBullets = useMemo(
    () =>
      bullets
        .split('\n')
        .map((b) => b.replace(/^[-•*]\s*/, '').trim())
        .filter(Boolean),
    [bullets]
  );

  const previewHtml = useMemo(
    () =>
      buildEmailHtml({
        subject,
        bullets: previewBullets.length
          ? previewBullets
          : ['(Start typing bullets above to see them here…)'],
        deepDive,
        deepDiveNote,
        meetingFocus,
      }),
    [subject, previewBullets, deepDive, deepDiveNote, meetingFocus]
  );

  // ── Password gate ────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-5xl mb-4">🏆</p>
            <h1 className="text-3xl font-heading font-bold text-trophyGold">Weekly Email Admin</h1>
            <p className="text-copyMuted mt-2">Enter your password to continue</p>
          </div>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              autoFocus
              placeholder="Admin password"
              className="w-full bg-deepPanel border border-liftedPanel rounded-xl px-5 py-4 text-copyLight text-lg focus:outline-none focus:border-electric placeholder:text-copyMuted/40"
            />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button type="submit" className="w-full bg-bass hover:bg-bassLight text-white font-bold py-4 rounded-xl font-heading text-lg transition-colors">
              Unlock →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────
  return (
    <>
    <div className="h-screen flex flex-col bg-midnight overflow-hidden">
      {/* Top bar */}
      <div className="border-b border-liftedPanel bg-deeperPanel px-6 py-3.5 flex items-center justify-between shrink-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-electric mb-0.5">
            <Link href="/admin" className="hover:text-copyLight transition-colors">Admin</Link>
            {' / Weekly Email'}
          </p>
          <h1 className="text-xl font-heading font-bold text-trophyGold leading-tight">Weekly Email</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-copyMuted text-sm hidden md:block">
            {subCount === null
              ? <span className="text-copyMuted/50">loading…</span>
              : <><span className="text-trophyGold font-bold">{subCount.toLocaleString()}</span>{' '}subscribers</>}
          </p>
          <button
            form="email-form"
            type="submit"
            disabled={status === 'loading'}
            className="bg-bass hover:bg-bassLight text-white font-bold py-2.5 px-6 rounded-xl transition-colors disabled:opacity-50 font-heading text-sm"
          >
            {status === 'loading' ? 'Working…' : sendNow ? '🚀 Send Now' : '📅 Schedule'}
          </button>
        </div>
      </div>

      {/* ── Split pane ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Editor panel ── */}
        <form
          id="email-form"
          onSubmit={handleSubmit}
          className="w-[440px] shrink-0 border-r border-liftedPanel overflow-y-auto bg-deeperPanel"
        >
          <div className="p-5 space-y-5 pb-10">

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-copyMuted mb-2">Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
              />
            </div>

            {/* What's New */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-copyMuted mb-2">
                What&apos;s New <span className="normal-case font-normal text-copyMuted/60">— one item per line</span>
              </label>
              <textarea
                value={bullets}
                onChange={(e) => setBullets(e.target.value)}
                required
                rows={5}
                placeholder="New members now get a welcome email&#10;AI coaching now shows live weather&#10;Share catch photos in Dock Talk"
                className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric placeholder:text-copyMuted/40 resize-none leading-relaxed"
              />
            </div>

            {/* ✨ AI Polish */}
            <div className="bg-deepPanel border border-trophyGold/20 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-trophyGold mb-1">✨ AI Polish</p>
              <p className="text-copyMuted/70 text-xs mb-3">Talk or type rough thoughts — AI fills the bullets above</p>
              <div className="relative mb-3">
                <textarea
                  value={roughNotes}
                  onChange={(e) => setRoughNotes(e.target.value)}
                  rows={4}
                  placeholder="we added chat photos, fixed the standings bug, new members get welcome email..."
                  className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-trophyGold placeholder:text-copyMuted/30 resize-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={toggleVoice}
                  title={listening ? 'Stop recording' : 'Tap to speak'}
                  className={`absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center text-base transition-all ${
                    listening ? 'bg-red-500 animate-pulse text-white' : 'bg-liftedPanel hover:bg-trophyGold/20 text-copyMuted hover:text-trophyGold'
                  }`}
                >
                  {listening ? '⏹' : '🎤'}
                </button>
              </div>
              {listening && <p className="text-red-400 text-xs mb-2 animate-pulse">🔴 Listening…</p>}
              {polishError && <p className="text-red-400 text-xs mb-2">{polishError}</p>}
              <button
                type="button"
                onClick={handlePolish}
                disabled={polishing || !roughNotes.trim()}
                className="w-full bg-trophyGold/10 hover:bg-trophyGold/20 border border-trophyGold/30 text-trophyGold font-bold py-2.5 rounded-lg text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {polishing ? '✨ Rewriting…' : '✨ Polish with AI →'}
              </button>
            </div>

            {/* Monday Night Focus */}
            <div className="bg-deepPanel border border-liftedPanel rounded-xl p-4 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-copyMuted">Monday Night Focus</p>
              <div>
                <label className="block text-xs font-semibold text-copyMuted mb-1.5">Feature Spotlight</label>
                <select
                  value={deepDive}
                  onChange={(e) => { setDeepDive(e.target.value); setMeetingFocus(MEETING_FOCUS_BY_FEATURE[e.target.value] ?? ''); }}
                  className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
                >
                  {DEEP_DIVE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-copyMuted mb-1.5">What you&apos;ll cover live</label>
                <textarea
                  value={meetingFocus}
                  onChange={(e) => setMeetingFocus(e.target.value)}
                  rows={3}
                  className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-copyMuted mb-1.5">
                  Custom blurb <span className="font-normal text-copyMuted/60">(optional)</span>
                </label>
                <textarea
                  value={deepDiveNote}
                  onChange={(e) => setDeepDiveNote(e.target.value)}
                  rows={2}
                  placeholder="Leave blank to use the default description."
                  className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric placeholder:text-copyMuted/30 resize-none"
                />
              </div>
            </div>

            {/* This Week's Suggestions */}
            {latest && (
              <div className="bg-deepPanel border border-electric/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-electric">This Week&apos;s Suggestions</p>
                    <p className="text-copyMuted/60 text-xs">{latest.week}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBullets(latest.bullets.join('\n'));
                      setSubject(latest.suggestedSubject);
                      setDeepDive(latest.suggestedDeepDive);
                      setMeetingFocus(latest.suggestedMeetingFocus ?? MEETING_FOCUS_BY_FEATURE[latest.suggestedDeepDive] ?? '');
                    }}
                    className="text-electric text-xs font-bold bg-electric/10 hover:bg-electric/20 px-3 py-1.5 rounded-lg border border-electric/20 transition-colors whitespace-nowrap"
                  >
                    Load All →
                  </button>
                </div>
                <ul className="space-y-2">
                  {latest.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-xs text-copyLight leading-relaxed">
                      <span className="text-electric shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Send Options */}
            <div className="bg-deepPanel border border-liftedPanel rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-copyMuted">Send Options</p>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={sendNow} onChange={(e) => setSendNow(e.target.checked)} className="w-4 h-4 rounded accent-electric shrink-0" />
                <span className="text-sm font-semibold text-copyLight">
                  Send Now <span className="font-normal text-copyMuted text-xs">— skip scheduling</span>
                </span>
              </label>
              {!sendNow && (
                <div>
                  <label className="block text-xs font-semibold text-copyMuted mb-1.5">Schedule For</label>
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required={!sendNow}
                    className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
                  />
                  <p className="text-xs text-copyMuted/40 mt-1.5">Mailchimp requires at least 15 min from now.</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-bass hover:bg-bassLight text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 font-heading text-base"
            >
              {status === 'loading' ? 'Working…' : sendNow ? '🚀 Send Campaign Now' : '📅 Schedule Campaign'}
            </button>

            {/* Status messages */}
            {status === 'success' && (
              <div className="bg-bass/20 border border-bass rounded-xl p-4 text-sm text-copyLight leading-relaxed">
                {resultMsg}
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 text-sm text-red-300 leading-relaxed">
                {resultMsg}
              </div>
            )}

            {/* Reminder */}
            <div className="bg-deepPanel border border-liftedPanel rounded-xl p-4 text-xs text-copyMuted space-y-1.5">
              <p className="font-semibold text-copyLight text-sm">📌 Reminder</p>
              <p>Monday 7–8PM MT · <a href="https://meet.google.com/kys-cuub-idb" target="_blank" rel="noopener noreferrer" className="text-electric underline">meet.google.com/kys-cuub-idb</a></p>
              <p>Targets <strong>app-user</strong> segment. Waitlist excluded.</p>
              <p>Check <a href="https://mailchimp.com" target="_blank" rel="noopener noreferrer" className="text-electric underline">Mailchimp dashboard</a> after sending.</p>
            </div>

          </div>
        </form>

        {/* ── RIGHT: Canvas / live preview ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#111]">
          <div className="border-b border-liftedPanel px-5 py-2.5 flex items-center gap-2 shrink-0 bg-deeperPanel">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span className="text-xs text-copyMuted/50 font-medium">Live preview · updates as you type</span>
          </div>
          <div className="flex-1 overflow-auto p-6 flex justify-center">
            <iframe
              srcDoc={previewHtml}
              title="Email preview canvas"
              sandbox="allow-same-origin"
              className="w-full max-w-[640px] rounded-xl border border-liftedPanel/40"
              style={{ minHeight: '900px' }}
            />
          </div>
        </div>

      </div>
    </div>

    {/* ── Confirm send-now modal ── */}
    {confirmOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
        <div className="w-full max-w-sm bg-deepPanel border border-liftedPanel rounded-2xl p-8 shadow-2xl">
          <p className="text-3xl text-center mb-4">🚀</p>
          <h2 className="text-xl font-heading font-bold text-trophyGold text-center mb-2">Send right now?</h2>
          <p className="text-copyMuted text-sm text-center mb-2">
            This will immediately deliver to{' '}
            {subCount !== null
              ? <span className="text-copyLight font-bold">{subCount.toLocaleString()} subscribers</span>
              : <span className="text-copyLight font-bold">all app-user subscribers</span>}
            {'.'}
          </p>
          <p className="text-copyMuted/60 text-xs text-center mb-7">There&apos;s no undo once it&apos;s sent.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="flex-1 bg-liftedPanel hover:bg-deeperPanel text-copyLight font-bold py-3.5 rounded-xl transition-colors font-heading"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void executeSend()}
              className="flex-1 bg-bass hover:bg-bassLight text-white font-bold py-3.5 rounded-xl transition-colors font-heading"
            >
              Yes, Send Now
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
