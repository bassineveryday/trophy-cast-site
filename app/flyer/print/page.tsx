'use client';

import React, { useState } from 'react';
import { toPng } from 'html-to-image';

/* ═══════════════════════════════════════════════════════════
   Trophy Cast — Print Flyer (2-up landscape)
   ───────────────────────────────────────────────────────────
   Layout: Letter landscape, two portrait flyer cards side by
   side with a centered fold/cut guide. Fold → cut → hand out.
   ═══════════════════════════════════════════════════════════ */

/* ── Brand palette ── */
const NAVY   = '#0C1A23';
const GOLD   = '#D4AF37';
const TEAL   = '#3B8C7F';          // from logo mark — the blue-green
const GREEN  = '#2E6E3D';
const CREAM  = '#F5F1E6';
const SLATE  = '#6B8494';
const TEXT_SECONDARY = '#546674';
const SURFACE_VARIANT = '#EEF2F4';
const LIGHT_TEAL = '#D4EDE6';      // visible turquoise for panel fills
const MID_TEAL   = '#B8DDD3';      // stronger turquoise accent/borders
const NAVY_LIGHT = '#243E50';     // softer navy for strips
const WHITE  = '#FFFFFF';
const CSS_DPI = 96;
const PAGE_WIDTH_IN = 11;
const PAGE_HEIGHT_IN = 8.5;
const PAGE_FRAME_SIDE_IN = 0.13;
const PAGE_FRAME_TOP_IN = 0.13;
const PAGE_FRAME_BOTTOM_IN = 0.13;
const CENTER_GAP_IN = 0.5;
const SCREEN_PAGE_FRAME_SIDE_PX = Math.round(PAGE_FRAME_SIDE_IN * CSS_DPI);
const SCREEN_PAGE_FRAME_TOP_PX = Math.round(PAGE_FRAME_TOP_IN * CSS_DPI);
const SCREEN_PAGE_FRAME_BOTTOM_PX = Math.round(PAGE_FRAME_BOTTOM_IN * CSS_DPI);
const SCREEN_CENTER_GAP_PX = Math.round(CENTER_GAP_IN * CSS_DPI);

type HowItWorksStep = {
  title: string;
  detail: React.ReactNode;
  icon?: string;
  imageSrc?: string;
  imageAlt?: string;
};

const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  { icon: '🎙️', title: 'Quick Capture', detail: <>Voice-log your <span style={{color:GOLD,fontWeight:700}}>catch</span> in under 15 seconds</> },
  { icon: '✨', title: 'TC Coach', detail: <>Learns your <span style={{color:TEAL,fontWeight:700}}>water</span>, <span style={{color:GREEN,fontWeight:700}}>gear</span>, and how you fish</> },
  { imageSrc: '/TrophyCast_FishMark_transparent.png', imageAlt: 'Trophy Cast fish mark', title: 'Level Up', detail: <>Build <span style={{color:GOLD,fontWeight:700}}>confidence</span>, fish smarter, become a better <span style={{color:GREEN,fontWeight:700}}>angler</span></> },
];

export default function PrintFlyerPage() {
  const [downloading, setDownloading] = useState(false);

  /* ── Brand fonts (Google Fonts) ── */
  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Raleway:wght@400;500;700&display=swap');`;

  /* ── Print-specific CSS ── */
  const printCSS = `
    ${fontImport}
    body > header, body > footer { display: none !important; }
    body > main {
      padding-top: 0 !important;
      background: #fff !important;
      min-height: auto !important;
    }
    @media print {
      html, body, .sheet, .sheet * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        forced-color-adjust: none !important;
      }
      html, body {
        background: #fff !important;
        margin: 0 !important; padding: 0 !important;
        height: auto !important; overflow: hidden !important;
      }
      body > header, body > footer, body > script, nav,
      next-route-announcer, .no-print {
        display: none !important;
      }
      body > main {
        padding: 0 !important;
        margin: 0 !important;
      }
      body > main > * { display: none !important; }
      body > main > .print-wrap { display: block !important; }
      .print-wrap {
        width: 11in !important;
        height: 8.5in !important;
        margin: 0 !important;
        display: block !important;
        background: #fff !important;
        padding: 0 !important;
        overflow: hidden !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .sheet {
        margin: 0 auto !important;
        width: ${PAGE_WIDTH_IN}in !important;
        height: ${PAGE_HEIGHT_IN}in !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        overflow: hidden !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        break-after: avoid-page !important;
      }
      .sheet-inner {
        padding: ${PAGE_FRAME_TOP_IN}in ${PAGE_FRAME_SIDE_IN}in ${PAGE_FRAME_BOTTOM_IN}in !important;
        grid-template-columns: 1fr ${CENTER_GAP_IN}in 1fr !important;
      }
      .cut-guide {
        width: 0.5in !important;
        border-left: none !important;
        padding: 0 !important;
        overflow: hidden !important;
        background: #fff !important;
        position: relative !important;
      }
      .cut-guide::after {
        content: '';
        position: absolute;
        top: 0; bottom: 0; left: 50%;
        border-left: 1.5px dashed rgba(12,26,35,0.2);
      }
      .cut-guide * { display: none !important; }
    }
    @page { size: letter landscape; margin: 0; }
  `;

  const handlePrint = () => window.print();

  const handleDownloadPng = async () => {
    const node = document.getElementById('print-sheet');
    if (!node) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true });
      const link = document.createElement('a');
      link.download = 'trophy-cast-flyer-print.png';
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printCSS }} />

      {/* ── Controls bar (screen only) ── */}
      <div className="no-print" style={{
        background: NAVY, padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        borderBottom: `2px solid ${GOLD}`,
      }}>
        <div>
          <p style={{ color: CREAM, fontSize: 15, fontWeight: 800, margin: 0 }}>
            🖨 Print-Ready Flyer
          </p>
          <p style={{ color: SLATE, fontSize: 12, margin: '2px 0 0' }}>
            Two portrait flyers per landscape sheet · fold &amp; cut on center line
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <a href="/flyer" style={{
            color: GOLD, fontSize: 12, fontWeight: 600,
            textDecoration: 'none', padding: '6px 12px',
            border: `1px solid ${GOLD}`, borderRadius: 6,
          }}>← Dark version</a>
          <button onClick={handleDownloadPng} disabled={downloading} style={{
            background: TEAL, border: 'none', borderRadius: 6,
            color: WHITE, padding: '6px 14px', fontSize: 12,
            fontWeight: 700, cursor: downloading ? 'wait' : 'pointer',
            opacity: downloading ? 0.7 : 1,
          }}>{downloading ? '⏳ ...' : '⬇ PNG'}</button>
          <button onClick={handlePrint} style={{
            background: GOLD, border: 'none', borderRadius: 6,
            color: NAVY, padding: '6px 14px', fontSize: 12,
            fontWeight: 700, cursor: 'pointer',
          }}>🖨 Print / PDF</button>
        </div>
      </div>

      {/* ── Print tip ── */}
      <div className="no-print" style={{
        background: '#f0f7f5', padding: '10px 24px',
        fontSize: 13, color: NAVY, borderBottom: `1px solid ${MID_TEAL}`,
      }}>
        💡 <strong>Print tip:</strong> Ctrl+P → Orientation: Landscape → Margins: None → Scale: 100% → Background graphics: ON → Fold in half and cut on center guide.
      </div>

      {/* ── Sheet wrapper ── */}
      <div className="print-wrap" style={{
        background: '#e8e8e8', padding: '40px',
        display: 'flex', justifyContent: 'center',
      }}>
        {/* The actual printable sheet — letter landscape */}
        <div
          id="print-sheet"
          className="sheet"
          style={{
            width: `${PAGE_WIDTH_IN}in`,
            height: `${PAGE_HEIGHT_IN}in`,
            background: WHITE,
            position: 'relative',
            borderRadius: 4,
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            fontFamily: "'Montserrat', 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          <div
            className="sheet-inner"
            style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            padding: `${SCREEN_PAGE_FRAME_TOP_PX}px ${SCREEN_PAGE_FRAME_SIDE_PX}px ${SCREEN_PAGE_FRAME_BOTTOM_PX}px`,
            display: 'grid',
            gridTemplateColumns: `1fr ${SCREEN_CENTER_GAP_PX}px 1fr`,
            gap: 0,
          }}>
            <FlyerCard />
            {/* Center fold/cut guide — visual gap lives inside the page so screen and print match */}
            <div
              className="cut-guide"
              style={{
                width: `${SCREEN_CENTER_GAP_PX}px`,
                height: '100%',
                background: WHITE,
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, bottom: 0, left: '50%',
                borderLeft: '1.5px dashed rgba(12,26,35,0.2)',
                pointerEvents: 'none',
              }} />
            </div>
            <FlyerCard />
          </div>
        </div>
      </div>

      {/* ── Workflow instructions (screen only) ── */}
      <div className="no-print" style={{
        background: NAVY, padding: '20px 32px', maxWidth: 700,
        margin: '0 auto 40px', borderRadius: 8,
      }}>
        <p style={{ color: GOLD, fontWeight: 700, fontSize: 13, margin: '0 0 8px' }}>
          📸 Print → Fold → Cut → Hand out
        </p>
        <ol style={{ color: SLATE, fontSize: 13, margin: 0, paddingLeft: 18, lineHeight: 2 }}>
          <li>Click <strong style={{ color: CREAM }}>Print / PDF</strong> above</li>
          <li>Orientation: <strong style={{ color: CREAM }}>Landscape</strong> · Margins: <strong style={{ color: CREAM }}>None</strong> · Scale: <strong style={{ color: CREAM }}>100%</strong> · Background graphics: <strong style={{ color: CREAM }}>On</strong></li>
          <li>Print on regular white letter paper</li>
          <li>Fold in half, cut on the dashed center line → <strong style={{ color: CREAM }}>2 flyers per sheet</strong></li>
        </ol>
      </div>
    </>
  );
}


/* ═══════════════════════════════════════════════
   FLYER CARD — one portrait half of the sheet
   ═══════════════════════════════════════════════ */
function FlyerCard() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box',
      outline: `3px solid ${TEAL}`,
      outlineOffset: '-3px',
      overflow: 'hidden',
    }}>

      {/* Gold accent line */}
      <div style={{ height: 4, background: GOLD, flexShrink: 0 }} />

      {/* Header + hero */}
      <div style={{
        background: `linear-gradient(180deg, ${LIGHT_TEAL} 0%, ${MID_TEAL} 40%, ${LIGHT_TEAL} 100%)`,
        padding: '14px 20px 12px',
        flexShrink: 0,
      }}>
        {/* Logo row — full width for wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 75, height: 94, flexShrink: 0, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/TrophyCast_FishMark_transparent.png"
              alt="Trophy Cast fish mark"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center center',
                display: 'block',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ width: 320 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/TrophyCast_Wordmark_transparent.png"
                alt="Trophy Cast"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>

        {/* Tagline + TC Coach row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 4, paddingLeft: 102 }}>
          <p style={{ fontSize: 10, color: TEAL, fontWeight: 700, margin: 0, whiteSpace: 'pre-line', lineHeight: 1.3, letterSpacing: '0.04em' }}>
            {'Your waters.\nYour catches.\nYour coach.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 999,
              background: 'rgba(46,110,61,0.12)', color: GREEN,
              fontSize: 12, fontWeight: 900, lineHeight: '22px',
              textAlign: 'center', flexShrink: 0, marginTop: 1,
            }}>✨</span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: NAVY, margin: 0 }}>TC Coach</p>
              <p style={{ fontSize: 7, color: GREEN, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '1px 0 4px' }}>
                Powered by your catch history
              </p>
              <p style={{ fontSize: 9.5, fontWeight: 900, color: NAVY, margin: 0, lineHeight: 1.2 }}>
                It gets smarter{' '}
                <span style={{ color: GOLD }}>the more you fish.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teal/gold divider */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${TEAL}, ${GOLD})`, flexShrink: 0 }} />

      {/* How it works strip */}
      <div style={{
        background: NAVY_LIGHT, padding: '9px 20px 10px',
        display: 'flex', flexDirection: 'column', gap: 8,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 9.5, fontWeight: 900, color: GOLD, letterSpacing: '0.16em', textTransform: 'uppercase' }}>How it works</span>
          <span style={{ fontSize: 8, color: CREAM, opacity: 0.78, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Log fast → Learn your water → Level up</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div key={step.title} style={{
              background: 'rgba(245,241,230,0.08)',
              border: '1px solid rgba(212,175,55,0.18)',
              borderRadius: 12,
              padding: '8px 8px 7px',
              minHeight: 58,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: 'rgba(212,175,55,0.18)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  flexShrink: 0,
                }}>
                  {step.imageSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={step.imageSrc}
                      alt={step.imageAlt ?? step.title}
                      style={{
                        width: 15,
                        height: 15,
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  ) : step.icon}
                </span>
                <span style={{ fontSize: 10.5, color: CREAM, fontWeight: 800, letterSpacing: '0.02em' }}>{step.title}</span>
              </div>
              <span style={{ fontSize: 8.5, color: '#C9D3DA', lineHeight: 1.25, fontWeight: 600, fontFamily: "'Raleway', sans-serif" }}>{step.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features + QR grid */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '1fr 120px',
        gap: 0, minHeight: 0,
      }}>

        {/* Feature list */}
        <div style={{ padding: '10px 20px 14px', display: 'flex', flexDirection: 'column', background: `linear-gradient(180deg, ${CREAM} 0%, #FBF8F0 100%)` }}>
          <p style={{ fontSize: 12, fontWeight: 900, color: NAVY, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 6px', borderBottom: `2px solid ${GOLD}`, paddingBottom: 4 }}>
            No other app does this.
          </p>
          {[
            { num: '01', title: 'Every cast. Auto-captured.', desc: <>Just say: <span style={{color:GREEN,fontWeight:700}}>species</span>, <span style={{color:TEAL,fontWeight:700}}>lure</span>, <span style={{color:GOLD,fontWeight:700}}>color</span>, <span style={{color:SLATE,fontWeight:700}}>weight</span> &amp; <span style={{color:TEAL,fontWeight:700}}>water temp</span>. Trophy Cast auto-logs <span style={{color:TEAL,fontWeight:700}}>GPS</span>, <span style={{color:NAVY_LIGHT,fontWeight:700}}>weather</span>, <span style={{color:SLATE,fontWeight:700}}>barometric pressure</span> &amp; more — zero extra typing.</> },
            { num: '02', title: 'Your coach. Built on YOUR data.', desc: <><span style={{color:TEAL,fontWeight:700}}>TC Coach</span> learns from YOUR <span style={{color:GREEN,fontWeight:700}}>catches</span> only — combining your <span style={{color:TEAL,fontWeight:700}}>water</span>, <span style={{color:GREEN,fontWeight:700}}>gear</span>, <span style={{color:TEAL,fontWeight:700}}>technique</span>, <span style={{color:SLATE,fontWeight:700}}>pressure</span>, <span style={{color:NAVY_LIGHT,fontWeight:700}}>weather</span>, <span style={{color:GOLD,fontWeight:700}}>moon phase</span>, <span style={{color:TEAL,fontWeight:700}}>wind</span> &amp; more.</> },
            { num: '03', title: 'Memory that never forgets.', desc: <>Every <span style={{color:GREEN,fontWeight:700}}>catch</span>, every <span style={{color:TEAL,fontWeight:700}}>lure</span>, every <span style={{color:NAVY_LIGHT,fontWeight:700}}>condition</span> — logged and connected. Your coach pulls it all together to give you <span style={{color:GOLD,fontWeight:700}}>smarter advice</span> every time out.</> },
            { num: '04', title: "Today's conditions vs. your history.", desc: <><span style={{color:SLATE,fontWeight:700}}>Pressure</span> dropping? <span style={{color:TEAL,fontWeight:700}}>Front</span> moving in? <span style={{color:TEAL,fontWeight:700}}>TC Coach</span> looks back at every time you fished conditions just like today — and tells you what worked.</> },
            { num: '05', title: 'One app runs your whole club.', desc: <><span style={{color:GOLD,fontWeight:700}}>Tournaments</span>, <span style={{color:TEAL,fontWeight:700}}>meetings</span>, <span style={{color:GREEN,fontWeight:700}}>Angler of the Year</span>, <span style={{color:GOLD,fontWeight:700}}>live scoring</span>, <span style={{color:TEAL,fontWeight:700}}>team chat</span> — all in one spot. Never miss a <span style={{color:GOLD,fontWeight:700}}>tournament</span> update again.</> },
            { num: '06', title: 'Built by anglers. Your grind stays yours.', desc: <>Built by real fishermen. Your <span style={{color:TEAL,fontWeight:700}}>GPS locations</span>, <span style={{color:GREEN,fontWeight:700}}>sweet spots</span>, and <span style={{color:TEAL,fontWeight:700}}>practice routes</span> stay on your phone. Period.</> },
          ].map((f, i, arr) => (
            <div key={f.num} style={{
              display: 'flex', gap: 6, alignItems: 'flex-start',
              paddingBottom: i < arr.length - 1 ? 8 : 0,
              marginBottom: i < arr.length - 1 ? 8 : 0,
              borderBottom: i < arr.length - 1 ? '1px solid rgba(59,140,127,0.35)' : 'none',
            }}>
              <span style={{
                minWidth: 19, height: 19, borderRadius: 999,
                background: parseInt(f.num) % 2 === 1 ? GOLD : NAVY,
                color: parseInt(f.num) % 2 === 1 ? NAVY : GOLD, fontSize: 8.5, fontWeight: 900,
                lineHeight: '19px', textAlign: 'center', flexShrink: 0,
              }}>{f.num}</span>
              <div>
                <p style={{ fontSize: 11.5, fontWeight: 800, color: NAVY, margin: 0 }}>{f.title}</p>
                <p style={{ fontSize: 10, color: '#3a4a55', margin: 0, lineHeight: 1.35, fontWeight: 600, fontFamily: "'Raleway', sans-serif" }}>{f.desc}</p>
              </div>
            </div>
          ))}

        </div>

        {/* QR column */}
        <div style={{
          background: '#FAFCFB',
          borderLeft: `3px solid ${TEAL}`,
          padding: '0 8px 0',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between',
          textAlign: 'center',
        }}>
          {/* Top: URL + QR + tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 900, color: NAVY, margin: '0 0 5px', letterSpacing: '0.02em' }}>
              trophycast.app
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/trophycast-qr.svg"
              alt="QR — trophycast.app"
              width={88}
              height={88}
              style={{
                display: 'block',
                border: `2.5px solid ${GOLD}`,
                borderRadius: 8,
                marginBottom: 5,
              }}
            />
            <p style={{ fontSize: 8.5, color: GOLD, fontWeight: 800, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Free Early Access
            </p>
            <p style={{ fontSize: 8.5, color: NAVY, fontWeight: 700, margin: 0, fontFamily: "'Raleway', sans-serif" }}>
              Join the waitlist now.
            </p>
          </div>

          {/* Middle: Clubs */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: 10, fontWeight: 900, color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>
              Live clubs
            </p>
            {[
              { name: 'Denver BassMasters', logo: '/dbm-logo-transparent.png', width: 140, height: 56, mb: 2 },
              { name: 'DBM Juniors', logo: "/Denver Bassmaster Junior's logo transparent..png", width: 130, height: 50, mb: 6 },
              { name: 'Front Range Bass Club', logo: '/FRBC Logo.png', width: 110, height: 50, mb: 0 },
            ].map((club) => (
              <div key={club.name} style={{ marginBottom: club.mb }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={club.logo} alt={club.name} style={{ width: club.width, height: club.height, objectFit: 'contain', display: 'block' }} />
              </div>
            ))}
            <p style={{ fontSize: 8, color: '#8AACB8', fontWeight: 700, margin: '6px 0 1px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Works everywhere
            </p>
            <p style={{ fontSize: 7.5, color: '#8AACB8', margin: 0, fontFamily: "'Raleway', sans-serif", lineHeight: 1.3 }}>
              iPhone · Android · Desktop
            </p>
          </div>

          {/* CTA — bottom */}
          <div style={{
            width: 'calc(100% + 16px)',
            marginLeft: -8, marginRight: -8,
            background: GOLD,
            padding: '8px 8px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 9, fontWeight: 900, color: NAVY, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 1px' }}>Start Fishing Smarter</p>
            <p style={{ fontSize: 8, color: NAVY, margin: 0, fontWeight: 700, fontFamily: "'Raleway', sans-serif" }}>Join the waitlist now.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: NAVY_LIGHT, padding: '6px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ color: GOLD, fontSize: 9.5, fontWeight: 800, letterSpacing: '0.08em' }}>Trophy Cast, Inc.</span>
        <span style={{ color: CREAM, fontSize: 8.5, opacity: 0.6, fontFamily: "'Raleway', sans-serif" }}>© 2026 · Built for anglers, by anglers.</span>
        <span style={{ color: GOLD, fontSize: 9.5, fontWeight: 800 }}>www.trophycast.app</span>
      </div>
    </div>
  );
}
