'use client';

import { TC_LOGOS } from '@/lib/brandAssets';
const GOLD = '#D4AF37';
const GREEN = '#88AC2E';
const GREEN_DARK = '#5D6D24';
const GOLD_DARK = '#B8960C';
const GREEN_LIGHT = '#B5D45A';

const QR_URL =
  'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Ftrophy-cast-mvp-v2.vercel.app%2F&bgcolor=ffffff&color=000000&margin=6';
const APP_HOST = 'trophy-cast-mvp-v2.vercel.app';
const WEBSITE_HOST = 'trophycast.app';
const DBMJ_HEADER_LOGO = '/DBMJ%20Long%20Logo%20(2).jpg';
const DBM_LOGO = '/dbm-logo-transparent.png';
const CATCH_RATE_LOGO = '/tlo-logo.jpg';
const HIGH_SCHOOL_LOGO = '/FRBC%20Logo.png';
const CONTACT_NAME = 'Tai Hunt';
const CONTACT_EMAIL = 'tai@trophycast.app';
const CONTACT_PHONE = '(480) 720-4705';

const STEPS = [
  {
    num: '1',
    icon: '📲',
    title: 'Create your account and join your club',
    body: 'Set up on phone or computer at home, then be ready before the next tournament.',
    color: GOLD,
  },
  {
    num: '2',
    icon: '🐟',
    title: 'Use it where it matters: outside fishing',
    body: 'Log real catches on the water. If kids are on their phones, this is where that time turns into growth.',
    color: GREEN,
  },
  {
    num: '3',
    icon: '📊',
    title: 'Train TC Coach your way',
    body: 'The more you log fish, the smarter TC Coach gets for your style, lures, equipment, and decisions.',
    color: GOLD,
  },
];

function FlyerPage() {
  return (
    <div
      className="flyer-card flyer-front"
      style={{
        width: 816,
        background: '#fffdf8',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 18px 48px rgba(0,0,0,0.18)',
        border: '1px solid rgba(212,175,55,0.2)',
      }}
    >
      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: -100, left: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(136,172,46,0.06), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: -80, width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.05), transparent 70%)', pointerEvents: 'none' }} />

      {/* Top accent bar */}
      <div className="accent-bar" style={{ height: 8, background: `linear-gradient(90deg, ${GOLD}, ${GREEN}, ${GOLD})`, flexShrink: 0 }} />

      {/* HEADER */}
      <div style={{ padding: '20px 34px 12px' }}>
        {/* Logo row — no bubbles */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, marginBottom: 12, width: '100%', transform: 'translateX(-40px)' }}>
          <div style={{ width: 510, maxWidth: '70%', height: 138, flexShrink: 1, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TC_LOGOS.horizontal}
              alt="Trophy Cast"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transform: 'scale(1.9) translateY(6%)',
                transformOrigin: 'center center',
              }}
            />
          </div>
          <div style={{ width: 312, maxWidth: '40%', height: 132, flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={DBMJ_HEADER_LOGO} alt="Denver BassMasters Juniors" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
        {/* Title */}
        <div className="event-label" style={{ color: GREEN_DARK, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
          Tournament Day &middot; May 23, 2026 &middot; Donovan&rsquo;s Pond
        </div>
        <h1 className="headline" style={{
          fontSize: 38, fontWeight: 900, margin: '0 0 5px', lineHeight: 1.0, letterSpacing: '-1px',
          color: '#111827',
        }}>
          Fish More. Build Confidence Faster.
        </h1>
        <div className="subhead" style={{ color: '#5b6470', fontSize: 14, lineHeight: 1.3 }}>
          Every cast is one step closer to your best day.
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '0 34px', height: 1, background: 'linear-gradient(90deg, transparent, rgba(136,172,46,0.3), transparent)' }} />

      {/* WHAT IS TROPHY CAST */}
      <div className="what-box" style={{
        margin: '14px 34px 12px',
        background: '#f8f1dc',
        borderLeft: `5px solid ${GOLD}`,
        borderRadius: '0 10px 10px 0',
        padding: '12px 16px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>
          Straight up: what this app does
        </div>
        <p className="what-text" style={{ margin: 0, fontSize: 16, color: '#334155', lineHeight: 1.55 }}>
          Trophy Cast is an app for anglers who want to get better, trip after trip.
          The more catches your angler logs, the smarter TC Coach gets with tips on patterns, lures, and gear.
          Parents can see real progress, stronger confidence, and healthier phone time focused on learning a sport they love.
          This summer, clubs can talk fishing, motivate each other, and set up practice together.
        </p>
      </div>

      {/* TC Coach visual tease */}
      <div style={{ padding: '10px 34px 0' }}>
        <div style={{
          background: '#f0f7e3',
          border: '1px solid rgba(136,172,46,0.4)',
          borderLeft: `5px solid ${GREEN}`,
          borderRadius: 10,
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN_DARK, marginBottom: 6 }}>
            Sample TC Coach Tip
          </div>
          <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.45 }}>
            &ldquo;Pattern alert: no wind and shaded trees. You caught 3 fish on a green pumpkin Senko, so start there first and target shade lines.&rdquo;
          </div>
        </div>
      </div>

      {/* QR + STEPS ROW */}
      <div style={{ padding: '16px 34px 10px', display: 'grid', gridTemplateColumns: '250px 1fr', gap: 14, alignItems: 'start' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 6, display: 'inline-block', boxShadow: `0 0 0 3px ${GREEN}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QR_URL} alt="Scan to open Trophy Cast" width={108} height={108} style={{ display: 'block' }} />
          </div>
          <div className="qr-label" style={{ color: GREEN_LIGHT, fontSize: 12, fontWeight: 800, marginTop: 6 }}>
            Scan to open the app
          </div>
          <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>{APP_HOST}</div>
          <div style={{ color: '#475569', fontSize: 10.5, marginTop: 2 }}>
            Computer login: {APP_HOST}
          </div>
          <div style={{ color: '#64748b', fontSize: 10.5, marginTop: 1 }}>
            Website: {WEBSITE_HOST}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {STEPS.map((step) => (
            <div
              key={`single-${step.num}`}
              className={`step-card step-${step.color === GOLD ? 'gold' : 'green'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#f3f4f6',
                borderLeft: `4px solid ${step.color}`,
                borderRadius: '0 9px 9px 0',
                padding: '9px 10px',
              }}
            >
              <div style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: step.color === GOLD ? 'rgba(212,175,55,0.18)' : 'rgba(136,172,46,0.18)',
                border: `2px solid ${step.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 900,
                color: step.color,
              }}>
                {step.num}
              </div>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{step.icon}</span>
              <div>
                <div className={`tip-title tip-title-${step.color === GOLD ? 'gold' : 'green'}`} style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: step.color === GOLD ? GOLD : GREEN_LIGHT,
                  marginBottom: 2,
                  lineHeight: 1.1,
                }}>
                  {step.title}
                </div>
                <div className="tip-body" style={{ fontSize: 11.5, color: '#475569', lineHeight: 1.25 }}>
                  {step.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION + SUPPORT ROW */}
      <div style={{ padding: '4px 34px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{
          background: '#fff4de',
          border: '2px solid rgba(212,175,55,0.7)',
          borderRadius: 12,
          padding: '12px 14px',
          boxShadow: '0 0 0 2px rgba(212,175,55,0.2), 0 6px 14px rgba(15,23,42,0.06)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD_DARK, marginBottom: 8 }}>
            Before Next Tournament Checklist
          </div>
          <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.4, marginBottom: 2 }}>□ Account created</div>
          <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.4, marginBottom: 2 }}>□ Login works on phone + computer</div>
          <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.4, marginBottom: 2 }}>□ One practice test catch submitted</div>
          <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.4 }}>□ Clubhouse explored</div>
        </div>

        <div style={{
          background: '#f6f8ee',
          border: '1.5px solid rgba(136,172,46,0.35)',
          borderRadius: 12,
          padding: '12px 14px',
          boxShadow: '0 6px 14px rgba(15,23,42,0.05)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN_DARK, marginBottom: 8 }}>
            Questions or Suggestions?
          </div>
          <div style={{ fontSize: 11.5, lineHeight: 1.35, color: '#64748b', marginBottom: 8 }}>
            Trophy Cast is in private beta and active testing. You may run into bugs. Your feedback helps us improve.
          </div>
          <div style={{ height: 1, background: 'rgba(136,172,46,0.22)', marginBottom: 8 }} />
          <div style={{ fontSize: 12, lineHeight: 1.35, color: '#334155' }}>
            Text or call <strong style={{ color: '#111827' }}>{CONTACT_NAME}</strong> at <strong style={{ color: '#111827', whiteSpace: 'nowrap' }}>{CONTACT_PHONE}</strong>
          </div>
          <div style={{ marginTop: 4, fontSize: 12, lineHeight: 1.35, color: '#334155' }}>
            Email: {CONTACT_EMAIL}
          </div>
        </div>
      </div>

      {/* Logo family strip */}
      <div style={{ padding: '2px 34px 12px' }}>
        <div style={{
          border: '1.5px solid rgba(212,175,55,0.32)',
          borderRadius: 12,
          background: 'linear-gradient(180deg, #fffaf0 0%, #fff6e7 100%)',
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: '0 6px 14px rgba(15,23,42,0.05)',
        }}>
          <div style={{
            fontSize: 9.5,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: GOLD_DARK,
            whiteSpace: 'nowrap',
            background: 'rgba(212,175,55,0.14)',
            borderRadius: 999,
            padding: '3px 7px',
            lineHeight: 1,
          }}>
            All on Trophy Cast
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <div style={{ width: 132, height: 34, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DBM_LOGO} alt="Denver BassMasters" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ width: 1, height: 20, background: 'rgba(136,172,46,0.24)' }} />
            <div style={{ width: 126, height: 42, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DBMJ_HEADER_LOGO} alt="DBM Juniors" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ width: 1, height: 20, background: 'rgba(136,172,46,0.24)' }} />
            <div style={{ width: 98, height: 34, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CATCH_RATE_LOGO} alt="Catch Rate" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ width: 1, height: 20, background: 'rgba(136,172,46,0.24)' }} />
            <div style={{ width: 126, height: 42, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HIGH_SCHOOL_LOGO} alt="High School" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-text" style={{ padding: '2px 34px 14px', color: '#94a3b8', fontSize: 11, textAlign: 'center' }}>
        Where Every Cast Counts. &middot; trophycast.app &middot; Built for everyone who loves fishing
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

          .flyer-card {
            background: #fff !important;
            color: #111 !important;
            width: 8.5in !important;
            min-height: 11in !important;
            height: 11in !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
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

        @page { size: letter; margin: 0; }
      `}</style>

      {/* Controls bar (screen only) */}
      <div className="no-print" style={{
        background: '#050E18', borderBottom: '1px solid rgba(136,172,46,0.2)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <span style={{ color: '#C9D3CA', fontSize: 13 }}>
          🎣 <strong style={{ color: '#F5F5EE' }}>DBM Juniors Tournament Flyer</strong> &mdash; full page, print one per angler
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
