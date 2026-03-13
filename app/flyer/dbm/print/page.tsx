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

  const pageStyles = `
        body > header,
        body > footer {
          display: none !important;
        }
        body > main {
          padding-top: 0 !important;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; margin: 0; padding: 0; }
          .print-wrap { padding: 0 !important; background: #fff !important; }
          .sheet { box-shadow: none !important; border: none !important; }
        }
        @page { size: letter portrait; margin: 0.25in; }
      `;

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
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

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

      {/* LEFT PANEL — print-friendly white panel */}
      <div style={{
        width: 224, flexShrink: 0,
        background: '#ffffff',
        borderLeft: '5px solid #88AC2E',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between', padding: '26px 18px 22px', position: 'relative',
      }}>

        {/* Top section */}
        <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 40, height: 3, background: '#88AC2E', borderRadius: 2, margin: '0 auto 16px' }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/dbm-logo-transparent.png"
            alt="Denver BassMasters logo"
            height={110}
            style={{ display: 'block', margin: '0 0 4px', objectFit: 'contain' }}
          />
          <p style={{ fontSize: 9.5, color: '#5D6D24', margin: '0', fontStyle: 'italic', fontWeight: 500, letterSpacing: '0.03em', lineHeight: 1.45, textAlign: 'center' }}>
            Building better anglers<br />since the early &lsquo;70s
          </p>

          {/* DBM Family */}
          <div style={{ margin: '10px 0 0', textAlign: 'center', width: '100%' }}>
            <p style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#88AC2E', margin: '0 0 10px' }}>DBM Family</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Denver%20Bassmaster%20Junior's%20logo%20transparent..png" alt="DBM Juniors" height={38} style={{ objectFit: 'contain', maxWidth: 82, display: 'block' }} />
                <span style={{ fontSize: 6.5, color: '#6B7F35', letterSpacing: '0.06em' }}>Juniors Program</span>
              </div>
              <div style={{ width: 1, height: 24, background: '#d4e4b0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/FRBC%20Logo.png" alt="FRBC" height={32} style={{ objectFit: 'contain', maxWidth: 64, display: 'block' }} />
                <span style={{ fontSize: 6.5, color: '#6B7F35', letterSpacing: '0.06em' }}>Front Range Bass Club</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: '#e8f0d8', margin: '12px 0 0' }} />
        </div>

        {/* Champion badge */}
        <div style={{ width: '100%', marginTop: 'auto', marginBottom: 'auto' }}>
          <div style={{
            background: '#FFFBF0', border: '1px solid #D4AF37',
            borderRadius: 8, padding: '7px 10px', fontSize: 9.5, color: '#8B6914', fontWeight: 700, textAlign: 'center', lineHeight: 1.4,
          }}>
            🏆 Colorado Bass Nation<br />Club Trophy<br />
            <span style={{ fontSize: 8.5, fontWeight: 400, color: '#B8902A' }}>2024–2025 Champions</span>
          </div>
        </div>

        {/* QR code */}
        <div style={{ textAlign: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=https%3A%2F%2Fwww.denverbassmasters.com%2Fjoin-now&color=2A4008&bgcolor=FFFFFF&qzone=1"
            alt="QR code — denverbassmasters.com/join-now"
            width={108} height={108}
            style={{ display: 'block', margin: '0 auto 6px', border: '2px solid #88AC2E', borderRadius: 6, padding: 3, background: '#fff' }}
          />
          <p style={{ fontSize: 10.5, fontWeight: 800, color: '#2A4008', margin: '0 0 2px' }}>Join Today</p>
          <p style={{ fontSize: 8.5, color: '#8A9E6A', margin: 0 }}>Scan or visit<br />denverbassmasters.com</p>
        </div>
      </div>

      {/* VERTICAL DIVIDER */}
      <div style={{ width: 1, background: 'linear-gradient(to bottom, transparent, #88AC2E 20%, #88AC2E 80%, transparent)', flexShrink: 0 }} />

      {/* RIGHT COLUMN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '26px 30px 18px' }}>

        <div>
          {/* Headline */}
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0C0F08', margin: '0 0 4px', lineHeight: 1.1, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
            You Don&rsquo;t Need <span style={{ color: '#88AC2E', background: 'rgba(136,172,46,0.12)', borderRadius: 5, padding: '0 6px', display: 'inline-block' }}>a Boat.</span>
          </h1>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: '#5D6D24', margin: '0 0 3px' }}>Just a love for bass fishing.</p>
          <p style={{ fontSize: 9.5, fontWeight: 800, color: '#3A5C12', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '10px 0 7px', background: '#D0F0A0', display: 'inline-block', borderRadius: 4, padding: '2px 8px' }}>
            Why anglers join Denver BassMasters
          </p>

          {/* Bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { icon: '🚤', title: 'Boater & Co-Angler Tournaments', body: 'DBM runs card tournaments — catch a fish, weigh it, record it on your card, and release it. A boater and co-angler are paired every event. You fish as a team, you compete as individuals.' },
              { icon: '🏆', title: 'One path, five levels of competition', body: 'Fish club tournaments to build your skills. As a B.A.S.S.-affiliated club, members can enter the Colorado state qualifier. Place high enough and you advance: State → Regionals → Nationals → and the ultimate prize, the Bassmaster Classic. A real competitive ladder — and it all starts right here.' },
              { icon: '🎣', title: 'A club that makes you better', body: 'Monthly guest speakers cover technique, electronics, and seasonal patterns. Away card tournaments include education too. This is a mentorship culture — every angler here, beginner or veteran, is here to get better.' },
              { icon: '📲', title: 'Get connected, get involved', body: 'DBM is building a modern club — group chats, committees, and centralized communication so members stay connected year-round. Join a committee and help shape the direction of the club.' },
              { icon: null, title: 'Official Club App — Trophy Cast', body: 'Card tournament results, AOY standings, your personal stats, club communication — all in the Trophy Cast app. Everything you need to track your season, in your pocket.' },
            ].map((item) => (
              <div key={item.title} style={{
                display: 'flex', alignItems: 'flex-start', gap: 9, padding: '6px 10px',
                background: '#F4FAF0', borderLeft: '3px solid #88AC2E', borderRadius: '0 5px 5px 0',
              }}>
                <span style={{ fontSize: 14, lineHeight: 1, marginTop: 1, display: 'flex', alignItems: 'center' }}>
                  {item.icon ?? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/Trophy%20cast%20white%20background.png" alt="Trophy Cast" height={16} style={{ objectFit: 'contain', maxWidth: 42, display: 'block', borderRadius: 2 }} />
                  )}
                </span>
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
            marginTop: 6, padding: '8px 12px',
            background: '#0C0F08', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 11.5, color: '#88AC2E', fontWeight: 800 }}>📅 Meetings</span>
            <span style={{ fontSize: 10, color: '#C9D3CA' }}>First Wednesday · 7:00 PM</span>
            <span style={{ fontSize: 10, color: '#8A9E6A' }}>Bass Pro Shops Denver (Conference Room)</span>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 0, justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
            {[
              { name: 'Bass Pro Shops',          src: '/bass-pro-logo-2x.png' },
              { name: 'JJ Bass Jigs',            src: '/JJ-logo-trim%20(2).png' },
              { name: 'Trophy Cast',             src: '/Trophy%20cast%20white%20background.png' },
              { name: 'Eagle Claw',              src: '/Eagle%20Claw%20logo%20transparent..png' },
              { name: 'Militia Marine',          src: '/Militia%20Marine%20logo.%20Transparent..png' },
              { name: 'AA Toppers',              src: '/Topper%20Sales.png' },
              { name: 'Rapala',                  src: '/Rapala%20logo%20transparent..png' },
              { name: 'Discount Fishing Denver', src: '/Discount%20fishing%20tackle.%20Logo.%20Transparent..png' },
            ].map((s) => (
              <div key={s.name} title={s.name} style={{ background: '#fff', borderRadius: 4, padding: '2px 5px', display: 'flex', alignItems: 'center', height: 22 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.name} height={16} style={{ objectFit: 'contain', maxWidth: 50, display: 'block', mixBlendMode: 'multiply' }} onError={(e) => { (e.currentTarget.parentElement as HTMLDivElement).style.display = 'none'; }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
