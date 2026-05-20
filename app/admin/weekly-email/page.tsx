'use client';

import {
  CalendarDays,
  LoaderCircle,
  Mic,
  Pin,
  Rocket,
  Sparkles,
  Square,
  Trophy,
} from 'lucide-react';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { weeklyUpdates, type WeeklyUpdate } from '@/lib/weeklyUpdates';
import { useAdminAuth } from '@/lib/useAdminAuth';
import { buildEmailHtml, buildPromoEmailHtml, type PromoEmailStep } from '@/lib/emailTemplate';
import { TCCoachBadge } from '@/components/TCCoachBadge';
import { CLUB_SELECTOR_OPTIONS, getClubEmailConfig } from '@/lib/clubEmailConfig';

type CampaignType = 'weekly' | 'promo';
type AudienceType = 'club' | 'all';

const DEEP_DIVE_OPTIONS = [
  'Dock Talk',
  'Voice Catch Logging',
  'TC Coach',
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
  'TC Coach': "Live walkthrough of TC Coach — review your real catch history and see your pattern insights",
  'Tournament Dashboard': "Live demo of the Tournament Dashboard — draw pairings, enter weights, and post results in real time",
  'AOY Standings': "Live look at AOY Standings — see how the leaderboard updates automatically after every tournament",
  'Trophy Room': "Tour of your Trophy Room — your best fish, season highlights, and personal stats all in one place",
  'Member Directory': "Browse the Member Directory together — find club members, see profiles, and connect",
  'Weather & Conditions': "Live look at Weather & Conditions — check the lake forecast and moon phase before your next tournament",
  'Video Notes': "Live demo of Video Notes — record a quick tip about a technique or spot right inside TC",
  'Board & Officer Tools': "Live walkthrough of Board Tools — agenda builder, meeting notes, and member management for officers",
};

const DEFAULT_PROMO_STEPS: PromoEmailStep[] = [
  {
    title: 'Register for Catch Rate',
    body: 'Use the link below to register inside Trophy Cast and pick the species you want to fish.',
  },
  {
    title: 'Pay Emily tomorrow before the tournament',
    body: 'Bring cash to check-in so all you have to do is hand Emily the money and you are good to go.',
  },
  {
    title: 'Open Trophy Cast and fish',
    body: 'After you are checked in, open Trophy Cast to log catches and follow the event.',
  },
];

const DEFAULT_PROMO_PRIMARY_CTA_URL = 'https://trophycast.app/join/tlo?source=catch-rate-email-2026-05-20';
const DEFAULT_PROMO_SECONDARY_CTA_URL = 'https://tightlineoutdoors.com/catch-rate-tournament';

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

function getDefaultSubject(clubId: string): string {
  const config = getClubEmailConfig(clubId);
  const prefix = config?.subjectPrefix ?? '';
  return `${prefix}Trophy Cast Weekly \uD83C\uDFA3 \u2014 ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
}

function getDefaultPromoSubject(clubId: string): string {
  const config = getClubEmailConfig(clubId);
  const prefix = config?.subjectPrefix ?? '';
  return `${prefix}Catch Rate is open — register now, pay Emily tomorrow`;
}

function getUpdateSignature(update: WeeklyUpdate): string {
  return [update.suggestedSubject, update.suggestedDeepDive, update.bullets.join('|')]
    .join('::')
    .toLowerCase();
}

export default function WeeklyEmailAdminPage() {
  // Dynamic suggestions state (initialized from static import, refreshable via API)
  const [suggestions, setSuggestions] = useState<WeeklyUpdate[]>(weeklyUpdates);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState('');
  const latest = suggestions[0];

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
  const [campaignType, setCampaignType] = useState<CampaignType>('weekly');
  const [audience, setAudience] = useState<AudienceType>('club');
  const [clubId, setClubId] = useState('DBM');
  const [subject, setSubject] = useState(() => getDefaultSubject('DBM'));
  const [bullets, setBullets] = useState('');
  const [deepDive, setDeepDive] = useState<string>(DEEP_DIVE_OPTIONS[0]);
  const [deepDiveNote, setDeepDiveNote] = useState('');
  const [meetingFocus, setMeetingFocus] = useState(latest?.suggestedMeetingFocus ?? '');
  const [promoEyebrow, setPromoEyebrow] = useState('Tightline Outdoors × Trophy Cast');
  const [promoTitle, setPromoTitle] = useState('Catch Rate registration is open');
  const [promoIntro, setPromoIntro] = useState('Register today in Trophy Cast so tomorrow morning is quick at check-in.');
  const [promoPrimaryCtaLabel, setPromoPrimaryCtaLabel] = useState('Register for Catch Rate');
  const [promoPrimaryCtaUrl, setPromoPrimaryCtaUrl] = useState(DEFAULT_PROMO_PRIMARY_CTA_URL);
  const [promoSecondaryCtaLabel, setPromoSecondaryCtaLabel] = useState('Tournament details');
  const [promoSecondaryCtaUrl, setPromoSecondaryCtaUrl] = useState(DEFAULT_PROMO_SECONDARY_CTA_URL);
  const [promoFooterNote, setPromoFooterNote] = useState('After you register, pay Emily tomorrow before the tournament. Then open Trophy Cast and you are ready to go.');
  const [promoSteps, setPromoSteps] = useState<PromoEmailStep[]>(DEFAULT_PROMO_STEPS);
  const [sendNow, setSendNow] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(getNextSundayLocal);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultMsg, setResultMsg] = useState('');

  // Subscriber count (fetched after unlock)
  const [subCount, setSubCount] = useState<number | null>(null);

  // Send-now confirmation modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const clubConfig = useMemo(() => getClubEmailConfig(clubId), [clubId]);

  const handleUnlock = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!pwInput.trim()) return;
    unlock(pwInput);
  }, [pwInput, unlock]);

  // Fetch subscriber count after unlock or when club changes
  useEffect(() => {
    if (!unlocked || !password) return;
    setSubCount(null);
    fetch('/api/admin/subscriber-count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, clubId, audience }),
    })
      .then((r) => r.json())
      .then((d) => setSubCount(d.count ?? null))
      .catch(() => {});
  }, [unlocked, password, clubId, audience]);

  const handleCampaignTypeChange = useCallback((nextType: CampaignType) => {
    setCampaignType(nextType);
    if (nextType === 'promo') {
      const nextClubId = clubId === 'DBM' ? 'TLO' : clubId;
      if (nextClubId !== clubId) setClubId(nextClubId);
      setAudience('all');
      setSubject((prev) => (
        prev === getDefaultSubject(clubId) || !prev.trim()
          ? getDefaultPromoSubject(nextClubId)
          : prev
      ));
      return;
    }

    setSubject((prev) => (
      prev === getDefaultPromoSubject(clubId) || !prev.trim()
        ? getDefaultSubject(clubId)
        : prev
    ));
  }, [clubId]);

  const updatePromoStep = useCallback((index: number, field: keyof PromoEmailStep, value: string) => {
    setPromoSteps((prev) => prev.map((step, stepIndex) => (
      stepIndex === index ? { ...step, [field]: value } : step
    )));
  }, []);

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

    const validPromoSteps = promoSteps
      .map((step) => ({ title: step.title.trim(), body: step.body.trim() }))
      .filter((step) => step.title && step.body);

    try {
      const res = await fetch('/api/admin/weekly-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          campaignType,
          audience,
          subject,
          scheduleTime: isoScheduleTime,
          clubId,
          ...(campaignType === 'weekly'
            ? {
                bullets: bulletList,
                deepDive,
                deepDiveNote: deepDiveNote.trim() || undefined,
                meetingFocus: meetingFocus.trim() || undefined,
              }
            : {
                promo: {
                  eyebrow: promoEyebrow.trim(),
                  title: promoTitle.trim(),
                  intro: promoIntro.trim(),
                  steps: validPromoSteps,
                  primaryCtaLabel: promoPrimaryCtaLabel.trim(),
                  primaryCtaUrl: promoPrimaryCtaUrl.trim(),
                  secondaryCtaLabel: promoSecondaryCtaLabel.trim() || undefined,
                  secondaryCtaUrl: promoSecondaryCtaUrl.trim() || undefined,
                  footerNote: promoFooterNote.trim() || undefined,
                },
              }),
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
      setResultMsg(`${action} Sent to ${data.recipientCount} subscriber${data.recipientCount === 1 ? '' : 's'}.`);
    } catch {
      setStatus('error');
      setResultMsg('Network error. Check your connection and try again.');
    }
  }, [
    password,
    campaignType,
    audience,
    subject,
    bullets,
    deepDive,
    deepDiveNote,
    meetingFocus,
    promoSteps,
    promoEyebrow,
    promoTitle,
    promoIntro,
    promoPrimaryCtaLabel,
    promoPrimaryCtaUrl,
    promoSecondaryCtaLabel,
    promoSecondaryCtaUrl,
    promoFooterNote,
    sendNow,
    scheduleTime,
    lockOut,
    clubId,
  ]);

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

      const validPromoSteps = promoSteps
        .map((step) => ({ title: step.title.trim(), body: step.body.trim() }))
        .filter((step) => step.title && step.body);

      if (campaignType === 'promo') {
        if (!promoTitle.trim() || !promoIntro.trim() || !promoPrimaryCtaLabel.trim() || !promoPrimaryCtaUrl.trim()) {
          setStatus('error');
          setResultMsg('Complete the promo headline, intro, and primary CTA before sending.');
          return;
        }
        if (validPromoSteps.length === 0) {
          setStatus('error');
          setResultMsg('Add at least one Catch Rate step before sending.');
          return;
        }
      } else if (bulletList.length === 0) {
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
    [bullets, promoSteps, campaignType, promoTitle, promoIntro, promoPrimaryCtaLabel, promoPrimaryCtaUrl, sendNow, executeSend]
  );

  const handleLoadLatest = useCallback(() => {
    if (!latest) return;
    setBullets(latest.bullets.join('\n'));
    setSubject(latest.suggestedSubject);
    setDeepDive(latest.suggestedDeepDive);
    setMeetingFocus(latest.suggestedMeetingFocus ?? MEETING_FOCUS_BY_FEATURE[latest.suggestedDeepDive] ?? '');
  }, [latest]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshError('');
    try {
      const res = await fetch('/api/admin/weekly-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          seenBullets: suggestions.slice(0, 8).flatMap((update) => update.bullets),
          seenSubjects: suggestions.slice(0, 8).map((update) => update.suggestedSubject),
        }),
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json() as { suggestion?: WeeklyUpdate };
      if (!data.suggestion) throw new Error('Missing suggestion');
      setSuggestions((current) => {
        const next = [
          data.suggestion as WeeklyUpdate,
          ...current.filter((update) => getUpdateSignature(update) !== getUpdateSignature(data.suggestion as WeeklyUpdate)),
        ];
        return next.slice(0, 10);
      });
    } catch {
      setRefreshError('Could not generate a new idea set. Keeping your current suggestions.');
    } finally {
      setRefreshing(false);
    }
  }, [suggestions]);

  const previewBullets = useMemo(
    () =>
      bullets
        .split('\n')
        .map((b) => b.replace(/^[-•*]\s*/, '').trim())
        .filter(Boolean),
    [bullets]
  );

  const previewPromoSteps = useMemo(() => {
    const steps = promoSteps
      .map((step) => ({ title: step.title.trim(), body: step.body.trim() }))
      .filter((step) => step.title && step.body);
    return steps.length
      ? steps
      : [{ title: 'Register for Catch Rate', body: 'Tap the button below to lock in your spot.' }];
  }, [promoSteps]);

  const recipientScopeLabel = audience === 'all'
    ? 'all subscribers'
    : `${clubConfig?.displayName ?? 'selected club'} subscribers`;

  const previewHtml = useMemo(() => {
    if (campaignType === 'promo') {
      return buildPromoEmailHtml({
        subject,
        eyebrow: promoEyebrow,
        title: promoTitle,
        intro: promoIntro,
        steps: previewPromoSteps,
        primaryCtaLabel: promoPrimaryCtaLabel,
        primaryCtaUrl: promoPrimaryCtaUrl,
        secondaryCtaLabel: promoSecondaryCtaLabel.trim() || undefined,
        secondaryCtaUrl: promoSecondaryCtaUrl.trim() || undefined,
        footerNote: promoFooterNote.trim() || undefined,
        clubLogoUrl: clubConfig?.logoAbsoluteUrl ?? null,
        clubDisplayName: clubConfig?.displayName,
      });
    }

    return buildEmailHtml({
      subject,
      bullets: previewBullets.length
        ? previewBullets
        : ['(Start typing bullets above to see them here…)'],
      deepDive,
      deepDiveNote,
      meetingFocus,
      clubLogoUrl: clubConfig?.logoAbsoluteUrl ?? null,
      clubDisplayName: clubConfig?.displayName,
    });
  }, [
    campaignType,
    subject,
    promoEyebrow,
    promoTitle,
    promoIntro,
    previewPromoSteps,
    promoPrimaryCtaLabel,
    promoPrimaryCtaUrl,
    promoSecondaryCtaLabel,
    promoSecondaryCtaUrl,
    promoFooterNote,
    clubConfig,
    previewBullets,
    deepDive,
    deepDiveNote,
    meetingFocus,
  ]);

  // ── Password gate ────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <Trophy className="h-12 w-12 text-trophyGold" strokeWidth={2.2} />
            </div>
            <h1 className="text-3xl font-heading font-bold text-trophyGold">Email Campaign Admin</h1>
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
            {' / Email Campaign'}
          </p>
          <h1 className="text-xl font-heading font-bold text-trophyGold leading-tight">
            {campaignType === 'promo' ? 'Promo Email' : 'Weekly Email'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-copyMuted text-sm hidden md:block">
            {subCount === null
              ? <span className="text-copyMuted/50">loading…</span>
              : <><span className="text-trophyGold font-bold">{subCount.toLocaleString()}</span>{' '}subscribers</>}
          </p>
          <div className="flex items-center gap-2">
            <button
              form="email-form"
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center gap-2 bg-bass hover:bg-bassLight text-white font-bold py-2.5 px-6 rounded-xl transition-colors disabled:opacity-50 font-heading text-sm"
            >
              {status === 'loading' ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.2} />
                  <span>Working…</span>
                </>
              ) : sendNow ? (
                <>
                  <Rocket className="h-4 w-4" strokeWidth={2.2} />
                  <span>{campaignType === 'promo' ? 'Send Promo' : 'Send Now'}</span>
                </>
              ) : (
                <>
                  <CalendarDays className="h-4 w-4" strokeWidth={2.2} />
                  <span>{campaignType === 'promo' ? 'Schedule Promo' : 'Schedule'}</span>
                </>
              )}
            </button>
          </div>
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

            {/* Campaign Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-copyMuted mb-2">Campaign Type</label>
              <select
                value={campaignType}
                onChange={(e) => handleCampaignTypeChange(e.target.value as CampaignType)}
                className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
              >
                <option value="weekly">Weekly update</option>
                <option value="promo">Catch Rate promo</option>
              </select>
            </div>

            {/* Club */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-copyMuted mb-2">
                Brand / From Name
              </label>
              <select
                value={clubId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setClubId(newId);
                  const config = getClubEmailConfig(newId);
                  const prefix = config?.subjectPrefix ?? '';
                  // Re-prefix the subject: strip any existing club prefix then add new one
                  setSubject((prev) => {
                    const stripped = prev.replace(/^[A-Z]+ \| /, '');
                    return prefix + stripped;
                  });
                }}
                className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
              >
                {CLUB_SELECTOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-xs text-copyMuted/50 mt-1.5">
                Branding and subject prefix come from this club even when the audience is set to all subscribers.
              </p>
            </div>

            {/* Audience */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-copyMuted mb-2">Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as AudienceType)}
                className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
              >
                <option value="club">Selected club subscribers only</option>
                <option value="all">All subscribers</option>
              </select>
            </div>

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

            {campaignType === 'weekly' ? (
              <>
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
                    placeholder="New members now get a welcome email&#10;TC Coach now shows live weather&#10;Share catch photos in Dock Talk"
                    className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric placeholder:text-copyMuted/40 resize-none leading-relaxed"
                  />
                </div>

                {/* TC Coach Polish */}
                <div className="bg-deepPanel border border-trophyGold/20 rounded-xl p-4">
                  <TCCoachBadge label="TC Coach Polish" className="mb-2" />
                  <p className="text-copyMuted/70 text-xs mb-3">Talk or type rough thoughts — TC Coach fills the bullets above</p>
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
                      {listening ? (
                        <Square className="h-4 w-4 fill-current" strokeWidth={2.2} />
                      ) : (
                        <Mic className="h-4 w-4" strokeWidth={2.2} />
                      )}
                    </button>
                  </div>
                  {listening && (
                    <p className="flex items-center gap-2 text-red-400 text-xs mb-2 animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                      <span>Listening…</span>
                    </p>
                  )}
                  {polishError && <p className="text-red-400 text-xs mb-2">{polishError}</p>}
                  <button
                    type="button"
                    onClick={handlePolish}
                    disabled={polishing || !roughNotes.trim()}
                    className="inline-flex w-full items-center justify-center gap-2 bg-trophyGold/10 hover:bg-trophyGold/20 border border-trophyGold/30 text-trophyGold font-bold py-2.5 rounded-lg text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {polishing ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.2} />
                        <span>Rewriting…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-trophyGold" strokeWidth={2.2} />
                        <span>Polish with TC Coach →</span>
                      </>
                    )}
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
              </>
            ) : (
              <div className="bg-deepPanel border border-electric/20 rounded-xl p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-electric">Catch Rate Promo Content</p>
                <div>
                  <label className="block text-xs font-semibold text-copyMuted mb-1.5">Eyebrow</label>
                  <input
                    type="text"
                    value={promoEyebrow}
                    onChange={(e) => setPromoEyebrow(e.target.value)}
                    className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-copyMuted mb-1.5">Headline</label>
                  <input
                    type="text"
                    value={promoTitle}
                    onChange={(e) => setPromoTitle(e.target.value)}
                    className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-copyMuted mb-1.5">Intro</label>
                  <textarea
                    value={promoIntro}
                    onChange={(e) => setPromoIntro(e.target.value)}
                    rows={3}
                    className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric resize-none leading-relaxed"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-copyMuted mb-1.5">Primary CTA Label</label>
                    <input
                      type="text"
                      value={promoPrimaryCtaLabel}
                      onChange={(e) => setPromoPrimaryCtaLabel(e.target.value)}
                      className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-copyMuted mb-1.5">Primary CTA URL</label>
                    <input
                      type="url"
                      value={promoPrimaryCtaUrl}
                      onChange={(e) => setPromoPrimaryCtaUrl(e.target.value)}
                      className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-copyMuted mb-1.5">Secondary CTA Label</label>
                    <input
                      type="text"
                      value={promoSecondaryCtaLabel}
                      onChange={(e) => setPromoSecondaryCtaLabel(e.target.value)}
                      className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-copyMuted mb-1.5">Secondary CTA URL</label>
                    <input
                      type="url"
                      value={promoSecondaryCtaUrl}
                      onChange={(e) => setPromoSecondaryCtaUrl(e.target.value)}
                      className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-copyMuted mb-1.5">Footer Note</label>
                  <textarea
                    value={promoFooterNote}
                    onChange={(e) => setPromoFooterNote(e.target.value)}
                    rows={3}
                    className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric resize-none leading-relaxed"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-copyMuted">How It Works Steps</p>
                  {promoSteps.map((step, index) => (
                    <div key={index} className="rounded-xl border border-liftedPanel bg-midnight/50 p-3 space-y-2">
                      <div>
                        <label className="block text-xs font-semibold text-copyMuted mb-1.5">Step {index + 1} title</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updatePromoStep(index, 'title', e.target.value)}
                          className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-copyMuted mb-1.5">Step {index + 1} body</label>
                        <textarea
                          value={step.body}
                          onChange={(e) => updatePromoStep(index, 'body', e.target.value)}
                          rows={2}
                          className="w-full bg-midnight border border-liftedPanel rounded-xl px-4 py-3 text-copyLight text-sm focus:outline-none focus:border-electric resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* This Week's Suggestions + History */}
            {campaignType === 'weekly' && suggestions.length > 0 && (
              <div className="space-y-2">
                {/* Current week */}
                <div className="bg-deepPanel border border-electric/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-electric">This Week&apos;s Suggestions</p>
                      <p className="text-copyMuted/60 text-xs">{suggestions[0].week}</p>
                      {latest?.sourceLabel && (
                        <p className="text-copyMuted/50 text-[11px] mt-1">{latest.sourceLabel}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        title="Fetch latest suggestions from server"
                        className="inline-flex items-center gap-2 text-copyMuted hover:text-trophyGold text-xs font-bold bg-liftedPanel/50 hover:bg-trophyGold/10 px-3 py-1.5 rounded-lg border border-liftedPanel/50 transition-colors whitespace-nowrap disabled:opacity-50"
                      >
                        {refreshing ? (
                          <>
                            <LoaderCircle className="h-3.5 w-3.5 animate-spin" strokeWidth={2.2} />
                            <span>Generating…</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5 text-trophyGold" strokeWidth={2.2} />
                            <span>New Ideas</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleLoadLatest}
                        className="text-electric text-xs font-bold bg-electric/10 hover:bg-electric/20 px-3 py-1.5 rounded-lg border border-electric/20 transition-colors whitespace-nowrap"
                      >
                        Load All →
                      </button>
                    </div>
                  </div>
                  <p className="text-copyMuted/60 text-[11px] mb-3">Each click adds another idea set below so you can scroll and pick the best one.</p>
                  {refreshError && <p className="text-red-400 text-[11px] mb-3">{refreshError}</p>}
                  <ul className="space-y-2">
                    {suggestions[0].bullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-xs text-copyLight leading-relaxed">
                        <span className="text-electric shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Previous weeks history */}
                {suggestions.length > 1 && (
                  <div className="bg-deepPanel border border-liftedPanel rounded-xl overflow-hidden">
                    <p className="text-xs font-semibold uppercase tracking-wider text-copyMuted px-4 py-3 border-b border-liftedPanel">
                      More Ideas & Previous Weeks
                    </p>
                    <div className="divide-y divide-liftedPanel/50">
                      {suggestions.slice(1).map((update, wi) => (
                        <details key={wi} className="group">
                          <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none hover:bg-liftedPanel/30 transition-colors">
                            <span className="text-xs font-semibold text-copyMuted group-open:text-copyLight transition-colors">{update.week}</span>
                            <span className="text-copyMuted/40 text-xs group-open:rotate-180 transition-transform inline-block">▾</span>
                          </summary>
                          <div className="px-4 pb-3 space-y-1.5">
                            {update.sourceLabel && (
                              <p className="text-[11px] text-copyMuted/50">{update.sourceLabel}</p>
                            )}
                            {update.bullets.map((b, i) => (
                              <div key={i} className="flex gap-2 text-xs text-copyMuted/80 leading-relaxed">
                                <span className="text-copyMuted/40 shrink-0">•</span>
                                <span>{b}</span>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                setBullets(update.bullets.join('\n'));
                                setSubject(update.suggestedSubject);
                                setDeepDive(update.suggestedDeepDive);
                                setMeetingFocus(update.suggestedMeetingFocus ?? MEETING_FOCUS_BY_FEATURE[update.suggestedDeepDive] ?? '');
                              }}
                              className="mt-1 text-copyMuted/60 hover:text-electric text-xs font-bold transition-colors"
                            >
                              Load this week →
                            </button>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
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
                  <p className="text-xs text-copyMuted/40 mt-1.5">Resend delivers at the exact time you choose.</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex w-full items-center justify-center gap-2 bg-bass hover:bg-bassLight text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 font-heading text-base"
            >
              {status === 'loading' ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.2} />
                  <span>Working…</span>
                </>
              ) : sendNow ? (
                <>
                  <Rocket className="h-4 w-4" strokeWidth={2.2} />
                  <span>{campaignType === 'promo' ? 'Send Promo Now' : 'Send Campaign Now'}</span>
                </>
              ) : (
                <>
                  <CalendarDays className="h-4 w-4" strokeWidth={2.2} />
                  <span>{campaignType === 'promo' ? 'Schedule Promo Email' : 'Schedule Campaign'}</span>
                </>
              )}
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
              <p className="flex items-center gap-2 font-semibold text-copyLight text-sm">
                <Pin className="h-4 w-4" strokeWidth={2.2} />
                <span>Reminder</span>
              </p>
              <p>Audience: <strong>{recipientScopeLabel}</strong> from <strong>waitlist_subscribers</strong>.</p>
              <p>Branding: <strong>{clubConfig?.displayName ?? 'Trophy Cast'}</strong> email header and subject prefix.</p>
              <p>Check <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-electric underline">Resend dashboard</a> after sending.</p>
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
          <div className="mb-4 flex justify-center">
            <Rocket className="h-8 w-8 text-trophyGold" strokeWidth={2.2} />
          </div>
          <h2 className="text-xl font-heading font-bold text-trophyGold text-center mb-2">Send right now?</h2>
          <p className="text-copyMuted text-sm text-center mb-2">
            This will immediately deliver to{' '}
            {subCount !== null
              ? <span className="text-copyLight font-bold">{subCount.toLocaleString()} subscribers</span>
              : <span className="text-copyLight font-bold">{recipientScopeLabel}</span>}
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
