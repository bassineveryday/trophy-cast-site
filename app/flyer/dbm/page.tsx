'use client';

import { useState } from 'react';
import { toPng } from 'html-to-image';

/**
 * Denver BassMasters — Recruitment Flyer (Dark Digital)
 * ──────────────────────────────────────────────────────
 * Brand palette: #88AC2E (lime green), #000000 (black), #FFFFFF (white)
 * Sampled directly from DBM logo files.
 *
 * QR code → https://www.denverbassmasters.com/join-now
 */

// DBM brand colors
const G = '#88AC2E';   // DBM lime green (primary)
const GL = '#B5D45A';  // light lime
const GD = '#5D6D24';  // deep olive green

export default function DBMFlyerPage() {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => window.print();

  const handleDownloadPng = async () => {
    const node = document.getElementById('dbm-flyer');
    if (!node) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true });
      const link = document.createElement('a');
      link.download = 'denver-bassmasters-flyer.png';
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText('https://www.denverbassmasters.com/join-now');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #070807 !important; margin: 0; padding: 0; }
          .flyer-page-wrap { display: block; padding: 0; }
        }
        @page { size: letter; margin: 0; }
      `}</style>

      {/* Controls bar */}
      <div className="no-print" style={{
        background: '#050605', borderBottom: '1px solid rgba(136,172,46,0.2)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <span style={{ color: '#C9D3CA', fontSize: 13 }}>
          🎣 <strong style={{ color: '#F5F5EE' }}>Denver BassMasters Flyer</strong> — screenshot or print this page
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="/flyer/dbm/print" style={{
            background: 'rgba(136,172,46,0.1)', border: '1px solid rgba(136,172,46,0.35)',
            borderRadius: 8, color: GL, padding: '6px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none',
          }}>🖨 Print version →</a>
          <button onClick={handleCopyUrl} style={{
            background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 8, color: '#D4AF37', padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600,
          }}>{copied ? '✓ Copied!' : 'Copy URL'}</button>
          <button onClick={handleDownloadPng} disabled={downloading} style={{
            background: GD, border: 'none', borderRadius: 8, color: '#fff',
            padding: '6px 16px', fontSize: 12, cursor: downloading ? 'wait' : 'pointer', fontWeight: 700, opacity: downloading ? 0.7 : 1,
          }}>{downloading ? '⏳ Generating...' : '⬇ Download PNG'}</button>
          <button onClick={handlePrint} style={{
            background: G, border: 'none', borderRadius: 8, color: '#000',
            padding: '6px 16px', fontSize: 12, cursor: 'pointer', fontWeight: 800,
          }}>🖨 Save as PDF / Print</button>
        </div>
      </div>

      {/* Page wrapper */}
      <div className="flyer-page-wrap" style={{
        minHeight: '100vh', background: '#040504',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-start', padding: '32px 16px 64px',
      }}>

        {/* THE FLYER CARD */}
        <div id="dbm-flyer" style={{
          width: 816, minHeight: 1056,
          background: 'linear-gradient(165deg, #0C1206 0%, #162008 45%, #0F1C04 100%)',
          border: '1.5px solid rgba(136,172,46,0.25)', borderRadius: 12, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', position: 'relative',
          boxShadow: '0 40px 120px rgba(0,0,0,0.9), 0 0 60px rgba(136,172,46,0.07)',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>

          {/* Ambient glows */}
          <div style={{ position: 'absolute', top: -80, left: -60, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(136,172,46,0.09), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 260, right: -100, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.05), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: '25%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(93,109,36,0.07), transparent 70%)', pointerEvents: 'none' }} />

          {/* Top accent bar */}
          <div style={{ height: 6, background: 'linear-gradient(90deg, #88AC2E, #D4AF37, #88AC2E)' }} />

          {/* HEADER */}
          <div style={{ padding: '44px 64px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(136,172,46,0.12)', border: '1px solid rgba(136,172,46,0.35)',
              borderRadius: 100, padding: '5px 16px', marginBottom: 22,
            }}>
              <span style={{ fontSize: 12 }}>🎣</span>
              <span style={{ color: GL, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Colorado&rsquo;s Premier Bass Fishing Club
              </span>
            </div>
            <div style={{ marginBottom: 18 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Loge%20Transparent%20background.png" alt="Denver BassMasters logo" height={88} style={{ display: 'block', margin: '0 auto', objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: 54, fontWeight: 900, margin: '0 0 6px', lineHeight: 1, letterSpacing: '-1.5px', textTransform: 'uppercase', background: 'linear-gradient(90deg, #D4AF37 0%, #88AC2E 45%, #B5D45A 75%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Denver BassMasters
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(197,213,180,0.5)', margin: '4px 0 8px', fontStyle: 'italic', letterSpacing: '0.06em' }}>
              Building better anglers since the early &lsquo;70s
            </p>
            {/* DBM Family */}
            <div style={{ marginTop: 6, textAlign: 'center' }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(136,172,46,0.5)', margin: '0 0 8px' }}>DBM Family</p>
              <div style={{ display: 'flex', gap: 18, justifyContent: 'center', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Denver%20Bassmaster%20Junior's%20logo%20transparent..png" alt="DBM Juniors" height={36} style={{ objectFit: 'contain', maxWidth: 80 }} />
                  <span style={{ fontSize: 9, color: 'rgba(197,213,180,0.4)', letterSpacing: '0.06em' }}>Juniors Program</span>
                </div>
                <div style={{ width: 1, height: 30, background: 'rgba(136,172,46,0.25)', marginBottom: 14 }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/FRBC%20Logo.png" alt="FRBC" height={36} style={{ objectFit: 'contain', maxWidth: 80 }} />
                  <span style={{ fontSize: 9, color: 'rgba(197,213,180,0.4)', letterSpacing: '0.06em' }}>Front Range Bass Club</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ margin: '0 64px', height: 1, background: 'linear-gradient(90deg, transparent, rgba(136,172,46,0.4), transparent)' }} />

          {/* HERO STATEMENT — side-by-side */}
          <div style={{ padding: '28px 64px 24px', display: 'flex', alignItems: 'center', gap: 44 }}>
            {/* Left: Hook */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 44, fontWeight: 900, color: '#F5F5EE', margin: '0 0 12px', lineHeight: 1.05, letterSpacing: '-1px' }}>
                You Don&rsquo;t Need{' '}
                <span style={{ color: '#88AC2E', background: 'rgba(136,172,46,0.15)', borderRadius: 8, padding: '0 12px', display: 'inline-block' }}>a Boat.</span>
              </h2>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#1A3208', margin: '0 0 14px', lineHeight: 1.4, background: '#B5D45A', display: 'inline-block', borderRadius: 8, padding: '2px 18px' }}>Just a love for bass fishing.</p>
              <p style={{ fontSize: 13, color: '#8A9E6A', margin: 0, lineHeight: 1.65, maxWidth: 380 }}>
                Boaters and non-boaters are paired for every tournament. Whether you own a bass boat or just a rod and reel, you belong here.
              </p>
            </div>
            {/* Right: QR */}
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              <div style={{ background: G, borderRadius: 16, padding: 12, display: 'inline-block', boxShadow: '0 8px 40px rgba(136,172,46,0.4)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Fwww.denverbassmasters.com%2Fjoin-now&color=0C0F08&bgcolor=88AC2E&qzone=1"
                  alt="QR code — denverbassmasters.com/join-now"
                  width={148} height={148} style={{ display: 'block', borderRadius: 8 }}
                />
              </div>
              <p style={{ color: '#8A9E6A', fontSize: 11, margin: '8px 0 3px', textAlign: 'center' }}>Scan to join</p>
              <p style={{ color: GL, fontWeight: 800, fontSize: 12, margin: 0 }}>denverbassmasters.com</p>
            </div>
          </div>

          {/* FEATURE TILES */}
          <div style={{ padding: '0 64px 34px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
            {[
              { icon: '🚤', title: 'Boater & Co-Angler Tournaments', body: 'DBM runs card tournaments — catch a fish, weigh it, record it on your card, and release it. A boater and co-angler are paired every event. You fish as a team, you compete as individuals — and you always leave with more knowledge than you came with.' },
              { icon: '🏆', title: 'One path, five levels of competition', body: 'Start at the club level. Fish well enough and you qualify for the Colorado Bass Nation (CBN) State Tournament. From there: Regionals → Nationals → and if you\'re that good, a shot at the Bassmaster Classic. It all starts right here.' },
              { icon: '🎣', title: 'A club that makes you better', body: 'Every monthly meeting features a guest speaker — technique breakdowns, electronics, seasonal patterns. Away card tournaments include education too. This isn\'t a cutthroat club — it\'s a mentorship culture. We compete, but we grow together.' },
              { icon: '📲', title: 'Get connected, get involved', body: 'DBM is building a modern club — group chats, committees, and centralized communication so members stay connected year-round. Join a committee and help shape the direction of the club. Your voice matters here.' },
              { icon: '📱', title: 'Official Club App — Trophy Cast', body: 'Card tournament results, AOY standings, your personal stats, club communication, and a growing knowledge base — all in the Trophy Cast app. Everything you need to track your season and stay tight with the club, in your pocket.' },
            ].map((item) => (
              <div key={item.title} style={{
                background: 'rgba(18,38,8,0.75)', border: '1px solid rgba(136,172,46,0.25)',
                borderLeft: '3px solid #88AC2E', borderRadius: '0 10px 10px 0',
                padding: '15px 18px', display: 'flex', flexDirection: 'column', gap: 5,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 19 }}>{item.icon}</span>
                  <span style={{ color: '#D0F080', fontWeight: 700, fontSize: 13, background: 'rgba(136,172,46,0.2)', borderRadius: 4, padding: '1px 8px' }}>{item.title}</span>
                </div>
                <p style={{ color: '#8A9E6A', fontSize: 12, margin: 0, lineHeight: 1.55 }}>{item.body}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ margin: '0 64px', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)' }} />

          {/* CTA SECTION */}
          <div style={{ padding: '28px 64px 28px' }}>
            <p style={{ fontSize: 12, color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Join Denver BassMasters</p>
            <h2 style={{ fontSize: 33, fontWeight: 900, color: '#F5F5EE', margin: '0 0 12px', lineHeight: 1.15, letterSpacing: '-0.5px' }}>
              Ready to fish <span style={{ color: '#D4AF37' }}>with us?</span>
            </h2>
            <p style={{ color: '#8A9E6A', fontSize: 13, margin: '0 0 16px', lineHeight: 1.65, maxWidth: 560 }}>
              Meetings are open to everyone. Come check us out — no commitment required.
              Visit <strong style={{ color: '#F5F5EE' }}>denverbassmasters.com</strong> to learn more and sign up.
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(136,172,46,0.12)', border: '1.5px solid rgba(136,172,46,0.45)',
              borderRadius: 100, padding: '10px 22px', marginBottom: 14,
            }}>
              <span style={{ fontSize: 16 }}>🎣</span>
              <span style={{ color: GL, fontWeight: 800, fontSize: 15.5 }}>denverbassmasters.com/join-now</span>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { icon: '📅', text: 'First Wednesday of the month' },
                { icon: '🕕', text: '7:00 PM' },
                { icon: '📍', text: 'Bass Pro Shops Denver' },
              ].map((m) => (
                <div key={m.text} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 12 }}>{m.icon}</span>
                  <span style={{ color: 'rgba(181,212,90,0.55)', fontSize: 11 }}>{m.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TROPHY CAST PARTNER BANNER */}
          <div style={{
            margin: '0 48px 14px',
            background: 'linear-gradient(90deg, rgba(212,175,55,0.09), rgba(136,172,46,0.07))',
            border: '1px solid rgba(212,175,55,0.25)', borderRadius: 10, padding: '13px 22px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <span style={{ fontSize: 22 }}>🏆</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#D4AF37', fontWeight: 800, fontSize: 12.5, margin: '0 0 3px', letterSpacing: '0.03em' }}>
                Official Club App — Trophy Cast
              </p>
              <p style={{ color: '#8A9E6A', fontSize: 11.5, margin: 0, lineHeight: 1.5 }}>
                Denver BassMasters runs tournaments, AOY standings, and member management on{' '}
                <strong style={{ color: '#F5F5EE' }}>Trophy Cast</strong> — the official app of DBM. Live weigh-ins, club chat, and standings at your fingertips.
              </p>
            </div>
            <div style={{ background: 'rgba(14,18,8,0.7)', border: '1px solid rgba(212,175,55,0.22)', borderRadius: 8, padding: '6px 14px', flexShrink: 0, textAlign: 'center' }}>
              <p style={{ color: '#D4AF37', fontWeight: 800, fontSize: 11, margin: 0 }}>trophycast.app</p>
            </div>
          </div>

          {/* SPONSORS SECTION */}
          <div style={{ margin: '0 48px 32px' }}>
            <p style={{ color: 'rgba(136,172,46,0.45)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 9px', textAlign: 'center' }}>
              Tournament Sponsors
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { name: 'Bass Pro Shops',          src: '/bass-pro-logo-2x.png' },
                { name: 'JJ Bass Jigs',            src: '/JJ-logo-trim%20(2).png' },
                { name: 'Eagle Claw',              src: '/Eagle%20Claw%20logo%20transparent..png' },
                { name: 'Militia Marine',          src: '/Militia%20Marine%20logo.%20Transparent..png' },
                { name: 'Rapala',                  src: '/Rapala%20logo%20transparent..png' },
                { name: 'AA Toppers',              src: '/Topper%20Sales.png' },
                { name: 'Discount Fishing Denver', src: '/Discount%20fishing%20tackle.%20Logo.%20Transparent..png' },
                { name: 'Trophy Cast',             src: '/Trophy%20cast%20white%20background.png' },
              ].map((s) => (
                <div key={s.name} title={s.name} style={{ background: '#fff', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44, minWidth: 44 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.name} height={28} style={{ objectFit: 'contain', maxWidth: 80, display: 'block', mixBlendMode: 'multiply' }} onError={(e) => { (e.currentTarget.parentElement as HTMLDivElement).style.display = 'none'; }} />
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{
              padding: '13px 64px', background: 'rgba(4,6,3,0.8)',
              borderTop: '1px solid rgba(136,172,46,0.2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: G, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>🎣 DENVER BASSMASTERS</span>
              <span style={{ color: 'rgba(136,172,46,0.4)', fontSize: 11 }}>
                denverbassmaster@gmail.com &nbsp;·&nbsp; @dbm812 &nbsp;·&nbsp; denverbassmasters.com
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
