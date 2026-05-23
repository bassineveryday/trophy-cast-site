'use client';

import { TC_LOGOS } from '@/lib/brandAssets';
import { CLUB_WEB_LOGOS } from '@/lib/clubBrandAssets';

/**
 * DBM Juniors Tournament — Trophy Cast Intro Flyer (Full Page)
 * Single full-page letter flyer — large fonts, easy to read for kids.
 * Route: /flyer/dbm-juniors
 */

const GOLD = '#D4AF37';
const GREEN = '#88AC2E';
const GREEN_DARK = '#5D6D24';
const GOLD_DARK = '#B8960C';
const GREEN_LIGHT = '#B5D45A';

// QR code → Trophy Cast app login/signup
const QR_URL =
  'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Ftrophy-cast-mvp-v2.vercel.app%2F&bgcolor=ffffff&color=000000&margin=6';
const APP_HOST = 'trophycast.app';

const STEPS = [
  {
    num: '1',
    icon: '📲',
    title: 'Scan the QR code',
    body: 'Opens Trophy Cast in your browser. Sign in with your account — or tap Sign Up if it\'s your first time.',
    color: GOLD,
  },
  {
    num: '2',
    icon: '🐟',
    title: 'Log your catch',
    body: 'Tap Log Catch → pick species → enter weight & length → hit Submit. Done in about 15 seconds.',
    color: GREEN,
  },
  {
    num: '3',
    icon: '🏆',
    title: 'Check the leaderboard',
    body: 'Tap Tournaments to see standings — your weight, your rank, and where everyone else stands.',
    color: GOLD,
  },
  {
    num: '4',
    icon: '📊',
    title: 'Your stats grow every trip',
    body: 'TC Coach tracks your baits, spots, and patterns. The more you fish, the smarter your tips get.',
    color: GREEN,
  },
];

function FlyerPage() {
  return (
    <div
      className="flyer-card"
      style={{
        width: 816,
        minHeight: 1056,
        background: '#050E18',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: -100, left: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(136,172,46,0.08), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: -80, width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.06), transparent 70%)', pointerEvents: 'none' }} />

      {/* Top accent bar */}
      <div className="accent-bar" style={{ height: 8, background: `linear-gradient(90deg, ${GOLD}, ${GREEN}, ${GOLD})`, flexShrink: 0 }} />

      {/* ── HEADER ── */}
      <div style={{ padding: '36px 56px 24px', display: 'flex', alignItems: 'center', gap: 32 }}>
        {/* Logos stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CLUB_WEB_LOGOS.DBMJ} alt="DBM Juniors" height={100} style={{ display: 'block', objectFit: 'contain', maxWidth: 170 }} />
          <div style={{ width: 40, height: 1, background: `rgba(136,172,46,0.35)` }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={TC_LOGOS.icon256} alt="Trophy Cast" height={68} style={{ display: 'block', objectFit: 'contain' }} />
          <span className="logo-label" style={{ color: '#fff', fontSize: 16, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>TROPHY CAST</span>
        </div>

        {/* Title block */}
        <div style={{ flex: 1 }}>
          <div className="event-label" style={{ color: GREEN_LIGHT, fontSize: 15, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            Denver BassMasters Juniors · Tournament Day
          </div>
          <h1 className="headline" style={{
            fontSize: 56, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.0, letterSpacing: '-1px',
            background: `linear-gradient(90deg, ${GOLD} 0%, #F0D060 50%, ${GREEN_LIGHT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Get on Trophy Cast Today
          </h1>
          <div className="subhead" style={{ color: 'rgba(200,215,225,0.65)', fontSize: 18, lineHeight: 1.5 }}>
            Log your catch · Check the leaderboard · Build your fishing history
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '0 56px', height: 1, background: `linear-gradient(90deg, transparent, rgba(136,172,46,0.4), transparent)` }} />

      {/* ── WHAT IS TROPHY CAST ── */}
      <div className="what-box" style={{
        margin: '28px 56px 24px',
        background: 'rgba(10,22,36,0.85)',
        borderLeft: `5px solid ${GOLD}`,
        borderRadius: '0 10px 10px 0',
        padding: '18px 24px',
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>
          What is Trophy Cast?
        </div>
        <p className="what-text" style={{ margin: 0, fontSize: 18, color: 'rgba(220,230,240,0.9)', lineHeight: 1.65 }}>
          Trophy Cast is your club&apos;s official app. Log your catches, check tournament
          standings, and watch your stats grow every season.{' '}
          <strong style={{ color: '#fff' }}>TC Coach</strong> learns how <em>you</em> fish —
          your baits, your spots, your patterns — and gives you smarter tips the more you use it.
        </p>
      </div>

      {/* ── STEPS ── */}
      <div style={{ padding: '0 56px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {STEPS.map((step) => (
          <div
            key={step.num}
            className={`step-card step-${step.color === GOLD ? 'gold' : 'green'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              background: 'rgba(10,22,36,0.8)',
              borderLeft: `5px solid ${step.color}`,
              borderRadius: '0 10px 10px 0',
              padding: '18px 22px',
            }}
          >
            {/* Number badge */}
            <div style={{
              flexShrink: 0, width: 48, height: 48, borderRadius: '50%',
              background: step.color === GOLD ? 'rgba(212,175,55,0.18)' : 'rgba(136,172,46,0.18)',
              border: `2.5px solid ${step.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 900, color: step.color,
            }}>
              {step.num}
            </div>
            <span style={{ fontSize: 32, flexShrink: 0 }}>{step.icon}</span>
            <div>
              <div className={`tip-title tip-title-${step.color === GOLD ? 'gold' : 'green'}`} style={{
                fontSize: 22, fontWeight: 800,
                color: step.color === GOLD ? GOLD : GREEN_LIGHT,
                marginBottom: 5,
              }}>
                {step.title}
              </div>
              <div className="tip-body" style={{ fontSize: 16, color: 'rgba(220,230,240,0.82)', lineHeight: 1.55 }}>
                {step.body}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── QR + TAGLINE ROW ── */}
      <div style={{ padding: '28px 56px 24px', display: 'flex', alignItems: 'center', gap: 40 }}>
        {/* QR */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 8, display: 'inline-block', boxShadow: `0 0 0 3px ${GREEN}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QR_URL} alt="Scan to open Trophy Cast" width={140} height={140} style={{ display: 'block' }} />
          </div>
          <div className="qr-label" style={{ color: GREEN_LIGHT, fontSize: 16, fontWeight: 800, marginTop: 10 }}>
            Scan to open the app
          </div>
          <div style={{ color: 'rgba(200,215,225,0.45)', fontSize: 13, marginTop: 3 }}>{APP_HOST}</div>
        </div>

        {/* Tagline */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: 'rgba(136,172,46,0.1)',
            border: `1.5px solid rgba(136,172,46,0.35)`,
            borderRadius: 12,
            padding: '22px 30px',
          }}>
            <div className="tagline-text" style={{ fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1.3, marginBottom: 10 }}>
              &ldquo;The more you fish,
              <br />the smarter it gets.&rdquo;
            </div>
            <div style={{ fontSize: 16, color: 'rgba(200,215,225,0.55)' }}>
              Every catch you log teaches TC Coach your patterns. Start today.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-text" style={{ padding: '0 56px 20px', color: 'rgba(200,215,225,0.3)', fontSize: 13, textAlign: 'center' }}>
        Questions? Ask your coach · trophycast.app · Where Every Cast Counts
      </div>

      {/* Bottom accent bar */}
      <div className="accent-bar" style={{ height: 8, background: `linear-gradient(90deg, ${GOLD}, ${GREEN}, ${GOLD})`, flexShrink: 0 }} />
    </div>
  );
}

export default function DBMJuniorsFlyerPage() {
  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        .flyer-card { color-adjust: exact; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        @media print {
          .no-print { display: none !important; }
          nav, header, footer { display: none !important; }
          body { background: #fff !important; margin: 0; padding: 0; }
          .page-wrap { padding: 0 !important; background: #fff !important; }

          .flyer-card { background: #fff !important; color: #111 !important; min-height: 0 !important; }
          .accent-bar { background: ${GOLD_DARK} !important; }
          .logo-label { color: #111 !important; }
          .qr-label { color: ${GREEN_DARK} !important; }
          .tagline-text { color: #111 !important; }
          .event-label { color: ${GREEN_DARK} !important; }
          .headline { background: none !important; -webkit-text-fill-color: #111 !important; color: #111 !important; }
          .subhead { color: #444 !important; }
          .what-box { background: #fdf8e6 !important; border-left-color: ${GOLD_DARK} !important; }
          .what-text { color: #333 !important; }
          .step-card { background: #f5f5f5 !important; }
          .step-card.step-gold { border-left-color: ${GOLD_DARK} !important; }
          .step-card.step-green { border-left-color: ${GREEN_DARK} !important; }
          .tip-title-gold { color: ${GOLD_DARK} !important; }
          .tip-title-green { color: ${GREEN_DARK} !important; }
          .tip-body { color: #333 !important; }
          .footer-text { color: #888 !important; }
        }

        @page { size: letter; margin: 0.2in; }
      `}</style>

      {/* Controls bar */}
      <div className="no-print" style={{
        background: '#050E18', borderBottom: '1px solid rgba(136,172,46,0.2)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <span style={{ color: '#C9D3CA', fontSize: 13 }}>
          🎣 <strong style={{ color: '#F5F5EE' }}>DBM Juniors Tournament Flyer</strong> — full page, print one per angler
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={handlePrint} style={{
            background: GREEN, border: 'none', borderRadius: 8, color: '#000',
            padding: '7px 18px', fontSize: 13, cursor: 'pointer', fontWeight: 800,
          }}>
            🖨 Save as PDF / Print
          </button>
        </div>
      </div>

      {/* Page wrapper */}
      <div className="page-wrap" style={{
        minHeight: '100vh', background: '#040504',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 16px 64px',
      }}>
        <FlyerPage />
      </div>
    </>
  );
}


function HalfSheet() {
  return (
    <div
      className="half-sheet"
      style={{
        width: 816,
        height: 504,
        background: '#050E18',
        display: 'flex',
        flexDirection: 'column',
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div
        className="accent-bar"
        style={{
          height: 5,
          background: `linear-gradient(90deg, ${GOLD}, ${GREEN}, ${GOLD})`,
          flexShrink: 0,
        }}
      />

      {/* Main content row */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          padding: '14px 24px 12px',
          gap: 22,
        }}
      >
        {/* ── Left column ── */}
        <div
          style={{
            width: 168,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {/* DBM Juniors logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLUB_WEB_LOGOS.DBMJ}
            alt="DBM Juniors"
            height={72}
            style={{ display: 'block', objectFit: 'contain', maxWidth: 148 }}
          />

          {/* TC logo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TC_LOGOS.icon256}
              alt="Trophy Cast"
              height={58}
              style={{ display: 'block', objectFit: 'contain' }}
            />
            <span
              className="logo-label"
              style={{
                color: '#fff',
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              TROPHY CAST
            </span>
            <span
              style={{
                color: 'rgba(200,215,225,0.45)',
                fontSize: 9.5,
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              Your official club app
            </span>
          </div>

          {/* QR code */}
          <div
            style={{
              background: '#fff',
              borderRadius: 8,
              padding: 5,
              display: 'inline-block',
              boxShadow: `0 0 0 2px ${GREEN}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={QR_URL}
              alt="Scan to open Trophy Cast"
              width={90}
              height={90}
              style={{ display: 'block' }}
            />
          </div>
          <span
            className="qr-label"
            style={{
              color: GREEN_LIGHT,
              fontSize: 9.5,
              fontWeight: 700,
              textAlign: 'center',
              letterSpacing: '0.05em',
            }}
          >
            {APP_HOST}
          </span>

          {/* Tagline pill */}
          <div
            className="tagline-pill"
            style={{
              background: `rgba(136,172,46,0.12)`,
              border: `1px solid rgba(136,172,46,0.4)`,
              borderRadius: 100,
              padding: '4px 10px',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                color: GREEN_LIGHT,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              The more you fish,
              <br />
              the smarter it gets
            </span>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ marginBottom: 10 }}>
            <div
              className="event-label"
              style={{
                color: GREEN_LIGHT,
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 3,
              }}
            >
              Denver BassMasters Juniors · Tournament Day
            </div>
            <h1
              className="headline"
              style={{
                fontSize: 26,
                fontWeight: 900,
                margin: '0 0 3px',
                lineHeight: 1.05,
                letterSpacing: '-0.5px',
                background: `linear-gradient(90deg, ${GOLD} 0%, #F0D060 55%, ${GREEN_LIGHT} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Get on Trophy Cast Today
            </h1>
            <div
              className="subhead"
              style={{
                color: 'rgba(200,215,225,0.55)',
                fontSize: 10.5,
                marginTop: 2,
              }}
            >
              Track your catch · See the leaderboard · Build your fishing history
            </div>
          </div>

          {/* What is Trophy Cast? */}
          <div
            className="what-box"
            style={{
              background: 'rgba(10,22,36,0.8)',
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: '0 6px 6px 0',
              padding: '7px 12px',
              marginBottom: 9,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: GOLD,
              }}
            >
              What is Trophy Cast?
            </span>
            <p
              className="what-text"
              style={{
                margin: '3px 0 0',
                fontSize: 11.5,
                color: 'rgba(220,230,240,0.88)',
                lineHeight: 1.5,
              }}
            >
              Trophy Cast is your club&apos;s official app. Log your catches,
              check live tournament standings, and watch your personal stats
              grow over the season. TC Coach learns how{' '}
              <em>you</em> fish — your baits, your spots, your patterns — and
              gives you smarter tips the more you use it.
            </p>
          </div>

          {/* Tips */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              flex: 1,
            }}
          >
            {TIPS.map((tip, idx) => (
              <div
                key={tip.title}
                className={`step-card step-${idx % 2 === 0 ? 'gold' : 'green'}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 9,
                  background: 'rgba(10,22,36,0.75)',
                  borderLeft: `3px solid ${idx % 2 === 0 ? GOLD : GREEN}`,
                  borderRadius: '0 6px 6px 0',
                  padding: '5px 10px',
                }}
              >
                <span style={{ fontSize: 14, lineHeight: 1.4, flexShrink: 0 }}>
                  {tip.icon}
                </span>
                <div>
                  <span
                    className={`tip-title tip-title-${idx % 2 === 0 ? 'gold' : 'green'}`}
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: idx % 2 === 0 ? GOLD : GREEN_LIGHT,
                      marginRight: 6,
                    }}
                  >
                    {tip.title}
                  </span>
                  <span
                    className="tip-body"
                    style={{
                      fontSize: 10.5,
                      color: 'rgba(220,230,240,0.82)',
                      lineHeight: 1.45,
                    }}
                  >
                    {tip.body}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            className="footer-text"
            style={{
              marginTop: 8,
              color: 'rgba(200,215,225,0.3)',
              fontSize: 9,
            }}
          >
            Questions? Ask your coach · trophycast.app · Where Every Cast
            Counts
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className="accent-bar"
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${GOLD}, ${GREEN}, ${GOLD})`,
          flexShrink: 0,
        }}
      />
    </div>
  );
}

export default function DBMJuniorsFlyerPage() {
  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        /* ── SCREEN ─────────────────────────────────────────── */
        .half-sheet {
          color-adjust: exact;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* ── PRINT ──────────────────────────────────────────── */
        @media print {
          .no-print { display: none !important; }
          nav, header, footer { display: none !important; }
          body { background: #fff !important; margin: 0; padding: 0; }
          .page-wrap { padding: 0 !important; background: #fff !important; }

          .cut-line { border-top: 1px dashed #aaa !important; background: #fff !important; }
          .cut-line span { color: #aaa !important; }

          .half-sheet {
            background: #fff !important;
            border: 1px solid #ccc !important;
            color: #111 !important;
          }

          .accent-bar { background: ${GOLD_DARK} !important; }
          .logo-label { color: #111 !important; font-weight: 800 !important; }
          .qr-label { color: ${GREEN_DARK} !important; font-weight: 700 !important; }
          .tagline-pill { background: #f0f7e0 !important; border-color: ${GREEN_DARK} !important; }
          .tagline-pill span { color: ${GREEN_DARK} !important; }

          .event-label { color: ${GREEN_DARK} !important; }

          .headline {
            background: none !important;
            -webkit-text-fill-color: #111 !important;
            color: #111 !important;
          }

          .subhead { color: #444 !important; }

          .what-box { background: #fdf8e6 !important; border-left-color: ${GOLD_DARK} !important; }
          .what-box span { color: ${GOLD_DARK} !important; }
          .what-text { color: #333 !important; }

          .step-card { background: #f7f7f7 !important; }
          .step-card.step-gold { border-left-color: ${GOLD_DARK} !important; }
          .step-card.step-green { border-left-color: ${GREEN_DARK} !important; }
          .tip-title-gold { color: ${GOLD_DARK} !important; }
          .tip-title-green { color: ${GREEN_DARK} !important; }
          .tip-body { color: #333 !important; }
          .footer-text { color: #888 !important; }
        }

        @page { size: letter; margin: 0.25in; }
      `}</style>

      {/* ── Controls bar (screen only) ── */}
      <div
        className="no-print"
        style={{
          background: '#050E18',
          borderBottom: '1px solid rgba(136,172,46,0.2)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ color: '#C9D3CA', fontSize: 13 }}>
          🎣{' '}
          <strong style={{ color: '#F5F5EE' }}>
            DBM Juniors Flyer
          </strong>{' '}
          — two half-sheets per page, cut on the dashed line
        </span>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <button
            onClick={handlePrint}
            style={{
              background: GREEN,
              border: 'none',
              borderRadius: 8,
              color: '#000',
              padding: '7px 18px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: 800,
            }}
          >
            🖨 Save as PDF / Print
          </button>
        </div>
      </div>

      {/* ── Page wrapper ── */}
      <div
        className="page-wrap"
        style={{
          minHeight: '100vh',
          background: '#040504',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 16px 64px',
          gap: 0,
        }}
      >
        <HalfSheet />

        {/* Cut line */}
        <div
          className="cut-line"
          style={{
            width: 816,
            borderTop: '1.5px dashed rgba(136,172,46,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 0',
            background: 'transparent',
          }}
        >
          <span
            style={{
              color: 'rgba(136,172,46,0.3)',
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            ✂ cut here
          </span>
        </div>

        <HalfSheet />
      </div>
    </>
  );
}
