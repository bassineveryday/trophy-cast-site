'use client';

import { useState } from 'react';
import { toPng } from 'html-to-image';

/**
 * Denver BassMasters — Home Printer Flyer (2-up on letter)
 * ─────────────────────────────────────────────────────────
 * Brand palette: #88AC2E (lime green), #000000 (black), #FFFFFF
 * Dark left panel, white right column with recruitment bullets.
 * QR code → https://www.denverbassmasters.com/join-now
 */

export default function DBMPrintFlyerPage() {
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => window.print();

  const handleDownloadPng = async () => {
    const node = document.getElementById('dbm-print-sheet');
    if (!node) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true });
      const link = document.createElement('a');
      link.download = 'denver-bassmasters-flyer-print.png';
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
          body { background: #fff !important; margin: 0; padding: 0; }
          .print-wrap { padding: 0 !important; background: #fff !important; }
          .sheet { box-shadow: none !important; border: none !important; }
        }
        @page { size: letter portrait; margin: 0.25in; }
      `}</style>

      {/* Controls bar */}
      <div className="no-print" style={{
        background: '#0C0F08', borderBottom: '1px solid rgba(136,172,46,0.2)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <div>
          <span style={{ color: '#F5F5EE', fontWeight: 700, fontSize: 14 }}>🖨 DBM Print-Ready Flyer</span>
          <span style={{ color: '#8A9E6A', fontSize: 12, marginLeft: 10 }}>Dark green + white · 2 half-pages · Cut on dashed line</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="/flyer/dbm" style={{
            background: 'rgba(136,172,46,0.1)', border: '1px solid rgba(136,172,46,0.35)',
            borderRadius: 8, color: '#B5D45A', padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none',
          }}>← Dark version</a>
          <button onClick={handleDownloadPng} disabled={downloading} style={{
            background: '#5D6D24', border: 'none', borderRadius: 8, color: '#fff',
            padding: '6px 18px', fontSize: 12, cursor: downloading ? 'wait' : 'pointer', fontWeight: 800, opacity: downloading ? 0.7 : 1,
          }}>{downloading ? '⏳ Generating...' : '⬇ Download PNG'}</button>
          <button onClick={handlePrint} style={{
            background: '#88AC2E', border: 'none', borderRadius: 8, color: '#000',
            padding: '6px 18px', fontSize: 12, cursor: 'pointer', fontWeight: 800,
          }}>🖨 Print / Save PDF</button>
        </div>
      </div>

      <div className="no-print" style={{
        background: 'rgba(136,172,46,0.07)', borderBottom: '1px solid rgba(136,172,46,0.12)',
        padding: '8px 24px', fontSize: 12, color: '#8A9E6A',
      }}>
        💡 <strong style={{ color: '#C9D3CA' }}>Print tip:</strong> Ctrl+P → Margins: Minimum → Scale: 100% → Print. Cut on dashed line for 2 flyers per sheet.
      </div>

      {/* Page wrapper */}
      <div className="print-wrap" style={{
        minHeight: '100vh', background: '#d8ddd0',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-start', padding: '32px 16px 64px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <div id="dbm-print-sheet" className="sheet" style={{
          width: 816, background: '#ffffff',
          border: '1px solid #c8d4b8', borderRadius: 4,
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)', overflow: 'hidden',
        }}>
          <DBMHalfFlyer />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', background: '#fff' }}>
            <div style={{ flex: 1, borderTop: '2px dashed #a8b898' }} />
            <span style={{ fontSize: 10, color: '#a8b898', fontWeight: 600, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>✂ CUT HERE</span>
            <div style={{ flex: 1, borderTop: '2px dashed #a8b898' }} />
          </div>
          <DBMHalfFlyer />
        </div>

        <div className="no-print" style={{
          marginTop: 24, maxWidth: 816, width: '100%',
          background: 'rgba(12,15,8,0.88)', border: '1px solid rgba(136,172,46,0.18)',
          borderRadius: 10, padding: '18px 24px',
        }}>
          <p style={{ color: '#88AC2E', fontWeight: 700, fontSize: 13, margin: '0 0 8px' }}>
            📸 Workflow: Print → Cut → Hand out at meetings &amp; events
          </p>
          <ol style={{ color: '#8A9E6A', fontSize: 13, margin: 0, paddingLeft: 18, lineHeight: 2.1 }}>
            <li>Click <strong style={{ color: '#F5F5EE' }}>&ldquo;Print / Save PDF&rdquo;</strong> above</li>
            <li>Set margins to <strong style={{ color: '#F5F5EE' }}>Minimum</strong>, scale <strong style={{ color: '#F5F5EE' }}>100%</strong></li>
            <li>Print on regular white letter paper</li>
            <li>Cut along the dashed line — <strong style={{ color: '#F5F5EE' }}>2 flyers per sheet</strong></li>
            <li>30 flyers = 15 sheets 🎉</li>
          </ol>
        </div>
      </div>
    </>
  );
}

function DBMHalfFlyer() {
  return (
    <div style={{
      width: '100%', minHeight: 504, background: '#ffffff',
      display: 'flex', flexDirection: 'row', position: 'relative', overflow: 'hidden',
    }}>

      {/* LEFT PANEL — forest green gradient */}
      <div style={{
        width: 224, flexShrink: 0,
        background: 'linear-gradient(175deg, #1A3206 0%, #3A5C12 50%, #6A9020 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-start', gap: 14, padding: '26px 18px 22px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)', pointerEvents: 'none' }} />

        {/* Top section */}
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ width: 40, height: 3, background: '#88AC2E', borderRadius: 2, margin: '0 auto 16px' }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Loge%20Transparent%20background.png"
            alt="Denver BassMasters logo"
            height={68}
            style={{ display: 'block', margin: '0 auto 12px', objectFit: 'contain' }}
          />
          <h2 style={{ fontSize: 17, fontWeight: 900, color: '#F5F5EE', margin: '0 0 4px', lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '-0.3px', background: 'rgba(0,0,0,0.28)', borderRadius: 6, padding: '4px 10px', display: 'inline-block' }}>
            Denver<br />
            <span style={{ color: '#88AC2E' }}>Bass</span>
            <span style={{ color: '#D4AF37' }}>Masters</span>
          </h2>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', margin: '5px 0 0', fontStyle: 'italic', letterSpacing: '0.04em' }}>
            Building better anglers<br />since the early &lsquo;70s
          </p>
          <div style={{ width: 32, height: 1, background: 'rgba(136,172,46,0.35)', margin: '12px auto' }} />

          {/* Champion badge */}
          <div style={{
            background: 'rgba(0,0,0,0.32)', border: '1px solid rgba(212,175,55,0.55)',
            borderRadius: 8, padding: '7px 10px', fontSize: 9.5, color: '#D4AF37', fontWeight: 700, textAlign: 'center', lineHeight: 1.4,
          }}>
            🏆 Colorado Bass<br />Club Trophy<br />
            <span style={{ fontSize: 8.5, fontWeight: 400, color: 'rgba(212,175,55,0.65)' }}>2024–2025 Champions</span>
          </div>

          {/* App badge */}
          <div style={{
            marginTop: 8,
            background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(181,212,90,0.55)',
            borderRadius: 8, padding: '6px 10px', fontSize: 9, color: '#B5D45A', fontWeight: 700, textAlign: 'center', lineHeight: 1.4,
          }}>
            📱 Powered by<br />
            <span style={{ color: '#88AC2E', fontWeight: 800 }}>Trophy Cast</span>
          </div>
        </div>

        {/* QR code */}
        <div style={{ textAlign: 'center', marginTop: 'auto' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=https%3A%2F%2Fwww.denverbassmasters.com%2Fjoin-now&color=0E1109&bgcolor=FFFFFF&qzone=1"
            alt="QR code — denverbassmasters.com/join-now"
            width={108} height={108}
            style={{ display: 'block', margin: '0 auto 6px', border: '2px solid #88AC2E', borderRadius: 6, padding: 3, background: '#fff' }}
          />
          <p style={{ fontSize: 10.5, fontWeight: 800, color: '#F5F5EE', margin: '0 0 2px' }}>Join Today</p>
          <p style={{ fontSize: 8.5, color: 'rgba(181,212,90,0.5)', margin: 0 }}>Scan or visit<br />denverbassmasters.com</p>
        </div>
      </div>

      {/* VERTICAL DIVIDER */}
      <div style={{ width: 1, background: 'linear-gradient(to bottom, transparent, #88AC2E 20%, #D4AF37 50%, #88AC2E 80%, transparent)', flexShrink: 0 }} />

      {/* RIGHT COLUMN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '26px 30px 18px' }}>

        <div>
          {/* Headline */}
          <h1 style={{ fontSize: 27, fontWeight: 900, color: '#0C0F08', margin: '0 0 3px', lineHeight: 1.15, letterSpacing: '-0.5px' }}>
            You Don&rsquo;t Need<br />a Boat.
          </h1>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: '#5D6D24', margin: '0 0 3px' }}>Just a love for bass fishing.</p>
          <p style={{ fontSize: 9.5, fontWeight: 800, color: '#3A5C12', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '10px 0 7px', background: '#D0F0A0', display: 'inline-block', borderRadius: 4, padding: '2px 8px' }}>
            Why anglers join Denver BassMasters
          </p>

          {/* Bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { icon: '🚤', title: 'Boat-optional tournaments', body: 'Boaters and co-anglers are paired together every event.' },
              { icon: '🏆', title: 'Compete at every level', body: 'Local to B.A.S.S. National — even the Bassmaster Classic.' },
              { icon: '🎣', title: 'Get better on the water', body: 'Technique education from decades of serious local anglers.' },
              { icon: '🌊', title: "Colorado's best fishing network", body: 'Real knowledge sharing, real spots, real community.' },
              { icon: '📱', title: 'Official app — Trophy Cast', body: 'Live weigh-ins, AOY standings & club chat at your fingertips.' },
            ].map((item) => (
              <div key={item.title} style={{
                display: 'flex', alignItems: 'flex-start', gap: 9, padding: '6px 10px',
                background: '#F4FAF0', borderLeft: '3px solid #88AC2E', borderRadius: '0 5px 5px 0',
              }}>
                <span style={{ fontSize: 14, lineHeight: 1, marginTop: 1 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#2A4008', margin: '0 0 1px', background: 'rgba(106,144,32,0.16)', display: 'inline-block', borderRadius: 3, padding: '0 5px' }}>{item.title}</p>
                  <p style={{ fontSize: 10, color: '#546654', margin: 0, lineHeight: 1.4 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: meeting info + sponsors */}
        <div>
          <div style={{
            marginTop: 10, padding: '8px 12px',
            background: '#0C0F08', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 11.5, color: '#88AC2E', fontWeight: 800 }}>📅 Meetings</span>
            <span style={{ fontSize: 10, color: '#C9D3CA' }}>First Wednesday · 7:00 PM</span>
            <span style={{ fontSize: 10, color: '#8A9E6A' }}>Bass Pro Shops Denver (Conference Room)</span>
          </div>
          <div style={{ marginTop: 7, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 8.5, color: '#a8b898', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: 2 }}>Sponsors:</span>
            {[
              { name: 'AA Toppers',    src: '/Topper%20Sales.png' },
              { name: 'Bass Pro Shops', src: '/BassproShop.png' },
              { name: 'Eagle Claw',    src: '/Eagle%20Claw.png' },
              { name: 'Milicia Marine', src: '/Milicia%20Marine.png' },
              { name: 'Discount Fishing Denver', src: '/Discount%20Fishing%20Tackle.png' },
              { name: 'JJ Bass Jigs',  src: '/JJ%20Bass%20Jigs.png' },
            ].map((s) => (
              <div key={s.name} title={s.name} style={{ background: '#fff', borderRadius: 4, padding: '2px 5px', display: 'flex', alignItems: 'center', height: 22 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.name} height={16} style={{ objectFit: 'contain', maxWidth: 50, display: 'block' }} onError={(e) => { (e.currentTarget.parentElement as HTMLDivElement).style.display = 'none'; }} />
              </div>
            ))}
            <div title="Trophy Cast" style={{ background: '#fff', borderRadius: 4, padding: '2px 5px', display: 'flex', alignItems: 'center', height: 22 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/trophy-cast-logo-256.png" alt="Trophy Cast" height={16} style={{ objectFit: 'contain', maxWidth: 50, display: 'block' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
