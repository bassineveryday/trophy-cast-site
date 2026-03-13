'use client';

import { useState } from 'react';
import { toPng } from 'html-to-image';

/**
 * Trophy Cast Promotional Flyer
 * ─────────────────────────────
 * Designed to be screenshotted or printed (letter size).
 * Visit /flyer, zoom to fit the card on screen, then screenshot.
 * Or use Ctrl+P → Save as PDF → import into Canva.
 *
 * QR code points to https://trophycast.app (waitlist is on homepage)
 */

export default function FlyerPage() {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => window.print();

  const handleDownloadPng = async () => {
    const node = document.getElementById('flyer');
    if (!node) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true });
      const link = document.createElement('a');
      link.download = 'trophy-cast-flyer.png';
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText('https://trophycast.app');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ── Page chrome (not printed) ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #0C1A23 !important; margin: 0; padding: 0; }
          .flyer-page-wrap { display: block; padding: 0; }
        }
        @page { size: letter; margin: 0; }
      `}</style>

      {/* Controls bar */}
      <div
        className="no-print"
        style={{
          background: '#0a151e',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ color: '#C9D3DA', fontSize: 13 }}>
          📄 <strong style={{ color: '#F5F1E6' }}>Trophy Cast Flyer</strong> — screenshot or print this page
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleCopyUrl}
            style={{
              background: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: 8,
              color: '#D4AF37',
              padding: '6px 14px',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {copied ? '✓ Copied!' : 'Copy URL'}
          </button>
          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            style={{
              background: '#2E6E3D',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              padding: '6px 16px',
              fontSize: 12,
              cursor: downloading ? 'wait' : 'pointer',
              fontWeight: 700,
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
              padding: '6px 16px',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            🖨 Save as PDF / Print
          </button>
        </div>
      </div>

      {/* ── Flyer wrapper — centers card on screen ── */}
      <div
        className="flyer-page-wrap"
        style={{
          minHeight: '100vh',
          background: '#07111a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '32px 16px 64px',
        }}
      >

        {/* ── THE FLYER CARD (816 × 1056 px = letter at 96 dpi) ── */}
        <div
          id="flyer"
          style={{
            width: 816,
            minHeight: 1056,
            background: 'linear-gradient(165deg, #0C1A23 0%, #132532 45%, #0e1f2d 100%)',
            border: '1.5px solid rgba(212,175,55,0.25)',
            borderRadius: 12,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(212,175,55,0.08)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >

          {/* ── Ambient glow blobs ── */}
          <div style={{
            position: 'absolute', top: -80, left: -80,
            width: 400, height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,195,247,0.07), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: 200, right: -100,
            width: 500, height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.05), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -60, left: '30%',
            width: 350, height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,195,247,0.06), transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* ── TOP ACCENT BAR ── */}
          <div style={{
            height: 6,
            background: 'linear-gradient(90deg, #4FC3F7, #D4AF37, #4FC3F7)',
          }} />

          {/* ── HEADER SECTION ── */}
          <div style={{
            padding: '52px 64px 36px',
            textAlign: 'center',
            position: 'relative',
          }}>

            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: 100,
              padding: '5px 16px',
              marginBottom: 28,
            }}>
              <span style={{ fontSize: 12 }}>🏆</span>
              <span style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Now on the waitlist
              </span>
            </div>

            {/* Logo / Brand */}
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/trophy-cast-logo-256.png"
                alt="Trophy Cast Logo"
                width={110}
                height={110}
                style={{ display: 'block', flexShrink: 0 }}
              />
              <h1 style={{
                fontSize: 72,
                fontWeight: 900,
                color: '#F5F1E6',
                margin: 0,
                lineHeight: 1,
                letterSpacing: '-2px',
              }}>
                Trophy{' '}
                <span style={{ color: '#D4AF37' }}>Cast</span>
              </h1>
            </div>

            {/* Tagline */}
            <p style={{
              fontSize: 22,
              color: '#4FC3F7',
              margin: '0 0 8px',
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}>
              Gets smarter the more you fish.
            </p>
            <p style={{
              fontSize: 14,
              color: 'rgba(197,213,220,0.6)',
              margin: 0,
              fontStyle: 'italic',
              letterSpacing: '0.04em',
            }}>
              Where Every Cast Counts.
            </p>

          </div>

          {/* ── DIVIDER ── */}
          <div style={{
            margin: '0 64px',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)',
          }} />

          {/* ── HERO STATEMENT ── */}
          <div style={{
            padding: '40px 64px 36px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#F5F1E6',
              margin: '0 0 10px',
              lineHeight: 1.35,
            }}>
              Other fishing apps track your catch.
            </p>
            <p style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#D4AF37',
              margin: 0,
              lineHeight: 1.35,
            }}>
              We learn from it.
            </p>
          </div>

          {/* ── FEATURE BULLETS ── */}
          <div style={{
            padding: '0 64px 44px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}>
            {[
              {
                icon: '🎣',
                title: 'Voice-first catch logging',
                body: 'Log catches on the water in one breath. Trophy Cast remembers every detail.',
              },
              {
                icon: '✨',
                title: 'TC Coach — knows your water',
                body: 'Not generic tips. Coaching built from YOUR patterns, YOUR techniques, YOUR adjustments.',
              },
              {
                icon: '📊',
                title: 'Your patterns. Your insights.',
                body: 'The more you fish, the better it knows you — bait, depth, weather, and what actually works.',
              },
              {
                icon: '🏆',
                title: 'Tournaments & clubs built in',
                body: 'Weigh-ins, AOY standings, member management, and live leaderboards — no spreadsheets.',
              },
              {
                icon: '💬',
                title: 'Dock Talk community',
                body: 'Real anglers, real clubs. Local tournaments, discussions, and DMs — no influencers.',
              },
              {
                icon: '⚡',
                title: 'Daily missions & 30 trophies',
                body: 'Missions keep you sharp between trips. Trophies mark the catches that matter most.',
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: 'rgba(19,37,50,0.75)',
                  border: '1px solid rgba(197,213,220,0.08)',
                  borderRadius: 10,
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ color: '#F5F1E6', fontWeight: 700, fontSize: 14 }}>{item.title}</span>
                </div>
                <p style={{ color: '#8BA3B5', fontSize: 12.5, margin: 0, lineHeight: 1.5 }}>{item.body}</p>
              </div>
            ))}
          </div>

          {/* ── DIVIDER ── */}
          <div style={{
            margin: '0 64px',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)',
          }} />

          {/* ── CTA SECTION ── */}
          <div style={{
            padding: '44px 64px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: 48,
          }}>

            {/* QR Code */}
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              <div style={{
                background: '#D4AF37',
                borderRadius: 16,
                padding: 12,
                display: 'inline-block',
                boxShadow: '0 8px 32px rgba(212,175,55,0.4)',
              }}>
                {/* Real QR code via qrserver.com pointing to trophycast.app waitlist */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Ftrophycast.app&color=0C1A23&bgcolor=D4AF37&qzone=1"
                  alt="QR code to trophycast.app"
                  width={160}
                  height={160}
                  style={{ display: 'block', borderRadius: 8 }}
                />
              </div>
              <p style={{ color: '#8BA3B5', fontSize: 11, margin: '8px 0 0', textAlign: 'center' }}>
                Scan to join
              </p>
            </div>

            {/* CTA Text */}
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 13,
                color: '#D4AF37',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                margin: '0 0 12px',
              }}>
                Join the Waitlist — Be First In
              </p>
              <h2 style={{
                fontSize: 36,
                fontWeight: 900,
                color: '#F5F1E6',
                margin: '0 0 14px',
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
              }}>
                Be first to fish<br />
                <span style={{ color: '#4FC3F7' }}>smarter.</span>
              </h2>
              <p style={{ color: '#8BA3B5', fontSize: 14, margin: '0 0 20px', lineHeight: 1.6 }}>
                Trophy Cast is launching soon. Join the waitlist at{' '}
                <strong style={{ color: '#F5F1E6' }}>trophycast.app</strong> and be the
                first angler to experience coaching that actually knows your water.
              </p>

              {/* URL chip */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(79,195,247,0.1)',
                border: '1.5px solid rgba(79,195,247,0.4)',
                borderRadius: 100,
                padding: '10px 24px',
              }}>
                <span style={{ fontSize: 16 }}>🎣</span>
                <span style={{ color: '#4FC3F7', fontWeight: 800, fontSize: 17, letterSpacing: '0.01em' }}>
                  trophycast.app
                </span>
              </div>

              {/* Social handles */}
              <p style={{ color: 'rgba(139,163,181,0.6)', fontSize: 11, margin: '12px 0 0' }}>
                @TrophyCastApp  ·  Built by fishermen, for fishermen.
              </p>
            </div>

          </div>

          {/* ── QUOTE BAR ── */}
          <div style={{
            margin: '0 48px 48px',
            background: 'linear-gradient(90deg, rgba(212,175,55,0.08), rgba(79,195,247,0.06))',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 10,
            padding: '16px 28px',
            textAlign: 'center',
          }}>
            <p style={{
              color: '#C9D3DA',
              fontSize: 14.5,
              fontStyle: 'italic',
              margin: 0,
              lineHeight: 1.5,
            }}>
              &ldquo;Built on real anglers. Not influencers. Denver BassMasters runs their
              whole club here — tournaments, AOY, member management, and more.&rdquo;
            </p>
          </div>

          {/* ── STAT CHIPS ── */}
          <div style={{
            margin: '0 64px 52px',
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {[
              { emoji: '🎣', value: '80+ screens', label: 'built for anglers' },
              { emoji: '⚡', value: 'Voice-first', label: 'log in one breath' },
              { emoji: '✨', value: 'TC Coach', label: 'knows your water' },
              { emoji: '🏆', value: '30 trophies', label: 'real milestones' },
            ].map((chip) => (
              <div
                key={chip.value}
                style={{
                  background: 'rgba(19,37,50,0.8)',
                  border: '1px solid rgba(197,213,220,0.1)',
                  borderRadius: 8,
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>{chip.emoji}</span>
                <div>
                  <div style={{ color: '#F5F1E6', fontWeight: 700, fontSize: 12 }}>{chip.value}</div>
                  <div style={{ color: '#5E7A8A', fontSize: 10 }}>{chip.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── BOTTOM ACCENT BAR ── */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{
              padding: '14px 64px',
              background: 'rgba(8,18,26,0.6)',
              borderTop: '1px solid rgba(212,175,55,0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ color: '#D4AF37', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>
                🏆 TROPHY CAST
              </span>
              <span style={{ color: 'rgba(139,163,181,0.5)', fontSize: 11, fontStyle: 'italic' }}>
                Where Every Cast Counts.
              </span>
              <span style={{ color: 'rgba(139,163,181,0.5)', fontSize: 11 }}>
                trophycast.app
              </span>
            </div>
            {/* Bottom color bar */}
            <div style={{
              height: 6,
              background: 'linear-gradient(90deg, #D4AF37, #4FC3F7, #D4AF37)',
            }} />
          </div>

        </div>

        {/* ── Instructions below the flyer ── */}
        <div
          className="no-print"
          style={{
            marginTop: 32,
            maxWidth: 816,
            width: '100%',
            background: 'rgba(19,37,50,0.6)',
            border: '1px solid rgba(197,213,220,0.08)',
            borderRadius: 10,
            padding: '20px 28px',
          }}
        >
          <p style={{ color: '#D4AF37', fontWeight: 700, fontSize: 13, margin: '0 0 10px' }}>
            📸 How to use this flyer
          </p>
          <ul style={{ color: '#8BA3B5', fontSize: 13, margin: 0, paddingLeft: 18, lineHeight: 2 }}>
            <li><strong style={{ color: '#C9D3DA' }}>Screenshot it:</strong> Zoom out in your browser (Ctrl/Cmd −) until the full card fits, then screenshot. Paste directly into Canva.</li>
            <li><strong style={{ color: '#C9D3DA' }}>Save as PDF:</strong> Click &ldquo;Save as PDF / Print&rdquo; above → destination: &ldquo;Save as PDF&rdquo; → Letter size. Import into Canva or print directly.</li>
            <li><strong style={{ color: '#C9D3DA' }}>Canva tip:</strong> In Canva, create a new &ldquo;Letter&rdquo; design, import this screenshot as the background, then layer your own text/logo on top if needed.</li>
            <li><strong style={{ color: '#C9D3DA' }}>QR code</strong> points live to <strong style={{ color: '#F5F1E6' }}>trophycast.app</strong> — the waitlist form is on the homepage.</li>
          </ul>
        </div>

      </div>
    </>
  );
}
