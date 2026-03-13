'use client';

import { useState } from 'react';
import { toPng } from 'html-to-image';

/**
 * Trophy Cast — Home Printer Flyer (2-up landscape)
 * ──────────────────────────────────────────────────
 * White background, dark navy text, gold accents.
 * Designed for home printers with standard margins.
 *
 * Two portrait flyers per landscape sheet.
 * Fold on center, then cut on the center guide.
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
          html,
          body,
          .sheet,
          .sheet * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            forced-color-adjust: none !important;
          }
          .no-print { display: none !important; }
          body { background: #fff !important; margin: 0; padding: 0; }
          .print-wrap { padding: 0 !important; background: #fff !important; }
          .sheet { box-shadow: none !important; border: none !important; }
        }
        @page { size: letter landscape; margin: 0.25in; }
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
            White background · two portrait flyers side by side · centered fold/cut guide
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
        Scale: 100% → Background graphics: On → Fold the page in half and cut on the center guide.
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

        {/* ── Sheet — printable landscape letter area at 96dpi ── */}
        <div
          id="print-sheet"
          className="sheet"
          style={{
            width: 1008,
            minHeight: 768,
            background: '#ffffff',
            border: '1px solid #e0ddd6',
            borderRadius: 4,
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            position: 'relative',
            padding: 24,
            boxSizing: 'border-box',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '50%',
              top: 18,
              bottom: 18,
              transform: 'translateX(-50%)',
              borderLeft: '2px dashed #B0B8C0',
              zIndex: 2,
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '468px 24px 468px', gap: 0, alignItems: 'stretch' }}>
            <FlyerCard />
            <div aria-hidden="true" />
            <FlyerCard />
          </div>

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
            📸 Workflow: Print → Fold → Cut → Hand out
          </p>
          <ol style={{ color: '#8BA3B5', fontSize: 13, margin: 0, paddingLeft: 18, lineHeight: 2.1 }}>
            <li>Click <strong style={{ color: '#F5F1E6' }}>&ldquo;Print / Save PDF&rdquo;</strong> above</li>
            <li>Set margins to <strong style={{ color: '#F5F1E6' }}>Minimum</strong>, scale <strong style={{ color: '#F5F1E6' }}>100%</strong>, and turn <strong style={{ color: '#F5F1E6' }}>Background graphics</strong> on</li>
            <li>Print on regular white letter paper</li>
            <li>Fold the sheet in half to verify the center line is even on both sides</li>
            <li>Cut directly on the dashed center guide for <strong style={{ color: '#F5F1E6' }}>2 portrait flyers per sheet</strong></li>
          </ol>
        </div>

      </div>
    </>
  );
}

function FlyerCard() {
  const cardHeader = '#E7EFF2';
  const cardHero = '#DCE8ED';
  const cardDarkText = '#16303B';
  const cardMutedText = '#56717D';
  const cardAccent = '#C29A2C';

  const features = [
    { label: '01', title: 'One-breath logging', body: 'Say species, weight, lure, color, temp.' },
    { label: '02', title: 'Finish later', body: 'Capture it on the water. Clean it up when you have time.' },
    { label: '03', title: 'Teach your personal coach', body: 'Every catch trains TC Coach around your own patterns.' },
    { label: '04', title: 'Research on a bigger screen', body: 'Review trips, baits, weather, and what is working faster on desktop.' },
  ];

  return (
    <div style={{ width: 468, minHeight: 720, background: '#ffffff', display: 'flex', flexDirection: 'column', border: '1px solid #DCE3E8', boxSizing: 'border-box' }}>
      <div style={{
        background: cardHeader,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/trophy-cast-logo-256.png"
            alt="Trophy Cast"
            width={56}
            height={56}
            style={{ display: 'block', flexShrink: 0 }}
          />
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: cardDarkText, margin: 0, lineHeight: 1, letterSpacing: '-0.8px' }}>
              Trophy <span style={{ color: cardAccent }}>Cast</span>
            </h1>
            <p style={{ fontSize: 10.5, color: '#8C6D18', fontWeight: 700, margin: '3px 0 0', letterSpacing: '0.05em', fontStyle: 'italic' }}>
              Where Every Cast Counts.
            </p>
          </div>
        </div>

        <div style={{
          background: '#FFFDF8',
          border: `1px solid ${cardAccent}`,
          borderRadius: 999,
          padding: '7px 12px',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          <p style={{ color: cardDarkText, fontSize: 11, fontWeight: 800, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Early Access
          </p>
        </div>
      </div>

      <div style={{ height: 3, background: cardAccent }} />

      <div style={{ padding: '16px 18px 14px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div style={{
          background: cardHero,
          border: `2px solid ${cardAccent}`,
          borderRadius: 16,
          padding: '16px 16px 15px',
          boxSizing: 'border-box',
        }}>
          <h3 style={{ fontSize: 9, fontWeight: 800, color: '#5B7885', margin: '0 0 10px', lineHeight: 1.04, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span style={{ display: 'block', marginBottom: 2 }}>Your water.</span>
            <span style={{ display: 'block' }}>Your coach.</span>
          </h3>
          <p style={{
            fontSize: 32,
            fontWeight: 900,
            color: cardDarkText,
            margin: '0 0 2px',
            lineHeight: 0.96,
            letterSpacing: '-0.045em',
          }}>
            <span style={{ display: 'block' }}>Log it fast.</span>
          </p>
          <p style={{
            fontSize: 37,
            fontWeight: 900,
            color: cardAccent,
            margin: 0,
            lineHeight: 0.96,
            letterSpacing: '-0.05em',
          }}>
            Learn from it later.
          </p>
          <div style={{ height: 1, background: 'rgba(22, 48, 59, 0.14)', margin: '14px 0 12px' }} />
          <p style={{ fontSize: 13.6, color: cardDarkText, margin: '0 0 6px', fontWeight: 800, lineHeight: 1.24, letterSpacing: '-0.01em' }}>
            Teach your personal coach with every catch.
          </p>
          <p style={{ fontSize: 12.2, color: cardMutedText, margin: 0, lineHeight: 1.3 }}>
            Phone on the water. Computer when you want to review and learn.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 14, alignItems: 'stretch' }}>
          <div style={{
            background: '#FBFBF8',
            border: '1px solid #E3E8EC',
            borderRadius: 14,
            padding: '14px 14px 12px',
          }}>
            <p style={{ fontSize: 9.5, fontWeight: 800, color: '#7A6020', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Why it feels different
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {features.map((item, index) => (
                <div
                  key={item.title}
                  style={{
                    display: 'flex',
                    gap: 10,
                    paddingBottom: index === features.length - 1 ? 0 : 10,
                    borderBottom: index === features.length - 1 ? 'none' : '1px solid rgba(12,26,35,0.08)',
                  }}
                >
                  <span style={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: 999,
                    background: '#FFFFFF',
                    border: `1px solid ${cardAccent}`,
                    color: cardDarkText,
                    fontSize: 8,
                    fontWeight: 800,
                    lineHeight: '20px',
                    textAlign: 'center',
                    letterSpacing: '0.08em',
                    flexShrink: 0,
                  }}>{item.label}</span>
                  <div>
                    <p style={{ fontSize: 12.2, fontWeight: 800, color: '#0C1A23', margin: '0 0 2px', letterSpacing: '-0.01em' }}>{item.title}</p>
                    <p style={{ fontSize: 10.6, color: '#445866', margin: 0, lineHeight: 1.3 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#FFF9ED',
            border: '1px solid rgba(212,175,55,0.45)',
            borderRadius: 14,
            padding: '12px 10px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <p style={{ fontSize: 8.5, color: '#7A6020', fontWeight: 800, margin: 0, lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Scan to join
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://trophycast.app&color=0C1A23&bgcolor=FFFFFF&qzone=2"
              alt="QR — trophycast.app"
              width={96}
              height={96}
              style={{
                display: 'block',
                border: '2px solid #D4AF37',
                borderRadius: 10,
                margin: '0 auto 8px',
              }}
            />
            <p style={{ fontSize: 13, fontWeight: 800, color: '#0C1A23', margin: '0 0 2px', letterSpacing: '-0.2px' }}>
              trophycast.app
            </p>
            <p style={{ fontSize: 9, color: '#7A6020', fontWeight: 800, margin: 0, lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Early access<br />waitlist
            </p>
          </div>
        </div>

        <div style={{
          background: '#F4F6F8',
          borderRadius: 12,
          padding: '11px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div>
            <p style={{ fontSize: 9.5, fontWeight: 800, color: '#7A6020', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 3px' }}>
              Real club proof
            </p>
            <p style={{ fontSize: 11.2, color: '#445866', margin: 0, lineHeight: 1.3 }}>
              <strong style={{ color: '#0C1A23', fontWeight: 800 }}>Denver BassMasters</strong> runs tournaments, AOY, chat, members, and board tools on Trophy Cast.
            </p>
          </div>
          <div style={{ color: '#D4AF37', fontSize: 24, lineHeight: 1, flexShrink: 0 }}>TC</div>
        </div>
      </div>

      <div style={{ height: 3, background: '#D4AF37' }} />

      <div style={{
        background: cardHeader,
        padding: '10px 18px',
        borderTop: '1px solid rgba(22, 48, 59, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: cardAccent, fontSize: 10, fontWeight: 800, letterSpacing: '0.06em' }}>TROPHY CAST</span>
        <span style={{ color: cardMutedText, fontSize: 9.5, fontStyle: 'italic' }}>Currently in beta · Built with real anglers.</span>
        <span style={{ color: cardDarkText, fontSize: 10, fontWeight: 700 }}>trophycast.app</span>
      </div>
    </div>
  );
}
