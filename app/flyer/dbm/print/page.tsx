'use client';

import { useEffect } from 'react';

const JOIN_LABEL = 'denverbassmasters.com/join-now';
const QR_IMAGE = '/dbm-join-qr.svg';
const DBM_JUNIORS_LOGO = '/Denver%20Bassmaster%20Junior%27s%20logo%20transparent..png';
const CBN_LOGO = '/CBN.png';
const SHEET_WIDTH_IN = 11;
const SHEET_HEIGHT_IN = 8.5;
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
    title: 'No Boat Required',
    body: 'Every club tournament pairs a boater and co-angler, so you can start with a rod, a reel, and a willingness to learn.',
  },
  {
    title: 'A Club That Makes You Better',
    body: 'Monthly speakers, seasonal patterns, electronics tips, and on-the-water mentorship help members improve faster without the cutthroat vibe.',
  },
  {
    title: 'Community, Committees & Conservation',
    body: 'Members shape the club through conservation, youth outreach, and committees. It is a place to contribute, make friends, and be part of something local.',
  },
  {
    title: 'Optional Tournament Path',
    body: 'If you want to compete more seriously, DBM gives you that lane too: club events, Colorado Bass Nation qualifiers, and higher levels beyond that.',
  },
  {
    title: 'Stay Connected Year-Round',
    body: 'Trophy Cast keeps members connected with pairings, standings, stats, and club communication between meetings and events.',
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
    src: DBM_JUNIORS_LOGO,
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
    src: CBN_LOGO,
    height: 32,
    maxWidth: 62,
  },
];

export default function DBMPrintFlyerPage() {
  useEffect(() => {
    /* Force-clean the DOM right before Chrome renders print preview */
    const beforePrint = () => {
      document.documentElement.className = '';
      document.documentElement.style.cssText =
        'background:#fff!important;margin:0!important;padding:0!important;min-height:0!important;';
      document.body.style.cssText =
        'background:#fff!important;margin:0!important;padding:0!important;min-height:0!important;';
    };
    const afterPrint = () => {
      document.documentElement.style.cssText = '';
      document.body.style.cssText = '';
    };
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);

    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
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
      /* Kill dark backgrounds at every level */
      :root, html {
        background: #fff !important;
        background-color: #fff !important;
        margin: 0 !important;
        padding: 0 !important;
        min-height: 0 !important;
      }
      body {
        background: #fff !important;
        background-color: #fff !important;
        margin: 0 !important;
        padding: 0 !important;
        min-height: 0 !important;
      }

      /* Hide everything except flyer */
      body > header, body > footer, body > script, nav,
      next-route-announcer, .no-print {
        display: none !important;
      }
      body > main {
        padding: 0 !important;
        margin: 0 !important;
      }
      body > main > * { display: none !important; }
      body > main > .print-wrap { display: block !important; }

      /* Print-wrap: single container */
      .print-wrap {
        width: 11in !important;
        height: 8.5in !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background: #fff !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* Flatten wrappers */
      .sheet-frame, .sheet-shell {
        all: unset !important;
        display: contents !important;
      }

      /* Sheet = page, grid of two halves */
      .sheet {
        width: 11in !important;
        height: 8.5in !important;
        margin: 0 !important;
        padding: 0 !important;
        position: static !important;
        transform: none !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        overflow: hidden !important;
        display: grid !important;
        grid-template-columns: 1fr 0px 1fr !important;
        align-items: start !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* Each half: natural size, no zoom */
      .portrait-half {
        width: auto !important;
        height: auto !important;
        max-height: 8.5in !important;
        align-self: start !important;
        padding-left: 0.25in !important;
        padding-right: 0.25in !important;
        overflow: hidden !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      .cut-guide {
        width: 0 !important;
        border-left: 1px dashed #A7B58C !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
      .cut-guide * { display: none !important; }
    }
    @page { size: 11in 8.5in; margin: 0; }
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
          <div style={{ fontSize: 12, color: '#B5C79B' }}>Landscape letter page - 2 portrait flyers side by side</div>
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
            Print / Save PDF (Landscape)
          </button>
        </div>
      </div>

      <div
        className="no-print"
        style={{
          background: '#EDF5E5',
          borderBottom: `1px solid ${COLORS.line}`,
          padding: '12px 24px',
          fontSize: 12,
          color: COLORS.greenDark,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 2 }}>Orientation must be Landscape.</div>
        <div>Print one 11 x 8.5 landscape page at 100% scale or Actual Size, then cut once down the center.</div>
        <div style={{ marginTop: 4, fontSize: 11, color: COLORS.text }}>
          If the print preview looks tall, narrow, or broken into portrait pages, switch the printer Orientation setting to Landscape.
        </div>
      </div>

      <div
        className="print-wrap"
        style={{
          minHeight: '100vh',
          width: '100%',
          background: '#D9DED1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
          padding: '28px 16px 56px',
          overflowX: 'auto',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <SheetPreview label="Landscape letter canvas - single-sided - 2 portrait flyers side by side">
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
            1. Set Orientation to Landscape.
            <br />
            2. Keep paper size at Letter, then print one page.
            <br />
            3. Keep scale at 100% or Actual Size.
            <br />
            4. Cut once down the center to make two portrait half-sheet flyers.
          </div>
        </div>
      </div>
    </>
  );
}

function SheetPreview({ label, children }: { label: string; children: React.ReactNode }) {
  const sheetWidth = Math.round(SHEET_WIDTH_PX);
  const sheetHeight = Math.round(SHEET_HEIGHT_PX);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', width: '100%' }}>
      <div
        className="no-print"
        style={{
          width: '11in',
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
      <div className="sheet-frame" style={{ width: '100%', overflowX: 'auto', overflowY: 'visible', paddingBottom: 4 }}>
        <div className="sheet-shell" style={{ width: sheetWidth, height: sheetHeight, margin: '0 auto', position: 'relative' }}>
          <div
            className="sheet"
            style={{
              width: `${SHEET_WIDTH_IN}in`,
              minWidth: `${SHEET_WIDTH_IN}in`,
              height: `${SHEET_HEIGHT_IN}in`,
              position: 'static',
              left: 'auto',
              top: 0,
              transform: 'none',
              transformOrigin: 'top left',
              background: COLORS.paper,
              display: 'grid',
              gridTemplateColumns: '1fr 0 1fr',
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
        width: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: '50%',
        borderLeft: '1px dashed #A7B58C',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

function PortraitHalfFlyer() {
  return (
    <div
      className="portrait-half"
      style={{
        height: '100%',
        background: COLORS.paper,
        padding: '12px 22px 12px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ height: 4, width: '100%', background: COLORS.green, borderRadius: 999, marginBottom: 8 }} />

      <div style={{ textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Loge%20Transparent%20background.png"
          alt="Denver BassMasters logo"
          height={140}
          style={{ display: 'block', height: 144, width: 'auto', maxWidth: '100%', margin: '0 auto -38px', objectFit: 'contain' }}
        />
        <div style={{ marginTop: '0.22in' }}>
          <h1 style={{ fontSize: 36, lineHeight: 0.93, margin: '0 0 5px', color: COLORS.ink, fontWeight: 900, letterSpacing: '-0.05em' }}>
            You Don&rsquo;t Need <span style={{ color: COLORS.greenDark }}>a Boat.</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.08, margin: '8px 0 10px', color: COLORS.text, fontWeight: 600, fontStyle: 'italic' }}>
            Just a love for bass fishing.
          </p>
          <div
            style={{
              fontSize: 10.0,
              lineHeight: 1.15,
              marginTop: 4,
              color: COLORS.greenMuted,
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
              {['Boaters & Co-Anglers Paired', 'Open Meetings', 'Knowledge-First Club'].map((tag) => (
                <span key={tag} style={{
                  background: COLORS.greenCard,
                  border: `1px solid ${COLORS.green}`,
                  borderRadius: 999,
                  padding: '2px 10px',
                  fontSize: 10,
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

      <div style={{ height: 1, background: COLORS.line, margin: '4px 20px 0', borderRadius: 1 }} />

      <div
        style={{
          marginTop: 6,
          background: 'linear-gradient(180deg, #F7FBFF 0%, #E8F1F8 100%)',
          border: `1px solid ${COLORS.blue}`,
          borderRadius: 999,
          padding: '5px 10px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          columnGap: 10,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: COLORS.blue,
            color: '#FFFFFF',
            fontSize: 10.5,
            fontWeight: 900,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            borderRadius: 999,
            padding: '4px 9px',
            whiteSpace: 'nowrap',
          }}
        >
          Open Meetings
        </div>
        <div style={{ textAlign: 'center', color: COLORS.ink, fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap' }}>First Wednesday - 7:00 PM</div>
        <div style={{ textAlign: 'right', color: COLORS.blue, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>Bass Pro Shops Denver</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 8, rowGap: 8, marginTop: 6, alignContent: 'start' }}>
        {INFO_CARDS.map((point) => (
          <div
            key={point.title}
            style={{
              background: `linear-gradient(180deg, ${COLORS.greenCard} 0%, ${COLORS.greenCardSoft} 100%)`,
              border: `1px solid #C7D9AE`,
              borderRadius: 7,
              padding: '6px 9px 7px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.72), 0 0 0 1px rgba(136,172,46,0.08)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: 14, lineHeight: 1.1, marginBottom: 3, color: COLORS.greenDark, fontWeight: 900 }}>{point.title}</div>
            <div style={{ fontSize: 11.4, lineHeight: 1.24, color: COLORS.text }}>{point.body}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 108px', gap: 8, marginTop: 6, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ background: COLORS.greenSoft, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: '6px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: COLORS.greenMuted, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
              DBM Family
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 8 }}>
              {FAMILY_LOGOS.map((logo) => (
                <div key={logo.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 76 }}>
                  <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src}
                      alt={logo.name}
                      height={logo.height}
                      style={{ objectFit: 'contain', maxWidth: logo.maxWidth, maxHeight: 32, display: 'block' }}
                    />
                  </div>
                  <div style={{ fontSize: 8.2, lineHeight: 1.04, color: COLORS.greenMuted, letterSpacing: '0.02em', textAlign: 'center', maxWidth: 76 }}>{logo.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '6px 10px', background: COLORS.greenSoft, borderLeft: `3px solid ${COLORS.green}`, borderRadius: 6 }}>
            <div style={{ fontSize: 10.1, lineHeight: 1.28, color: COLORS.text, fontStyle: 'italic' }}>
              &ldquo;I showed up not knowing anyone. Now I always have someone to learn from, someone to fish with, and friends I trust.&rdquo;
            </div>
            <div style={{ fontSize: 9, color: COLORS.greenMuted, fontWeight: 700, marginTop: 2, letterSpacing: '0.04em' }}>&mdash; DBM Member</div>
          </div>
        </div>

        <div style={{ width: 108, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={QR_IMAGE}
            alt={`QR code - ${JOIN_LABEL}`}
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
            fontSize: 13,
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
              fontSize: 9.5,
              lineHeight: 1.08,
              color: COLORS.greenDark,
              fontWeight: 700,
            }}
          >
            {JOIN_LABEL}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 6, paddingTop: 5, borderTop: `1px solid ${COLORS.line}` }}>
        <div style={{ fontSize: 9, color: COLORS.greenMuted, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 5 }}>
          Club Partners
        </div>
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

      <div style={{ height: 4, width: '100%', background: COLORS.green, borderRadius: 999, marginTop: 6 }} />
    </div>
  );
}

