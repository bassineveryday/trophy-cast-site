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
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

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
            height: '0.45in',
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

function HalfFlyer() {
  return (
    <div style={{ width: '100%', height: '5.25in', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* == NAVY HEADER == */}
      <div style={{
        background: '#10212B',
        padding: '8px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/trophy-cast-logo-256.png"
            alt="Trophy Cast"
            width={88}
            height={88}
            style={{ display: 'block', flexShrink: 0 }}
          />
          <div>
            <h1 style={{ fontSize: 38, fontWeight: 900, color: '#F5F1E6', margin: 0, lineHeight: 1, letterSpacing: '-0.5px' }}>
              Trophy <span style={{ color: '#D4AF37' }}>Cast</span>
            </h1>
            <p style={{ fontSize: 13, color: '#D4AF37', fontWeight: 700, margin: '2px 0 0', letterSpacing: '0.05em', fontStyle: 'italic' }}>
              Where Every Cast Counts.
            </p>
          </div>
        </div>

        {/* Waitlist badge */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #D4AF37',
          borderRadius: 10,
          padding: '9px 18px',
          textAlign: 'center',
        }}>
          <p style={{ color: '#7A6020', fontSize: 8.5, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 2px' }}>
            Early Access
          </p>
          <p style={{ color: '#0C1A23', fontSize: 13, fontWeight: 800, margin: '0 0 1px' }}>Join the Waitlist</p>
          <p style={{ color: '#7A6020', fontSize: 10, fontWeight: 700, margin: 0 }}>trophycast.app</p>
        </div>

      </div>

      {/* ── Gold accent rule ── */}
      <div style={{ height: 2, background: '#D4AF37' }} />

      {/* ══ BODY — 3-column grid ══ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(214px, 1.28fr) 1px 1.42fr 1px auto',
        gap: 0,
        padding: '24px 28px 20px',
        alignItems: 'stretch',
        flex: 1,
      }}>

        {/* COL 1: Main Hook */}
        <div style={{ paddingRight: 20, display: 'flex', flexDirection: 'column', paddingBottom: 10 }}>
          <div style={{
            background: '#10212B',
            border: '1.5px solid #D4AF37',
            borderRadius: 14,
            padding: '18px 20px 18px',
          }}>
            <h3 style={{ fontSize: 8.5, fontWeight: 800, color: '#C9D3DA', margin: '0 0 11px', lineHeight: 1.04, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              <span style={{ display: 'block', marginBottom: 2 }}>Your water.</span>
              <span style={{ display: 'block' }}>Your coach.</span>
            </h3>
            <p style={{ 
              fontSize: 24,
              fontWeight: 900,
              color: '#ffffff', 
              margin: '0 0 3px',
              lineHeight: 0.98,
              letterSpacing: '-0.045em'
            }}>
              Teach your personal coach.
            </p>
            <p style={{ 
              fontSize: 28,
              fontWeight: 900,
              color: '#D4AF37', 
              margin: 0, 
              lineHeight: 0.98,
              letterSpacing: '-0.05em'
            }}>
              Fish with confidence.
            </p>
            <div style={{ height: 1, background: 'rgba(245, 241, 230, 0.16)', margin: '15px 0 12px' }} />
            <p style={{ fontSize: 12.1, color: '#F5F1E6', margin: '0 0 5px', fontWeight: 800, lineHeight: 1.28, letterSpacing: '-0.01em' }}>
              TC Coach learns how you fish.
            </p>
            <p style={{ fontSize: 10.9, color: 'rgba(245, 241, 230, 0.74)', margin: 0, lineHeight: 1.42 }}>
              Real angler signal helps show<br />
              what tends to work where<br />
              you fish.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(to bottom, transparent, #ebeff2, transparent)' }} />

        {/* COL 2: Feature bullets */}
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 10.5, fontWeight: 800, color: '#0C1A23', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>
              What makes it different
            </p>
            <div style={{ height: 2, background: '#D4AF37', width: 40, borderRadius: 2 }} />
          </div>
          
          {[
            { label: '01', title: 'One-breath logging', body: 'Log catches before the details fade.' },
            { label: '02', title: 'Teach your personal coach', body: 'Every catch teaches your personal coach.' },
            { label: '03', title: 'Real angler signal', body: 'See what tends to work where you fish.' },
            { label: '04', title: 'Local anglers, real clubs', body: 'Chat and learn with anglers who actually fish.' },
            { label: '05', title: 'Club tools built in', body: 'Tournaments, AOY, members, and board tools.' },
          ].map((item) => (
            <div key={item.title} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: '#ffffff',
              border: '1px solid #edf1f4',
              borderRadius: 8,
              padding: '9px 11px',
              marginBottom: 7,
            }}>
              <span style={{
                minWidth: 24,
                height: 24,
                borderRadius: 999,
                border: '1px solid rgba(212, 175, 55, 0.5)',
                color: '#7A6020',
                fontSize: 9,
                fontWeight: 800,
                lineHeight: '22px',
                textAlign: 'center',
                letterSpacing: '0.08em',
                flexShrink: 0,
              }}>{item.label}</span>
              <div>
                <p style={{ fontSize: 11.5, fontWeight: 800, color: '#0C1A23', margin: '0 0 2px', letterSpacing: '-0.01em' }}>{item.title}</p>
                <p style={{ fontSize: 10.5, color: '#546674', margin: 0, lineHeight: 1.32 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(to bottom, transparent, #ebeff2, transparent)' }} />

        {/* COL 3: QR code */}
        <div style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://trophycast.app&color=0C1A23&bgcolor=FFFFFF&qzone=2"
            alt="QR — trophycast.app"
            width={124}
            height={124}
            style={{
              display: 'block',
              border: '2px solid #D4AF37',
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <p style={{ fontSize: 14, fontWeight: 800, color: '#0C1A23', margin: '0 0 2px', textAlign: 'center', letterSpacing: '-0.3px' }}>
            trophycast.app
          </p>
          <p style={{ fontSize: 10.5, color: '#7A6020', fontWeight: 700, margin: '0 0 16px', textAlign: 'center', lineHeight: 1.25, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Scan for early<br />access
          </p>
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(212,175,55,0.55)',
            borderRadius: 8,
            padding: '8px 12px',
            textAlign: 'center',
            width: '100%'
          }}>
            <p style={{ fontSize: 9.5, color: '#7A6020', margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
              <strong style={{ color: '#0C1A23', fontWeight: 800 }}>Denver BassMasters</strong><br />
              runs their whole club<br />on Trophy Cast.
            </p>
          </div>
        </div>

      </div>

      {/* ── Gold accent rule ── */}
      <div style={{ height: 2, background: '#D4AF37' }} />

      {/* ══ NAVY FOOTER ══ */}
      <div style={{
        background: '#10212B',
        padding: '8px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: '#D4AF37', fontSize: 10, fontWeight: 800, letterSpacing: '0.06em' }}>TROPHY CAST</span>
        <span style={{ color: 'rgba(245,241,230,0.4)', fontSize: 10, fontStyle: 'italic' }}>Currently in beta · Built with real anglers.</span>
        <span style={{ color: '#F5F1E6', fontSize: 10, fontWeight: 700 }}>trophycast.app</span>
      </div>

    </div>
  );
}
