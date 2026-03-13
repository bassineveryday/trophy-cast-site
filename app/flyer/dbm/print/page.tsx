'use client';

const QR_URL = 'https://www.denverbassmasters.com/join-now';
const QR_IMAGE = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(QR_URL)}&color=2A4008&bgcolor=FFFFFF&qzone=1`;

const COLORS = {
  green: '#88AC2E',
  greenDark: '#3A5C12',
  greenSoft: '#F4FAF0',
  greenMuted: '#6B7F35',
  ink: '#0C0F08',
  text: '#425242',
  paper: '#FFFFFF',
  line: '#D8E6C4',
};

const INFO_CARDS = [
  {
    title: 'Boater or Co-Angler',
    body: 'Fish club events with or without your own boat. No boat required.',
  },
  {
    title: 'Competition Path',
    body: 'Club events can lead to Colorado State, Regionals, Nationals, and the Bassmaster Classic.',
  },
  {
    title: 'New Anglers Welcome',
    body: 'Monthly meetings, speakers, and anglers who actually want to help you improve.',
  },
  {
    title: 'Trophy Cast Club App',
    body: 'Results, standings, communication, and season tracking all in one place.',
  },
];

const SPONSORS = [
  { name: 'Bass Pro Shops', src: '/bass-pro-logo-2x.png' },
  { name: 'JJ Bass Jigs', src: '/JJ-logo-trim%20(2).png' },
  { name: 'Trophy Cast', src: '/Trophy%20cast%20white%20background.png' },
  { name: 'Eagle Claw', src: '/Eagle%20Claw%20logo%20transparent..png' },
  { name: 'Militia Marine', src: '/Militia%20Marine%20logo.%20Transparent..png' },
  { name: 'AA Toppers', src: '/Topper%20Sales.png' },
  { name: 'Rapala', src: '/Rapala%20logo%20transparent..png' },
  { name: 'Discount Fishing Denver', src: '/Discount%20fishing%20tackle.%20Logo.%20Transparent..png' },
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
];

export default function DBMPrintFlyerPage() {
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
      .sheet {
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
      }
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
        <SheetPreview label="Single-sided · 2 portrait flyers side by side">
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

function SheetPreview({ label, children }: { label: string; children: React.ReactNode }) {
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
      <div
        className="sheet"
        style={{
          width: '10.5in',
          height: '8in',
          maxWidth: '100%',
          background: COLORS.paper,
          display: 'grid',
          gridTemplateColumns: '1fr 22px 1fr',
          border: `1px solid ${COLORS.line}`,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 10px 36px rgba(0,0,0,0.14)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CutGuide() {
  return (
    <div
      style={{
        width: 22,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '24px 0',
        background: '#FFFFFF',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ flex: 1, borderLeft: '2px dashed #A7B58C' }} />
      <span style={{ fontSize: 10, color: '#8E9C76', fontWeight: 700, letterSpacing: '0.08em', whiteSpace: 'nowrap', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
        CUT HERE
      </span>
      <div style={{ flex: 1, borderLeft: '2px dashed #A7B58C' }} />
    </div>
  );
}

function PortraitHalfFlyer() {
  return (
    <div
      style={{
        height: '100%',
        background: COLORS.paper,
        padding: '16px 22px 12px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ height: 4, width: '100%', background: COLORS.green, borderRadius: 999, marginBottom: 10 }} />

      <div style={{ textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dbm-logo-transparent.png"
          alt="Denver BassMasters logo"
          height={68}
          style={{ display: 'block', margin: '0 auto 6px', objectFit: 'contain' }}
        />
        <h1 style={{ fontSize: 25, lineHeight: 1.02, margin: '0 0 4px', color: COLORS.ink, fontWeight: 900, letterSpacing: '-0.04em' }}>
          You Don&rsquo;t Need <span style={{ color: COLORS.greenDark }}>a Boat.</span>
        </h1>
        <p style={{ fontSize: 12.8, lineHeight: 1.2, margin: 0, color: COLORS.greenDark, fontWeight: 700 }}>
          Just a love for bass fishing.
        </p>
      </div>

      <div
        style={{
          marginTop: 10,
          background: COLORS.ink,
          borderRadius: 9,
          padding: '7px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ color: COLORS.green, fontSize: 10.6, fontWeight: 800 }}>Meetings</div>
        <div style={{ color: '#E8EFE0', fontSize: 9.2 }}>First Wednesday · 7:00 PM</div>
        <div style={{ color: '#B2C296', fontSize: 9.2 }}>Bass Pro Shops Denver</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
        {INFO_CARDS.map((point) => (
          <div
            key={point.title}
            style={{
              background: COLORS.greenSoft,
              border: `1px solid ${COLORS.line}`,
              borderRadius: 10,
              padding: '8px 10px',
              minHeight: 82,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: 12.4, lineHeight: 1.15, marginBottom: 3, color: COLORS.ink, fontWeight: 900 }}>{point.title}</div>
            <div style={{ fontSize: 10, lineHeight: 1.28, color: COLORS.text }}>{point.body}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr auto', gap: 10, marginTop: 10, alignItems: 'stretch' }}>
        <div style={{ background: COLORS.greenSoft, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: '9px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 7.8, color: COLORS.greenMuted, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            DBM Family
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 10 }}>
            {FAMILY_LOGOS.map((logo) => (
              <div key={logo.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 86 }}>
                <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    height={logo.height}
                    style={{ objectFit: 'contain', maxWidth: logo.maxWidth, display: 'block' }}
                  />
                </div>
                <div style={{ fontSize: 6.1, lineHeight: 1.15, color: COLORS.greenMuted, letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>{logo.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={QR_IMAGE}
            alt="QR code — denverbassmasters.com/join-now"
            width={86}
            height={86}
            style={{
              display: 'block',
              border: `2px solid ${COLORS.green}`,
              borderRadius: 10,
              padding: 4,
              background: '#FFFFFF',
            }}
          />
          <div style={{ fontSize: 10.2, color: COLORS.ink, fontWeight: 800, marginTop: 4 }}>Join Today</div>
          <div style={{ fontSize: 8.4, color: COLORS.greenDark, fontWeight: 700 }}>{QR_URL.replace('https://www.', '')}</div>
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontSize: 7.9, color: COLORS.greenMuted, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 5 }}>
          Tournament Sponsors
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 5, width: '100%' }}>
          {SPONSORS.map((sponsor) => (
            <div
              key={sponsor.name}
              title={sponsor.name}
              style={{
                background: '#FFFFFF',
                borderRadius: 4,
                padding: '1px 3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 18,
                minWidth: 18,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sponsor.src}
                alt={sponsor.name}
                height={13}
                style={{ objectFit: 'contain', maxWidth: 42, display: 'block', mixBlendMode: 'multiply' }}
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLDivElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
