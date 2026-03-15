'use client';

import { useState } from 'react';
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
const CREAM  = '#F5F1E6';
const SLATE  = '#6B8494';
const LIGHT_TEAL = '#D4EDE6';      // visible turquoise for panel fills
const MID_TEAL   = '#B8DDD3';      // stronger turquoise accent/borders
const NAVY_LIGHT = '#243E50';     // softer navy for strips
const WHITE  = '#FFFFFF';
const PAGE_WIDTH_IN = 11;
const PAGE_HEIGHT_IN = 8.5;
const PAGE_FRAME_SIDE_IN = 0.13;
const PAGE_FRAME_TOP_IN = 0.13;
const PAGE_FRAME_BOTTOM_IN = 0.13;
const CENTER_GAP_IN = 0.5;

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
        overflow: hidden !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        break-after: avoid-page !important;
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
          <div style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            padding: `${PAGE_FRAME_TOP_IN}in ${PAGE_FRAME_SIDE_IN}in ${PAGE_FRAME_BOTTOM_IN}in`,
            display: 'grid',
            gridTemplateColumns: `1fr ${CENTER_GAP_IN}in 1fr`,
            gap: 0,
          }}>
            <FlyerCard />
            {/* Center fold/cut guide — visual gap lives inside the page so screen and print match */}
            <div
              className="cut-guide"
              style={{
                width: `${CENTER_GAP_IN}in`,
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
        <div style={{ paddingBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <div style={{ width: 62, height: 78, flexShrink: 0, overflow: 'hidden' }}>
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
            <div style={{ width: '100%', maxWidth: 300, height: 56, overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/TrophyCast_Wordmark_transparent.png"
                alt="Trophy Cast"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'left center',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: 12,
          display: 'grid',
          gridTemplateColumns: '1fr 170px',
          gap: 16,
          alignItems: 'end',
        }}>
          <div>
            <p style={{ fontSize: 8, fontWeight: 800, color: TEAL, margin: '0 0 3px', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Your water. Your patterns. Your coach.
            </p>
            <p style={{ fontSize: 27, fontWeight: 900, color: NAVY, margin: 0, lineHeight: 1.05, letterSpacing: '-1px' }}>
              It gets smarter
            </p>
            <p style={{ fontSize: 27, fontWeight: 900, color: GOLD, margin: '1px 0 0', lineHeight: 1.05, letterSpacing: '-1px' }}>
              the more you fish.
            </p>
          </div>

          <div style={{
            paddingLeft: 12,
            borderLeft: '2px solid rgba(59,140,127,0.35)',
          }}>
            <p style={{ fontSize: 10.5, fontWeight: 800, color: NAVY, margin: '0 0 3px' }}>
              Not another fishing app.
            </p>
            <p style={{ fontSize: 9.5, color: NAVY, margin: 0, lineHeight: 1.32, opacity: 0.74, fontFamily: "'Raleway', sans-serif" }}>
              Trophy Cast learns your patterns, remembers what you forgot, and coaches you to catch more fish.
            </p>
          </div>
        </div>
      </div>

      {/* Teal/gold divider */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${TEAL}, ${GOLD})`, flexShrink: 0 }} />

      {/* How it works strip */}
      <div style={{
        background: NAVY_LIGHT, padding: '4px 20px 5px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 9.5, fontWeight: 900, color: GOLD, letterSpacing: '0.16em', textTransform: 'uppercase' }}>How it works</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { num: '1', text: 'Plan your trip — advanced weather by TC Coach' },
            { num: '2', text: 'Log a catch in under 15 seconds' },
            { num: '3', text: 'Review your voice log anywhere' },
          ].map((step, i, arr) => (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                minWidth: 19, height: 19, borderRadius: 999,
                background: GOLD, color: NAVY,
                fontSize: 9, fontWeight: 900,
                lineHeight: '19px', textAlign: 'center', flexShrink: 0,
              }}>{step.num}</span>
              <span style={{ fontSize: 10.5, color: CREAM, fontWeight: 700, fontFamily: "'Raleway', sans-serif", whiteSpace: 'nowrap' }}>{step.text}</span>
              {i < arr.length - 1 && (
                <span style={{ color: GOLD, fontSize: 12, fontWeight: 900 }}>→</span>
              )}
            </div>
          ))}
          <span style={{ color: GOLD, fontSize: 12, fontWeight: 900 }}>→</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { num: '4', text: 'Your coach learns your patterns' },
            { num: '5', text: 'Smarter coach. Smarter angler.' },
          ].map((step, i, arr) => (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                minWidth: 19, height: 19, borderRadius: 999,
                background: GOLD, color: NAVY,
                fontSize: 9, fontWeight: 900,
                lineHeight: '19px', textAlign: 'center', flexShrink: 0,
              }}>{step.num}</span>
              <span style={{ fontSize: 10.5, color: CREAM, fontWeight: 700, fontFamily: "'Raleway', sans-serif", whiteSpace: 'nowrap' }}>{step.text}</span>
              {i < arr.length - 1 && (
                <span style={{ color: GOLD, fontSize: 12, fontWeight: 900 }}>→</span>
              )}
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
        <div style={{ padding: '5px 20px 12px', display: 'flex', flexDirection: 'column', background: CREAM }}>
          <p style={{ fontSize: 11, fontWeight: 900, color: NAVY, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px', borderBottom: `2px solid ${GOLD}`, paddingBottom: 3 }}>
            No other app does this.
          </p>
          {[
            { num: '01', title: 'Every cast. Auto-captured.', desc: 'Just say: species, lure, color, weight & water temp. Trophy Cast auto-logs GPS, weather, barometric pressure & more — zero extra typing.' },
            { num: '02', title: 'Your coach. Built on YOUR data.', desc: 'TC Coach learns from YOUR catches only — combining your voice log with pressure, weather, moon phase, wind & more.' },
            { num: '03', title: 'Memory that never forgets.', desc: 'Every catch, every lure, every condition — logged and remembered. Your coach pulls from ALL of it to give you smarter advice every time out.' },
            { num: '04', title: 'Today\'s conditions vs. your history.', desc: 'Pressure dropping? Front moving in? TC Coach looks back at every time you fished conditions just like today — and tells you what worked.' },
            { num: '05', title: 'One app runs your whole club.', desc: 'Tournaments, meetings, Angler of the Year, live scoring, team chat — all in one spot. Never miss a tournament update again.' },
            { num: '06', title: 'Built by anglers. Your grind stays yours.', desc: 'Trained by real fishermen. Not algorithms. Not influencers. And your GPS locations, sweet spots, practice routes? They live on your phone. Only.' },
          ].map((f, i, arr) => (
            <div key={f.num} style={{
              display: 'flex', gap: 6, alignItems: 'flex-start',
              paddingBottom: i < arr.length - 1 ? 6 : 0,
              marginBottom: i < arr.length - 1 ? 6 : 0,
              borderBottom: i < arr.length - 1 ? '1px solid rgba(59,140,127,0.35)' : 'none',
            }}>
              <span style={{
                minWidth: 19, height: 19, borderRadius: 999,
                background: parseInt(f.num) % 2 === 1 ? GOLD : NAVY,
                color: parseInt(f.num) % 2 === 1 ? NAVY : GOLD, fontSize: 8.5, fontWeight: 900,
                lineHeight: '19px', textAlign: 'center', flexShrink: 0,
              }}>{f.num}</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: NAVY, margin: 0 }}>{f.title}</p>
                <p style={{ fontSize: 9.5, color: '#3a4a55', margin: 0, lineHeight: 1.3, fontWeight: 600, fontFamily: "'Raleway', sans-serif" }}>{f.desc}</p>
              </div>
            </div>
          ))}

        </div>

        {/* QR column */}
        <div style={{
          background: WHITE,
          borderLeft: `2px solid ${TEAL}`,
          padding: '10px 8px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-start',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 9, fontWeight: 900, color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>
            Scan to join
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://trophycast.app&color=0C1A23&bgcolor=FFFFFF&qzone=2"
            alt="QR — trophycast.app"
            width={84}
            height={84}
            style={{
              display: 'block', border: `2.5px solid ${GOLD}`,
              borderRadius: 8, marginBottom: 6,
            }}
          />
          <p style={{ fontSize: 13, fontWeight: 800, color: NAVY, margin: '0 0 2px' }}>
            trophycast.app
          </p>
          <p style={{ fontSize: 9, color: GOLD, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Free early access
          </p>

          {/* Clubs running on TC */}
          <div style={{ borderTop: `1px solid ${MID_TEAL}`, paddingTop: 5, width: '100%', marginBottom: 6 }}>
            <p style={{ fontSize: 8, fontWeight: 900, color: TEAL, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 3px' }}>Clubs on Trophy Cast</p>
            <p style={{ fontSize: 8.5, fontWeight: 800, color: NAVY, margin: '0 0 1px', fontFamily: "'Montserrat', sans-serif" }}>Denver BassMasters</p>
            <p style={{ fontSize: 8.5, fontWeight: 800, color: NAVY, margin: '0 0 1px', fontFamily: "'Montserrat', sans-serif" }}>DBM Juniors</p>
            <p style={{ fontSize: 8.5, fontWeight: 800, color: NAVY, margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Front Range Bass Club</p>
          </div>

          <div style={{ borderTop: `1px solid #eee`, paddingTop: 6, width: '100%' }}>
            <p style={{ fontSize: 8, fontWeight: 800, color: NAVY, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Works everywhere
            </p>
            <p style={{ fontSize: 8, color: '#5a6a75', margin: 0, lineHeight: 1.3, fontFamily: "'Raleway', sans-serif" }}>
              iPhone · Android · Desktop
            </p>
          </div>

          {/* Creed strip */}
          <div style={{
            marginTop: 'auto',
            marginLeft: -8, marginRight: -8, marginBottom: 12,
            background: NAVY_LIGHT,
            borderTop: `1px solid ${MID_TEAL}`,
            borderRadius: 6,
            padding: '6px 8px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 8.5, fontWeight: 900, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 2px' }}>The Grind is Yours.</p>
            <p style={{ fontSize: 8, color: CREAM, margin: 0, lineHeight: 1.3, fontFamily: "'Raleway', sans-serif" }}>Your spots. Your data. Sealed.</p>
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
