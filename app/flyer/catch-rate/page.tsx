'use client';

import { TC_LOGOS } from '@/lib/brandAssets';

/**
 * Catch Rate Tournament — Half-Sheet How-To Flyer (TLO Event 2, May 20 2026)
 * Two identical half-sheets per letter page — cut horizontally to distribute.
 * Route: /flyer/catch-rate
 *
 * Print notes:
 *  - White background, dark text via @media print overrides
 *  - Navbar hidden on print
 *  - QR links to https://trophy-cast-mvp-v2.vercel.app/
 */

const GOLD = '#D4AF37';
const TEAL = '#2DD4BF';
const GOLD_DARK = '#B8960C';   // darker gold — readable on white paper
const TEAL_DARK = '#0D7E78';   // darker teal — readable on white paper

// QR code pointing to the Trophy Cast app
const QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Ftrophy-cast-mvp-v2.vercel.app%2F&bgcolor=ffffff&color=000000&margin=4';

const STEPS = [
  { num: '1', text: 'Find Emily at check-in · North Boat Ramp · 3:30–4:00 PM' },
  { num: '2', text: 'Pick species ($20 each) · Pay cash · Emily taps Mark Paid' },
  { num: '3', text: 'You get a text with 2 links — Link 1: account setup (first time only) · Link 2: submit a catch' },
  { num: '4', text: 'Catch a fish · open app · tap Log [Species] · record video on bump board · say the CODE WORD on camera' },
  { num: '5', text: 'Enter length · tap Submit · Emily reviews · you get a text: Approved or Rejected' },
];

function HalfSheet() {
  return (
    <div className="half-sheet" style={{
      width: 816,
      height: 504,
      background: '#050E18',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Top accent bar */}
      <div className="accent-bar" style={{ height: 5, background: `linear-gradient(90deg, ${GOLD}, ${TEAL}, ${GOLD})`, flexShrink: 0 }} />

      {/* Main content row */}
      <div style={{ display: 'flex', flex: 1, padding: '18px 28px 14px', gap: 24 }}>

        {/* Left column */}
        <div style={{ width: 170, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {/* TLO logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tlo-logo.jpg" alt="Tightline Outdoors" width={160} style={{ borderRadius: 6, display: 'block' }} />

          {/* TC logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 2 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TC_LOGOS.icon48} alt="Trophy Cast" height={56} style={{ display: 'block', objectFit: 'contain' }} />
            <span className="logo-label" style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>TROPHY CAST</span>
          </div>

          {/* Code word box */}
          <div className="codeword-box" style={{
            width: '100%',
            border: `2px solid ${GOLD}`,
            borderRadius: 8,
            padding: '8px 10px',
            background: 'rgba(212,175,55,0.07)',
            textAlign: 'center',
          }}>
            <div className="codeword-label" style={{ color: GOLD, fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
              Tonight&apos;s Code Word
            </div>
            <div className="codeword-blank" style={{ color: '#fff', fontSize: 22, fontWeight: 900, letterSpacing: 2, minHeight: 32 }}>&nbsp;</div>
            <div className="codeword-hint" style={{ color: 'rgba(200,215,225,0.4)', fontSize: 8.5, marginTop: 4 }}>Say it on camera · no word = rejection</div>
          </div>

          {/* QR */}
          <div style={{ background: '#fff', borderRadius: 8, padding: 5, display: 'inline-block' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QR_URL} alt="Scan to open Trophy Cast" width={85} height={85} style={{ display: 'block' }} />
          </div>
          <span className="qr-label" style={{ color: 'rgba(200,215,225,0.35)', fontSize: 9, textAlign: 'center' }}>trophycast.app</span>
        </div>

        {/* Right column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ marginBottom: 12 }}>
            <div className="event-label" style={{ color: TEAL, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>
              Tightline Outdoors · Catch Rate Series · Event 2 of 9
            </div>
            <h1 className="headline" style={{
              fontSize: 30, fontWeight: 900, margin: 0, lineHeight: 1.05, letterSpacing: '-0.5px',
              background: `linear-gradient(90deg, ${GOLD} 0%, #F0D060 60%, ${TEAL} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              How to Submit Your Catch
            </h1>
            <div className="subhead" style={{ color: 'rgba(200,215,225,0.55)', fontSize: 11, marginTop: 4 }}>
              Chatfield · North Boat Ramp · 4:00–8:00 PM · Bass · Walleye · Trout · $20/species
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
            {STEPS.map((step, idx) => (
              <div key={step.num} className={`step-card step-${idx % 2 === 0 ? 'gold' : 'teal'}`} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                background: 'rgba(10,22,36,0.8)',
                borderLeft: `3px solid ${idx % 2 === 0 ? GOLD : TEAL}`,
                borderRadius: '0 6px 6px 0',
                padding: '7px 12px',
              }}>
                <div className={`step-num step-num-${idx % 2 === 0 ? 'gold' : 'teal'}`} style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                  background: idx % 2 === 0 ? 'rgba(212,175,55,0.2)' : 'rgba(45,212,191,0.2)',
                  border: `1.5px solid ${idx % 2 === 0 ? GOLD : TEAL}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 900, color: idx % 2 === 0 ? GOLD : TEAL,
                }}>
                  {step.num}
                </div>
                <span className="step-text" style={{ fontSize: 12.5, color: 'rgba(220,230,240,0.9)', lineHeight: 1.5 }}>{step.text}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="footer-text" style={{ marginTop: 10, color: 'rgba(200,215,225,0.35)', fontSize: 9.5 }}>
            Questions? Find Emily · tightlineoutdoors.com · 720.775.7770
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="accent-bar" style={{ height: 4, background: `linear-gradient(90deg, ${GOLD}, ${TEAL}, ${GOLD})`, flexShrink: 0 }} />
    </div>
  );
}

export default function CatchRateFlyerPage() {
  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        /* ── SCREEN ─────────────────────────────────────────── */
        .half-sheet { color-adjust: exact; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        /* ── PRINT ──────────────────────────────────────────── */
        @media print {
          /* Hide site chrome */
          .no-print { display: none !important; }
          nav, header, footer { display: none !important; }
          body { background: #fff !important; margin: 0; padding: 0; }
          .page-wrap { padding: 0 !important; background: #fff !important; }

          /* Cut line */
          .cut-line { border-top: 1px dashed #aaa !important; background: #fff !important; }
          .cut-line span { color: #aaa !important; }

          /* Half-sheet container → white card */
          .half-sheet {
            background: #fff !important;
            border: 1px solid #ccc !important;
            color: #111 !important;
          }

          /* Accent bars — keep gold */
          .accent-bar { background: ${GOLD_DARK} !important; }

          /* Logos */
          .logo-label { color: #111 !important; font-weight: 800 !important; }

          /* Code word box */
          .codeword-box { background: #fffbee !important; border-color: ${GOLD_DARK} !important; }
          .codeword-label { color: ${GOLD_DARK} !important; }
          .codeword-blank { color: #111 !important; }
          .codeword-hint { color: #666 !important; }
          .qr-label { color: #555 !important; }

          /* Event label */
          .event-label { color: ${TEAL_DARK} !important; }

          /* Headline — force visible gradient fallback */
          .headline {
            background: none !important;
            -webkit-text-fill-color: #111 !important;
            color: #111 !important;
          }

          .subhead { color: #444 !important; }

          /* Step cards */
          .step-card { background: #f7f7f7 !important; }
          .step-card.step-gold { border-left-color: ${GOLD_DARK} !important; }
          .step-card.step-teal { border-left-color: ${TEAL_DARK} !important; }
          .step-num-gold { color: ${GOLD_DARK} !important; border-color: ${GOLD_DARK} !important; background: #fdf8e6 !important; }
          .step-num-teal { color: ${TEAL_DARK} !important; border-color: ${TEAL_DARK} !important; background: #e6f7f6 !important; }
          .step-text { color: #111 !important; }

          .footer-text { color: #555 !important; }
        }

        @page { size: letter portrait; margin: 0.2in; }
      `}</style>

      {/* Controls — screen only */}
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
