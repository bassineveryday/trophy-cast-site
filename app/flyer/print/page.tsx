'use client';

import { useState } from 'react';
import { toPng } from 'html-to-image';

/**
 * Trophy Cast — Home Printer Flyer (2-up on letter)
 * ──────────────────────────────────────────────────
 * White background, dark navy text, gold accents.
 * Designed for Epson ET-2800 / any home printer with standard margins.
 *
 * Two half-pages per sheet (8.5" × 5.5" each).
 * Use Ctrl+P → set margins to "None" or "Minimum" → Save as PDF or print.
 * Cut along the dashed line for two separate flyers.
 */

export default function PrintFlyerPage() {
  const [downloading, setDownloading] = useState(false);

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
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; margin: 0; padding: 0; }
          .print-wrap { padding: 0 !important; background: #fff !important; }
          .sheet { box-shadow: none !important; border: none !important; }
        }
        @page { size: letter portrait; margin: 0.25in; }
      `}</style>

      {/* ── Controls bar ── */}
      <div
        className="no-print"
        style={{
          background: '#0C1A23',
          borderBottom: '1px solid rgba(212,175,55,0.2)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span style={{ color: '#F5F1E6', fontWeight: 700, fontSize: 14 }}>🖨 Print-Ready Flyer</span>
          <span style={{ color: '#8BA3B5', fontSize: 12, marginLeft: 10 }}>
            White background · 2 half-pages per sheet · Cut on the dashed line
          </span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="/flyer"
            style={{
              background: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: 8,
              color: '#D4AF37',
              padding: '6px 14px',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ← Dark version
          </a>
          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            style={{
              background: '#2E6E3D',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              padding: '6px 18px',
              fontSize: 12,
              cursor: downloading ? 'wait' : 'pointer',
              fontWeight: 800,
              opacity: downloading ? 0.7 : 1,
            }}
          >
            {downloading ? '⏳ Generating...' : '⬇ Download PNG'}
          </button>
          <button
            onClick={handlePrint}
            style={{
              background: '#D4AF37',
              border: 'none',
              borderRadius: 8,
              color: '#0C1A23',
              padding: '6px 18px',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 800,
            }}
          >
            🖨 Print / Save PDF
          </button>
        </div>
      </div>

      {/* Print tip */}
      <div
        className="no-print"
        style={{
          background: 'rgba(212,175,55,0.08)',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
          padding: '8px 24px',
          fontSize: 12,
          color: '#8BA3B5',
        }}
      >
        💡 <strong style={{ color: '#C9D3DA' }}>Print tip:</strong> Ctrl+P → Margins: Minimum →
        Scale: 100% → Print. Then cut along the dashed line for 2 flyers.
      </div>

      {/* ── Page wrapper ── */}
      <div
        className="print-wrap"
        style={{
          minHeight: '100vh',
          background: '#f0ede6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '32px 16px 64px',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >

        {/* ── Sheet — letter size approx at 96dpi ── */}
        <div
          id="print-sheet"
          className="sheet"
          style={{
            width: 816,
            background: '#ffffff',
            border: '1px solid #e0ddd6',
            borderRadius: 4,
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >

          {/* ══ FLYER 1 (top half) ══ */}
          <HalfFlyer />

          {/* ── CUT LINE ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 24px',
            background: '#fff',
          }}>
            <div style={{ flex: 1, borderTop: '2px dashed #b0b8c0' }} />
            <span style={{ fontSize: 10, color: '#b0b8c0', fontWeight: 600, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
              ✂ CUT HERE
            </span>
            <div style={{ flex: 1, borderTop: '2px dashed #b0b8c0' }} />
          </div>

          {/* ══ FLYER 2 (bottom half) ══ */}
          <HalfFlyer />

        </div>

        {/* Instructions below */}
        <div
          className="no-print"
          style={{
            marginTop: 24,
            maxWidth: 816,
            width: '100%',
            background: 'rgba(19,37,50,0.7)',
            border: '1px solid rgba(197,213,220,0.1)',
            borderRadius: 10,
            padding: '18px 24px',
          }}
        >
          <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: 13, margin: '0 0 8px' }}>
            📸 Workflow: Print → Cut → Hand out
          </p>
          <ol style={{ color: '#8BA3B5', fontSize: 13, margin: 0, paddingLeft: 18, lineHeight: 2.1 }}>
            <li>Click <strong style={{ color: '#F5F1E6' }}>&ldquo;Print / Save PDF&rdquo;</strong> above</li>
            <li>Set margins to <strong style={{ color: '#F5F1E6' }}>Minimum</strong>, scale <strong style={{ color: '#F5F1E6' }}>100%</strong></li>
            <li>Print on regular white letter paper</li>
            <li>Cut along the dashed line — you get <strong style={{ color: '#F5F1E6' }}>2 flyers per sheet</strong></li>
            <li>30 flyers = 15 sheets of paper 🎉</li>
          </ol>
        </div>

      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   Half-page flyer — clean redesign
   White body, navy header + footer, color accents
───────────────────────────────────────── */
function HalfFlyer() {
  return (
    <div style={{ width: '100%', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>

      {/* ══ NAVY HEADER ══ */}
      <div style={{
        background: 'linear-gradient(135deg, #0C1A23 0%, #1a3347 100%)',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/trophy-cast-logo-256.png"
            alt="Trophy Cast"
            width={52}
            height={52}
            style={{ display: 'block', flexShrink: 0 }}
          />
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: '#F5F1E6', margin: 0, lineHeight: 1, letterSpacing: '-0.5px' }}>
              Trophy <span style={{ color: '#D4AF37' }}>Cast</span>
            </h1>
            <p style={{ fontSize: 11, color: '#D4AF37', fontWeight: 700, margin: '3px 0 0', letterSpacing: '0.05em', fontStyle: 'italic' }}>
              Where Every Cast Counts.
            </p>
          </div>
        </div>

        {/* Waitlist badge */}
        <div style={{
          background: 'rgba(212,175,55,0.15)',
          border: '1.5px solid #D4AF37',
          borderRadius: 10,
          padding: '8px 18px',
          textAlign: 'center',
        }}>
          <p style={{ color: '#D4AF37', fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 2px' }}>
            🎣 Early Access
          </p>
          <p style={{ color: '#F5F1E6', fontSize: 13, fontWeight: 800, margin: '0 0 1px' }}>Join the Waitlist</p>
          <p style={{ color: '#4FC3F7', fontSize: 10, fontWeight: 700, margin: 0 }}>trophycast.app</p>
        </div>

      </div>

      {/* ── Rainbow accent stripe ── */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #D4AF37 0%, #4FC3F7 50%, #2E6E3D 100%)' }} />

      {/* ══ BODY — 3-column grid ══ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr 1px auto',
        gap: 0,
        padding: '18px 24px 16px',
        alignItems: 'start',
      }}>

        {/* COL 1: Hook + tagline */}
        <div style={{ paddingRight: 20 }}>
          <div style={{
            background: '#0C1A23',
            borderRadius: 8,
            padding: '12px 14px',
            marginBottom: 12,
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#4FC3F7', margin: '0 0 6px', lineHeight: 1.2, letterSpacing: '0.01em' }}>
              Gets smarter the more you fish.
            </p>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', margin: '0 0 3px', lineHeight: 1.25 }}>
              Other apps track<br />your catch.
            </p>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#D4AF37', margin: 0, lineHeight: 1.25 }}>
              We learn from it.
            </p>
          </div>
          <p style={{ fontSize: 11, color: '#546674', margin: '0 0 14px', lineHeight: 1.65 }}>
            Your techniques. Your water.<br />
            The more you fish, the smarter<br />
            Trophy Cast gets.
          </p>
          {/* chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              { bg: '#E3F4FF', color: '#0e7cb8', label: '⚡  Voice-first logging' },
              { bg: '#FFF8E1', color: '#a07800', label: '✨  TC Coach — your water' },
              { bg: '#E8F5EB', color: '#2E6E3D', label: '🏆  30 real trophies' },
              { bg: '#F3F0FF', color: '#5b4fa8', label: '📦  Club-in-a-box' },
            ].map((c) => (
              <div key={c.label} style={{
                background: c.bg,
                color: c.color,
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 6,
                padding: '4px 10px',
              }}>
                {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(to bottom, #D4AF37, #4FC3F7)', margin: '4px 0', opacity: 0.4 }} />

        {/* COL 2: Feature bullets */}
        <div style={{ paddingLeft: 18, paddingRight: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 800, color: '#4FC3F7', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            What makes it different
          </p>
          {[
            { icon: '🎣', title: 'Voice-first logging', body: 'One breath on the water — no typing.', bg: '#E3F4FF', bdr: '#4FC3F7' },
            { icon: '✨', title: 'TC Coach knows you', body: 'Built from YOUR patterns, not someone else\'s.', bg: '#FFFCE8', bdr: '#D4AF37' },
            { icon: '📊', title: 'Your patterns & insights', body: 'Bait, depth, conditions — all connected.', bg: '#E8F5EB', bdr: '#2E6E3D' },
            { icon: '📦', title: 'Club-in-a-box', body: 'Run the whole club with the board — tournaments, AOY, members.', bg: '#FFFCE8', bdr: '#D4AF37' },
            { icon: '💬', title: 'Real community', body: 'Dock Talk, local clubs, DMs — your fishing crew in one place.', bg: '#E3F4FF', bdr: '#4FC3F7' },
          ].map((item) => (
            <div key={item.title} style={{
              display: 'flex', alignItems: 'flex-start', gap: 7,
              background: item.bg,
              borderLeft: `3px solid ${item.bdr}`,
              borderRadius: '0 6px 6px 0',
              padding: '6px 8px',
              marginBottom: 5,
            }}>
              <span style={{ fontSize: 13, lineHeight: 1.2, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0C1A23', margin: 0 }}>{item.title}</p>
                <p style={{ fontSize: 10, color: '#546674', margin: 0, lineHeight: 1.4 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(to bottom, #D4AF37, #4FC3F7)', margin: '4px 0', opacity: 0.4 }} />

        {/* COL 3: QR code */}
        <div style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Ftrophycast.app&color=0C1A23&bgcolor=FFFFFF&qzone=2"
            alt="QR — trophycast.app"
            width={120}
            height={120}
            style={{
              display: 'block',
              border: '3px solid #D4AF37',
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
          <p style={{ fontSize: 12, fontWeight: 800, color: '#0C1A23', margin: '0 0 2px', textAlign: 'center' }}>
            trophycast.app
          </p>
          <p style={{ fontSize: 9.5, color: '#8BA3B5', margin: '0 0 14px', textAlign: 'center', lineHeight: 1.4 }}>
            Scan to get on<br />the waitlist
          </p>
          <div style={{
            background: '#FFF8E1',
            border: '1px solid #D4AF37',
            borderRadius: 6,
            padding: '6px 10px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 9, color: '#7A6020', margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: '#0C1A23' }}>Denver BassMasters</strong><br />
              runs their whole club<br />on Trophy Cast.
            </p>
          </div>
        </div>

      </div>

      {/* ── Rainbow accent stripe ── */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #2E6E3D 0%, #4FC3F7 50%, #D4AF37 100%)' }} />

      {/* ══ NAVY FOOTER ══ */}
      <div style={{
        background: 'linear-gradient(90deg, #0C1A23, #1a3347)',
        padding: '8px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: '#D4AF37', fontSize: 10, fontWeight: 800, letterSpacing: '0.06em' }}>🏆 TROPHY CAST</span>
        <span style={{ color: 'rgba(245,241,230,0.4)', fontSize: 10, fontStyle: 'italic' }}>Currently in beta · Built with real anglers.</span>
        <span style={{ color: '#4FC3F7', fontSize: 10, fontWeight: 700 }}>trophycast.app</span>
      </div>

    </div>
  );
}
