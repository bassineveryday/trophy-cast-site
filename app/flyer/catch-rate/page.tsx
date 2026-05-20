'use client';

import { TC_LOGOS } from '@/lib/brandAssets';

/**
 * Catch Rate Tournament — Half-Sheet How-To Flyer (TLO Event 2, May 20 2026)
 * Two identical half-sheets per letter page — cut horizontally to distribute.
 * Route: /flyer/catch-rate
 */

const GOLD = '#D4AF37';
const TEAL = '#2DD4BF';
const QR_IMAGE = '/trophycast-qr.svg';

const STEPS = [
  { num: '1', text: 'Find Emily at check-in · North Boat Ramp · 3:30–4:00 PM' },
  { num: '2', text: 'Pick species ($20 each) · Pay cash · Emily taps Mark Paid' },
  { num: '3', text: 'You get a text with 2 links — Link 1: account setup (first time only) · Link 2: submit a catch' },
  { num: '4', text: 'Catch a fish · open app · tap Log [Species] · record video on bump board · say the CODE WORD on camera' },
  { num: '5', text: 'Enter length · tap Submit · Emily reviews · you get a text: Approved or Rejected' },
];

function HalfSheet() {
  return (
    <div style={{
      width: 816,
      height: 504,
      background: '#050E18',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Top accent bar */}
      <div style={{ height: 5, background: `linear-gradient(90deg, ${GOLD}, ${TEAL}, ${GOLD})`, flexShrink: 0 }} />

      {/* Main content row */}
      <div style={{ display: 'flex', flex: 1, padding: '18px 28px 14px', gap: 24 }}>

        {/* Left column: logos + code word box */}
        <div style={{ width: 160, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {/* TLO logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tlo-logo.jpg" alt="Tightline Outdoors" width={150} style={{ borderRadius: 6, display: 'block' }} />

          {/* TC logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TC_LOGOS.icon48} alt="Trophy Cast" height={28} style={{ display: 'block', objectFit: 'contain' }} />
            <span style={{ color: 'rgba(200,215,225,0.5)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>TROPHY CAST</span>
          </div>

          {/* Code word box */}
          <div style={{
            width: '100%',
            border: `2px solid ${GOLD}`,
            borderRadius: 8,
            padding: '8px 10px',
            background: 'rgba(212,175,55,0.07)',
            textAlign: 'center',
          }}>
            <div style={{ color: GOLD, fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
              Tonight&apos;s Code Word
            </div>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 900, letterSpacing: 2, minHeight: 32 }}>&nbsp;</div>
            <div style={{ color: 'rgba(200,215,225,0.4)', fontSize: 8.5, marginTop: 4 }}>Say it on camera · no word = rejection</div>
          </div>

          {/* QR */}
          <div style={{ background: '#fff', borderRadius: 8, padding: 6, display: 'inline-block' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QR_IMAGE} alt="QR code" width={80} height={80} style={{ display: 'block' }} />
          </div>
          <span style={{ color: 'rgba(200,215,225,0.35)', fontSize: 9, textAlign: 'center' }}>trophycast.app/join/tlo</span>
        </div>

        {/* Right column: title + steps */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: TEAL, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>
              Tightline Outdoors · Catch Rate Series · Event 2 of 9
            </div>
            <h1 style={{
              fontSize: 30, fontWeight: 900, margin: 0, lineHeight: 1.05, letterSpacing: '-0.5px',
              background: `linear-gradient(90deg, ${GOLD} 0%, #F0D060 60%, ${TEAL} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              How to Submit Your Catch
            </h1>
            <div style={{ color: 'rgba(200,215,225,0.55)', fontSize: 11, marginTop: 4 }}>
              Chatfield · North Boat Ramp · 4:00–8:00 PM · Bass · Walleye · Trout · $20/species
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
            {STEPS.map((step, idx) => (
              <div key={step.num} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                background: 'rgba(10,22,36,0.8)',
                borderLeft: `3px solid ${idx % 2 === 0 ? GOLD : TEAL}`,
                borderRadius: '0 6px 6px 0',
                padding: '7px 12px',
              }}>
                <div style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                  background: idx % 2 === 0 ? 'rgba(212,175,55,0.2)' : 'rgba(45,212,191,0.2)',
                  border: `1.5px solid ${idx % 2 === 0 ? GOLD : TEAL}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 900, color: idx % 2 === 0 ? GOLD : TEAL,
                }}>
                  {step.num}
                </div>
                <span style={{ fontSize: 12.5, color: 'rgba(220,230,240,0.9)', lineHeight: 1.5 }}>{step.text}</span>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div style={{ marginTop: 10, color: 'rgba(200,215,225,0.35)', fontSize: 9.5 }}>
            Questions? Find Emily · tightlineoutdoors.com · 720.775.7770
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${GOLD}, ${TEAL}, ${GOLD})`, flexShrink: 0 }} />
    </div>
  );
}

export default function CatchRateFlyerPage() {
  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #000 !important; margin: 0; padding: 0; }
          .page-wrap { padding: 0 !important; background: #000 !important; }
          .cut-line { border-top: 1px dashed #555 !important; }
        }
        @page { size: letter portrait; margin: 0; }
      `}</style>

      {/* Controls */}
      <div className="no-print" style={{
        background: '#060F16', borderBottom: '1px solid rgba(212,175,55,0.18)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ color: '#C9D3DA', fontSize: 13 }}>
          🎣 <strong style={{ color: '#F5F8FA' }}>Catch Rate Half-Sheet Flyer</strong> — two per page, cut in the middle
        </span>
        <button
          onClick={handlePrint}
          style={{
            marginLeft: 'auto', background: GOLD, border: 'none', borderRadius: 8,
            color: '#0A1520', padding: '6px 18px', fontSize: 12, cursor: 'pointer', fontWeight: 800,
          }}
        >
          🖨 Print / Save PDF
        </button>
      </div>

      {/* Page preview */}
      <div className="page-wrap" style={{
        minHeight: '100vh', background: '#040C14',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 16px 64px', gap: 0,
      }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
          <HalfSheet />
          {/* Cut line */}
          <div className="cut-line" style={{
            borderTop: '2px dashed rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '4px 0', background: '#040C14',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>✂ cut here</span>
          </div>
          <HalfSheet />
        </div>

        <p className="no-print" style={{ color: 'rgba(200,215,225,0.3)', fontSize: 11, marginTop: 16, textAlign: 'center' }}>
          Print this page or Ctrl+P → Save as PDF. Cut along the dashed line to make two flyers.
        </p>
      </div>
    </>
  );
}
