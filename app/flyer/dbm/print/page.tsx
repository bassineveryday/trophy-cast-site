'use client';

import { useEffect, useState } from 'react';

const QR_URL = 'https://trophy-cast-site.vercel.app/join';
const QR_IMAGE = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(QR_URL)}&color=2A4008&bgcolor=FFFFFF&qzone=1`;
const SHEET_WIDTH_IN = 10.5;
const SHEET_HEIGHT_IN = 8;
const CSS_DPI = 96;
const SHEET_WIDTH_PX = SHEET_WIDTH_IN * CSS_DPI;
const SHEET_HEIGHT_PX = SHEET_HEIGHT_IN * CSS_DPI;

const COLORS = {
  green: '#88AC2E',
  greenDark: '#3A5C12',
  greenSoft: '#F4FAF0',
  greenCard: '#DDEBC8',
  greenCardSoft: '#EEF5E4',
  greenMuted: '#6B7F35',
  ink: '#0C0F08',
  text: '#425242',
  paper: '#FFFFFF',
  line: '#D8E6C4',
  blue: '#1B5E8A',
  blueSoft: '#E8F1F8',
};

const INFO_CARDS = [
  {
    title: 'Boater & Co-Angler Events',
    body: 'Every tournament pairs a boater and co-angler — no boat required. Fish competitively from day one and learn on the water.',
  },
  {
    title: 'One Path, Five Levels',
    body: 'DBM → Colorado State Qualifier → Regionals → Nationals → a shot at the Bassmaster Classic.',
  },
  {
    title: 'Juniors to Adults',
    body: 'Start in our Juniors program, move to high school competition, then step into adult DBM — we help you grow every step of the way.',
  },
  {
    title: 'Conservation & Community',
    body: 'Member-led committees drive lake conservation, youth outreach, and club growth — your voice helps shape the future.',
  },
  {
    title: 'A Club That Makes You Better',
    body: 'Monthly speakers, seasonal strategy, electronics tips, and mentorship help anglers improve faster.',
  },
  {
    title: 'Angler of the Year Race',
    body: 'Every tournament earns AOY points. Compete all season for the top spot — your rank updates after every event.',
  },
  {
    title: 'Official Club App',
    body: 'Trophy Cast gives members pairings, AOY standings, stats, messages, and club communication in one place.',
  },
  {
    title: 'More Than a Club',
    body: 'Lifelong friendships, fishing partners, and a crew that shows up for each other — on and off the water.',
  },
];

const SPONSORS = [
  { name: 'Bass Pro Shops', src: '/bass-pro-logo-2x.png', h: 26, mw: 56 },
  { name: 'JJ Bass Jigs', src: '/JJ-logo-trim%20(2).png', h: 26, mw: 52 },
  { name: 'Trophy Cast', src: '/Trophy%20cast%20white%20background.png', h: 30, mw: 62 },
  { name: 'Eagle Claw', src: '/Eagle%20Claw%20logo%20transparent..png', h: 24, mw: 54 },
  { name: 'Militia Marine', src: '/Militia%20Marine%20logo.%20Transparent..png', h: 22, mw: 54 },
  { name: 'Rapala', src: '/Rapala%20logo%20transparent..png', h: 20, mw: 54 },
  { name: 'Discount Fishing Denver', src: '/Discount%20fishing%20tackle.%20Logo.%20Transparent..png', h: 34, mw: 70 },
];

const FAMILY_LOGOS = [
  {
    name: 'DBM Juniors',
    label: 'Juniors Program',
    src: "/Denver%20Bassmaster%20Junior's%20logo%20transparent..png",
    height: 32,
    maxWidth: 80,
  },
  {
    name: 'FRBC',
    label: 'Front Range Bass Club',
    src: '/FRBC%20Logo.png',
    height: 32,
    maxWidth: 62,
  },
  {
    name: 'CBN',
    label: 'Colorado Bass Nation',
    src: '/cbn.png',
    height: 32,
    maxWidth: 62,
  },
];

export default function DBMPrintFlyerPage() {
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const updatePreviewScale = () => {
      const availableWidth = Math.max(window.innerWidth - 48, 320);
      const nextScale = Math.min(1, availableWidth / SHEET_WIDTH_PX);
      setPreviewScale(Number(nextScale.toFixed(3)));
    };

    updatePreviewScale();
    window.addEventListener('resize', updatePreviewScale);

    return () => {
      window.removeEventListener('resize', updatePreviewScale);
    };
  }, []);

  const pageStyles = `
    body > header,
    body > footer {
      display: none !important;
    }
    body > main {
      padding-top: 0 !important;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    @media print {
      .no-print { display: none !important; }
      .sheet-frame {
        overflow: visible !important;
        display: block !important;
        padding-bottom: 0 !important;
      }
      .sheet-shell {
        width: auto !important;
        height: auto !important;
      }
      body { background: #fff !important; margin: 0; padding: 0; }
      .print-wrap { padding: 0 !important; background: #fff !important; }
      .sheet {
        width: ${SHEET_WIDTH_IN}in !important;
        min-width: ${SHEET_WIDTH_IN}in !important;
        height: ${SHEET_HEIGHT_IN}in !important;
        margin: 0 !important;
        position: static !important;
        transform: none !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
      }
      .portrait-half {
        width: 50% !important;
        padding-left: 0.2in !important;
        padding-right: 0.2in !important;
      }
      .cut-guide {
        width: 0 !important;
        border-left: 1px dashed #A7B58C !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
      .cut-guide * { display: none !important; }
    }
    @page { size: letter landscape; margin: 0.25in; }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <div
        className="no-print"
        style={{
          background: COLORS.ink,
          borderBottom: `1px solid ${COLORS.greenDark}`,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          color: '#F1F5E8',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Denver BassMasters Print Flyer</div>
          <div style={{ fontSize: 12, color: '#B5C79B' }}>1 landscape page · 2 portrait flyers side by side</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="/flyer/dbm"
            style={{
              background: 'rgba(136,172,46,0.12)',
              border: `1px solid ${COLORS.greenDark}`,
              borderRadius: 8,
              color: '#D7E6B9',
              padding: '7px 14px',
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Dark version
          </a>
          <button
            onClick={() => window.print()}
            style={{
              background: COLORS.green,
              border: 'none',
              borderRadius: 8,
              color: COLORS.ink,
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <div
        className="no-print"
        style={{
          background: '#EDF5E5',
          borderBottom: `1px solid ${COLORS.line}`,
          padding: '10px 24px',
          fontSize: 12,
          color: COLORS.greenDark,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        Print one landscape page at 100% scale. Use actual size, then cut once down the center.
      </div>

      <div
        className="print-wrap"
        style={{
          minHeight: '100vh',
          background: '#D9DED1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
          padding: '28px 16px 56px',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <SheetPreview label="Single-sided · 2 portrait flyers side by side" previewScale={previewScale}>
          <PortraitHalfFlyer />
          <CutGuide />
          <PortraitHalfFlyer />
        </SheetPreview>

        <div
          className="no-print"
          style={{
            width: '8in',
            maxWidth: '100%',
            background: 'rgba(12,15,8,0.9)',
            border: `1px solid ${COLORS.greenDark}`,
            borderRadius: 10,
            padding: '16px 20px',
            color: '#D7E6B9',
          }}
        >
          <div style={{ color: COLORS.green, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Print workflow</div>
          <div style={{ fontSize: 12, lineHeight: 1.7 }}>
            1. Print one landscape page.
            <br />
            2. Keep scale at 100% or Actual Size.
            <br />
            3. Cut once down the center to make two portrait half-sheet flyers.
          </div>
        </div>
      </div>
    </>
  );
}

function SheetPreview({ label, children, previewScale }: { label: string; children: React.ReactNode; previewScale: number }) {
  const scaledWidth = Math.round(SHEET_WIDTH_PX * previewScale);
  const scaledHeight = Math.round(SHEET_HEIGHT_PX * previewScale);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', width: '100%' }}>
      <div
        className="no-print"
        style={{
          width: '10.5in',
          maxWidth: '100%',
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: COLORS.greenDark,
        }}
      >
        {label}
      </div>
      <div className="sheet-frame" style={{ width: '100%', overflowX: 'visible', overflowY: 'visible', paddingBottom: 4 }}>
        <div className="sheet-shell" style={{ width: scaledWidth, height: scaledHeight, margin: '0 auto', position: 'relative' }}>
          <div
            className="sheet"
            style={{
              width: `${SHEET_WIDTH_IN}in`,
              minWidth: `${SHEET_WIDTH_IN}in`,
              height: `${SHEET_HEIGHT_IN}in`,
              position: 'absolute',
              left: '50%',
              top: 0,
              transform: `translateX(-50%) scale(${previewScale})`,
              transformOrigin: 'top center',
              background: COLORS.paper,
              display: 'grid',
              gridTemplateColumns: '1fr 0px 1fr',
              border: 'none',
              borderRadius: 0,
              overflow: 'hidden',
              boxShadow: '0 10px 36px rgba(0,0,0,0.14)',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function CutGuide() {
  return (
    <div
      className="cut-guide"
      style={{
        width: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        boxSizing: 'border-box',
        borderLeft: '1px dashed #A7B58C',
      }}
    />
  );
}

function PortraitHalfFlyer() {
  return (
    <div
      className="portrait-half"
      style={{
        height: '100%',
        background: COLORS.paper,
        padding: '8px 20px 8px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ height: 4, width: '100%', background: COLORS.green, borderRadius: 999, marginBottom: 4 }} />

      <div style={{ textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Loge%20Transparent%20background.png"
          alt="Denver BassMasters logo"
          height={158}
          style={{ display: 'block', height: 158, width: 'auto', maxWidth: '100%', margin: '0 auto -38px', objectFit: 'contain' }}
        />
        <div style={{ marginTop: '0.3in' }}>
          <h1 style={{ fontSize: 33.3, lineHeight: 0.93, margin: '0 0 5px', color: COLORS.ink, fontWeight: 900, letterSpacing: '-0.05em' }}>
            You Don&rsquo;t Need <span style={{ color: COLORS.greenDark }}>a Boat.</span>
          </h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.08, margin: '8px 0 10px', color: COLORS.text, fontWeight: 600, fontStyle: 'italic' }}>
            Just a love for bass fishing.
          </p>
          <div
            style={{
              fontSize: 10.0,
              lineHeight: 1.15,
              marginTop: 2,
              color: COLORS.greenMuted,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, flexWrap: 'wrap' }}>
              {['Boaters & Co-Anglers Paired', 'Open Meetings', 'State-to-Classic Path'].map((tag) => (
                <span key={tag} style={{
                  background: COLORS.greenCard,
                  border: `1px solid ${COLORS.green}`,
                  borderRadius: 999,
                  padding: '2px 9px',
                  fontSize: 9.0,
                  fontWeight: 800,
                  color: COLORS.greenDark,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: COLORS.line, margin: '7px 20px 0', borderRadius: 1 }} />

      <div
        style={{
          marginTop: 5,
          background: COLORS.blueSoft,
          border: `1.5px solid ${COLORS.blue}`,
          borderRadius: 9,
          padding: '5px 9px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, color: COLORS.blue, fontSize: 12.3, fontWeight: 900 }}>Meetings</div>
        <div style={{ flex: 1, textAlign: 'center', color: COLORS.ink, fontSize: 10.8, fontWeight: 700 }}>First Wednesday · 7:00 PM</div>
        <div style={{ flex: 1, textAlign: 'right', color: COLORS.blue, fontSize: 10.8, fontWeight: 700 }}>Bass Pro Shops Denver</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 4, rowGap: 2, marginTop: 7, alignContent: 'start' }}>
        {INFO_CARDS.map((point) => (
          <div
            key={point.title}
            style={{
              background: `linear-gradient(180deg, ${COLORS.greenCard} 0%, ${COLORS.greenCardSoft} 100%)`,
              border: `1px solid #C7D9AE`,
              borderRadius: 7,
              padding: '4px 7px 5px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.72), 0 0 0 1px rgba(136,172,46,0.08)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: 12.6, lineHeight: 1.1, marginBottom: 1, color: point.featured ? COLORS.blue : COLORS.greenDark, fontWeight: 900 }}>{point.title}</div>
            <div style={{ fontSize: 10.2, lineHeight: 1.2, color: COLORS.text }}>{point.body}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 104px', gap: 8, marginTop: 2, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ background: COLORS.greenSoft, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: '4px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 10.0, color: COLORS.greenMuted, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
              DBM Family
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 10 }}>
              {FAMILY_LOGOS.map((logo) => (
                <div key={logo.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 82 }}>
                  <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src}
                      alt={logo.name}
                      height={logo.height}
                      style={{ objectFit: 'contain', maxWidth: logo.maxWidth, maxHeight: 36, display: 'block' }}
                    />
                  </div>
                  <div style={{ fontSize: 7.6, lineHeight: 1.08, color: COLORS.greenMuted, letterSpacing: '0.02em', textAlign: 'center', maxWidth: 82 }}>{logo.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '4px 10px', background: COLORS.greenSoft, borderLeft: `3px solid ${COLORS.green}`, borderRadius: 6 }}>
            <div style={{ fontSize: 9.4, lineHeight: 1.35, color: COLORS.text, fontStyle: 'italic' }}>
              &ldquo;I showed up not knowing anyone. Now I fish 8 tournaments a year and I&rsquo;ve got a boat partner for life.&rdquo;
            </div>
            <div style={{ fontSize: 8.0, color: COLORS.greenMuted, fontWeight: 700, marginTop: 2, letterSpacing: '0.04em' }}>&mdash; DBM Member</div>
          </div>
        </div>

        <div style={{ width: 104, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', gap: 4 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={QR_IMAGE}
            alt="QR code — denverbassmasters.com/join-now"
            width={84}
            height={84}
            style={{
              display: 'block',
              margin: '0 auto',
              border: `2px solid ${COLORS.green}`,
              borderRadius: 10,
              padding: 4,
              background: '#FFFFFF',
            }}
          />
          <div style={{
            fontSize: 11.7,
            color: '#FFFFFF',
            fontWeight: 900,
            background: COLORS.blue,
            borderRadius: 6,
            padding: '4px 12px',
            letterSpacing: '0.03em',
            width: '100%',
            boxSizing: 'border-box',
          }}>Join Today</div>
          <div
            style={{
              fontSize: 8.4,
              lineHeight: 1.08,
              color: COLORS.greenDark,
              fontWeight: 700,
            }}
          >
            trophy-cast-site.vercel.app/join
          </div>
        </div>
      </div>

      <div style={{ marginTop: 3, paddingTop: 3, borderTop: `1px solid ${COLORS.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
          {SPONSORS.map((sponsor) => (
            <div
              key={sponsor.name}
              title={sponsor.name}
              style={{
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 32,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sponsor.src}
                alt={sponsor.name}
                height={sponsor.h}
                style={{ objectFit: 'contain', maxWidth: sponsor.mw, maxHeight: sponsor.h, display: 'block', mixBlendMode: 'multiply', imageRendering: 'auto' }}
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLDivElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 4, width: '100%', background: COLORS.green, borderRadius: 999, marginTop: 4 }} />
    </div>
  );
}
