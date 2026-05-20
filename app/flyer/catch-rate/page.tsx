'use client';

import { useState } from 'react';
import { TC_LOGOS } from '@/lib/brandAssets';

/**
 * Catch Rate Tournament — How-To Flyer (TLO Event 2, May 20 2026)
 * ────────────────────────────────────────────────────────────────
 * Real flow: check-in at dock → kiosk → SMS link → record video on bump board
 * → say code word → submit → TD reviews → text when approved.
 *
 * Route: /flyer/catch-rate
 */

const GOLD = '#D4AF37';
const GOLD_L = '#F0D060';
const TEAL = '#2DD4BF';
const SIGNUP_URL = 'https://trophycast.app/join/tlo';
const SIGNUP_HOST = 'trophycast.app/join/tlo';
const QR_IMAGE = '/trophycast-qr.svg';

const STEPS = [
  {
    num: '1',
    icon: '📍',
    title: 'Check In at the Dock (3:30 – 4:00 PM)',
    body: 'Find Emily at the check-in table at the North Boat Ramp. Tell her your name — she\'ll pull you up on the kiosk. New angler? She\'ll add you on the spot. Pick which species you\'re fishing tonight ($20 each — Bass, Walleye, Trout). Pay cash. Done.',
    tip: 'Carp is NOT available tonight (Event 2). Big Fish pot ($20/species) is season-long — only collected once.',
  },
  {
    num: '2',
    icon: '📱',
    title: 'Emily Taps "Mark Paid" → You Get a Text Automatically',
    body: 'The moment Emily taps Mark Paid, Trophy Cast fires an SMS to your phone with two links. Link 1 — one-time account setup (sets your password, ~60 seconds, first time only). Link 2 — goes straight to the Submit a Catch screen for tonight\'s event. Save Link 2 — you\'ll tap it every time you catch a fish.',
    tip: 'Returning angler? Skip Link 1, just use Link 2. No phone on file? Tell Emily at check-in before you pay.',
  },
  {
    num: '3',
    icon: '🎣',
    title: 'Catch a Fish',
    body: 'Fish normally from 4:00 – 8:00 PM. When you catch one worth submitting, pull out your phone, lay it on the bump board, and record your video before you release. You can submit as many fish as you want — only your longest per species counts.',
    tip: 'Longest fish wins. More submissions = more chances to beat your own personal best.',
  },
  {
    num: '4',
    icon: '🎥',
    title: 'Record the Video Correctly',
    body: 'Open Trophy Cast → tap the tournament card → tap "Log Bass" (or your species). Tap Record. Show the fish on the bump board: head touching the LEFT stop, tail pinched to the greatest length. Say TODAY\'S CODE WORD out loud on camera. Stay steady during the measurement. Release the fish on camera.',
    tip: 'No code word = automatic rejection. Get today\'s word from Emily at check-in.',
  },
  {
    num: '5',
    icon: '📏',
    title: 'Enter the Length and Submit',
    body: 'After recording, the app unlocks the Length field. Scroll to the nearest ¼ inch (round UP if between marks). Verify the species is correct. Tap Submit Fish. The video uploads and Emily sees it instantly on her TD screen. You\'ll get a text when it\'s approved or if it gets rejected (with the reason).',
    tip: 'If you\'re off-signal, the app queues your submission and uploads automatically when you have bars.',
  },
];

export default function CatchRateFlyerPage() {
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => window.print();

  const handleDownloadPng = async () => {
    const node = document.getElementById('catchrate-flyer');
    if (!node) return;
    setDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true });
      const link = document.createElement('a');
      link.download = 'trophy-cast-catch-rate-howto.png';
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #060F16 !important; margin: 0; padding: 0; }
          .flyer-page-wrap { display: block; padding: 0; }
        }
        @page { size: letter; margin: 0; }
      `}</style>

      {/* ── Controls bar (not printed) ── */}
      <div className="no-print" style={{
        background: '#060F16', borderBottom: '1px solid rgba(212,175,55,0.18)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <span style={{ color: '#C9D3DA', fontSize: 13 }}>
          🎣 <strong style={{ color: '#F5F8FA' }}>Catch Rate How-To Flyer</strong> — screenshot, print, or download PNG
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            style={{
              background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.35)',
              borderRadius: 8, color: TEAL, padding: '6px 14px', fontSize: 12,
              cursor: downloading ? 'wait' : 'pointer', fontWeight: 600,
            }}
          >
            {downloading ? '⏳ Generating...' : '⬇ Download PNG'}
          </button>
          <button
            onClick={handlePrint}
            style={{
              background: GOLD, border: 'none', borderRadius: 8, color: '#0A1520',
              padding: '6px 16px', fontSize: 12, cursor: 'pointer', fontWeight: 800,
            }}
          >
            🖨 Print / Save PDF
          </button>
        </div>
      </div>

      {/* ── Page wrapper ── */}
      <div className="flyer-page-wrap" style={{
        minHeight: '100vh', background: '#040C14',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-start', padding: '32px 16px 64px',
      }}>

        {/* ══ THE FLYER CARD ══ */}
        <div
          id="catchrate-flyer"
          style={{
            width: 816,
            minHeight: 1056,
            background: 'linear-gradient(165deg, #06111C 0%, #0A1A28 50%, #071018 100%)',
            border: '1.5px solid rgba(212,175,55,0.2)',
            borderRadius: 12,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: '0 40px 120px rgba(0,0,0,0.9), 0 0 60px rgba(212,175,55,0.05)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {/* Ambient glows */}
          <div style={{ position: 'absolute', top: -80, left: -60, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.07), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 300, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,212,191,0.05), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.04), transparent 70%)', pointerEvents: 'none' }} />

          {/* Top accent bar */}
          <div style={{ height: 6, background: 'linear-gradient(90deg, #D4AF37, #2DD4BF, #D4AF37)' }} />

          {/* ── HEADER ── */}
          <div style={{ padding: '40px 64px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, position: 'relative' }}>
            {/* Left: branding + title */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)',
                borderRadius: 100, padding: '4px 14px', marginBottom: 18,
              }}>
                <span style={{ fontSize: 11 }}>🏆</span>
                <span style={{ color: TEAL, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Tightline Outdoors · Catch Rate Series · Event 2 of 9
                </span>
              </div>

              <h1 style={{
                fontSize: 46, fontWeight: 900, margin: '0 0 10px', lineHeight: 1.05,
                letterSpacing: '-1.5px',
                background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_L} 50%, ${TEAL} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                How to Fish Tonight
              </h1>

              <p style={{ fontSize: 15, color: 'rgba(200,215,225,0.75)', margin: '0 0 4px', lineHeight: 1.5, maxWidth: 440 }}>
                Check-in 3:30 PM · Tournament 4:00–8:00 PM · Chatfield, North Boat Ramp
              </p>
              <p style={{ fontSize: 13, color: GOLD, fontWeight: 700, margin: '0 0 0', lineHeight: 1.4, maxWidth: 440 }}>
                🎯 Special tonight: Beat Nate in Bass · No Carp tonight
              </p>

              <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                {[
                  { icon: '💵', text: '$20 / species' },
                  { icon: '🐟', text: 'Bass · Walleye · Trout' },
                  { icon: '📏', text: 'Longest fish wins' },
                ].map((m) => (
                  <div key={m.text} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 100, padding: '4px 12px',
                  }}>
                    <span style={{ fontSize: 11 }}>{m.icon}</span>
                    <span style={{ color: 'rgba(200,215,225,0.6)', fontSize: 11, fontWeight: 600 }}>{m.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: TC logo + QR */}
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={TC_LOGOS.fishMark} alt="Trophy Cast" height={64} style={{ display: 'block', objectFit: 'contain' }} />
              <div style={{
                background: GOLD, borderRadius: 14, padding: 10,
                display: 'inline-block', boxShadow: '0 8px 32px rgba(212,175,55,0.35)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={QR_IMAGE} alt={`QR — ${SIGNUP_HOST}`} width={120} height={120} style={{ display: 'block', borderRadius: 6 }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'rgba(200,215,225,0.45)', fontSize: 10, margin: '0 0 2px' }}>Scan to sign up</p>
                <p style={{ color: GOLD, fontWeight: 800, fontSize: 11, margin: 0 }}>{SIGNUP_HOST}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ margin: '0 64px 0', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), rgba(45,212,191,0.2), transparent)' }} />

          {/* ── STEPS ── */}
          <div style={{ padding: '28px 64px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {STEPS.map((step, idx) => (
              <div key={step.num} style={{
                display: 'flex', gap: 18, alignItems: 'flex-start',
                background: 'rgba(10,25,38,0.7)',
                border: '1px solid rgba(212,175,55,0.15)',
                borderLeft: `4px solid ${idx % 2 === 0 ? GOLD : TEAL}`,
                borderRadius: '0 10px 10px 0',
                padding: '16px 20px',
                position: 'relative',
              }}>
                {/* Step number badge */}
                <div style={{
                  flexShrink: 0,
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: idx % 2 === 0
                    ? 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(212,175,55,0.08))'
                    : 'linear-gradient(135deg, rgba(45,212,191,0.25), rgba(45,212,191,0.08))',
                  border: `1.5px solid ${idx % 2 === 0 ? 'rgba(212,175,55,0.5)' : 'rgba(45,212,191,0.5)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 900,
                  color: idx % 2 === 0 ? GOLD : TEAL,
                  marginTop: 1,
                }}>
                  {step.num}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{step.icon}</span>
                    <span style={{
                      fontSize: 14, fontWeight: 800, color: '#F0F5FA',
                      letterSpacing: '-0.2px',
                    }}>
                      {step.title}
                    </span>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'rgba(180,200,215,0.8)', margin: '0 0 8px', lineHeight: 1.6 }}>
                    {step.body}
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6, padding: '3px 10px',
                  }}>
                    <span style={{ fontSize: 10 }}>💡</span>
                    <span style={{ fontSize: 11, color: 'rgba(200,215,225,0.55)', fontStyle: 'italic' }}>{step.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── VIDEO RULES — most important box on the page ── */}
          <div style={{ margin: '8px 64px 0', padding: '18px 24px', background: 'rgba(212,175,55,0.06)', border: '1.5px solid rgba(212,175,55,0.3)', borderRadius: 10 }}>
            <p style={{ color: GOLD, fontWeight: 800, fontSize: 11.5, margin: '0 0 12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              🎥 Video Rules — Submissions Get Rejected If You Miss These
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 32px' }}>
              {[
                { icon: '✅', label: 'Fish on bump board', detail: 'Head touching LEFT stop. Tail pinched to greatest length.' },
                { icon: '✅', label: 'Say the code word', detail: 'Get it from Emily at check-in. Say it on camera every time.' },
                { icon: '✅', label: 'Show measurement clearly', detail: 'Hold the fish steady so the ruler reads without question.' },
                { icon: '✅', label: 'Release on camera', detail: 'Fish going back in the water must be visible on video.' },
                { icon: '❌', label: 'No pre-recorded video', detail: 'Must record live in-app. Gallery imports = automatic rejection.' },
                { icon: '❌', label: 'No length without video', detail: 'A number alone does nothing. The video is the submission.' },
              ].map(({ icon, label, detail }) => (
                <div key={label} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 12, marginTop: 2 }}>{icon}</span>
                  <div>
                    <span style={{ color: '#F0F5FA', fontSize: 11.5, fontWeight: 700, display: 'block' }}>{label}</span>
                    <span style={{ color: 'rgba(200,215,225,0.55)', fontSize: 10.5 }}>{detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── QUICK REFERENCE ── */}
          <div style={{ margin: '10px 64px 0', padding: '16px 24px', background: 'rgba(45,212,191,0.04)', border: '1px solid rgba(45,212,191,0.18)', borderRadius: 10 }}>
            <p style={{ color: TEAL, fontWeight: 800, fontSize: 11.5, margin: '0 0 10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              📋 Quick Reference
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 32px' }}>
              {[
                { q: 'Check-in location?', a: 'North Boat Ramp, Chatfield · 3:30–4:00 PM' },
                { q: 'Species available tonight?', a: 'Bass · Walleye · Trout (NO Carp)' },
                { q: 'How do I log a catch?', a: 'App → tournament card → "Log Bass" (or your species)' },
                { q: 'What wins?', a: 'Longest fish in inches (nearest ¼") per species' },
                { q: 'Multiple submissions?', a: 'Yes — only your personal best per species counts' },
                { q: 'Catch rejected?', a: 'You\'ll get a text with the reason. Resubmit is allowed. Ask Emily.' },
              ].map(({ q, a }) => (
                <div key={q} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ color: 'rgba(200,215,225,0.5)', fontSize: 10.5, fontWeight: 600 }}>{q}</span>
                  <span style={{ color: '#F0F5FA', fontSize: 11.5, fontWeight: 700 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{ margin: '20px 64px 0', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />

            <div style={{
              padding: '18px 64px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              {/* Left: TC logo lockup */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={TC_LOGOS.icon48} alt="Trophy Cast" height={26} style={{ display: 'block', objectFit: 'contain' }} />
                <span style={{ color: 'rgba(200,215,225,0.45)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>
                  Questions? Find Emily · tightlineoutdoors.com · 720.775.7770
                </span>
              </div>
              {/* Right: URL */}
              <a href={SIGNUP_URL} style={{ color: GOLD, fontWeight: 800, fontSize: 12, textDecoration: 'none' }}>
                {SIGNUP_HOST}
              </a>
            </div>

            {/* Bottom accent bar */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #D4AF37, #2DD4BF, #D4AF37)' }} />
          </div>
        </div>

        {/* Below-card note */}
        <p className="no-print" style={{ color: 'rgba(200,215,225,0.3)', fontSize: 11, marginTop: 20, textAlign: 'center' }}>
          Print this page or use Ctrl+P → Save as PDF. For a PNG, click "Download PNG" above.
        </p>
      </div>
    </>
  );
}
