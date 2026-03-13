'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PROGRAMS = [
  {
    id: 'adult',
    label: 'Denver BassMasters',
    sublabel: 'Adult Club · Open to all ages',
    tag: '2026-Print-Flyer',
    emoji: '🎣',
  },
  {
    id: 'juniors',
    label: 'DBM Juniors Program',
    sublabel: 'Ages 8–14 · Through end of 8th grade',
    tag: '2026-Print-Flyer-Juniors',
    emoji: '🐟',
  },
  {
    id: 'highschool',
    label: 'High School Program',
    sublabel: 'Freshman year and up',
    tag: '2026-Print-Flyer-HighSchool',
    emoji: '🏆',
  },
];

export default function DBMJoinPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', program: 'adult' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedProgram = PROGRAMS.find(p => p.id === form.program)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/dbm/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          source: selectedProgram.tag,
          program: form.program,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('Could not connect. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0C1A06 0%, #1A2E0A 50%, #0C1A06 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: 24 }}>
        <Image
          src="/Loge%20Transparent%20background.png"
          alt="Denver BassMasters"
          width={180}
          height={90}
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: '36px 32px',
        width: '100%',
        maxWidth: 460,
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
      }}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{selectedProgram.emoji}</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#3A5C12', margin: '0 0 10px' }}>
              You&rsquo;re In!
            </h1>
            <p style={{ fontSize: 15, color: '#425242', lineHeight: 1.6, margin: '0 0 6px' }}>
              Welcome to <strong>{selectedProgram.label}</strong>.
            </p>
            <p style={{ fontSize: 14, color: '#425242', lineHeight: 1.6, margin: '0 0 24px' }}>
              Check your email — we&rsquo;ll keep you in the loop on meetings, tournaments, and more.
            </p>
            <Link
              href="https://www.denverbassmasters.com"
              style={{
                display: 'inline-block',
                background: '#88AC2E',
                color: '#0C1A06',
                fontWeight: 800,
                fontSize: 14,
                borderRadius: 10,
                padding: '12px 24px',
                textDecoration: 'none',
              }}
            >
              Visit denverbassmasters.com →
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 22 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0C1A06', margin: '0 0 8px', lineHeight: 1.1 }}>
                Join Denver BassMasters
              </h1>
              <p style={{ fontSize: 14, color: '#425242', margin: 0, lineHeight: 1.5 }}>
                Get updates on meetings, tournaments, and club news. No boat required.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Program selector */}
              <div>
                <label style={labelStyle}>Which program? *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PROGRAMS.map((p) => (
                    <label
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: `2px solid ${form.program === p.id ? '#88AC2E' : '#D8E6C4'}`,
                        background: form.program === p.id ? '#F4FAF0' : '#FAFFF5',
                        cursor: 'pointer',
                        transition: 'all 0.12s',
                      }}
                    >
                      <input
                        type="radio"
                        name="program"
                        value={p.id}
                        checked={form.program === p.id}
                        onChange={() => setForm({ ...form, program: p.id })}
                        style={{ accentColor: '#88AC2E', width: 16, height: 16, flexShrink: 0 }}
                      />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#0C1A06' }}>{p.label}</div>
                        <div style={{ fontSize: 12, color: '#6B7F35', marginTop: 1 }}>{p.sublabel}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>First name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Tai"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Last name</label>
                  <input
                    type="text"
                    placeholder="Hudson"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email address *</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {status === 'error' && (
                <div style={{ fontSize: 13, color: '#B91C1C', background: '#FEF2F2', borderRadius: 8, padding: '10px 14px' }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  background: status === 'loading' ? '#9BBF4A' : '#88AC2E',
                  color: '#0C1A06',
                  fontWeight: 900,
                  fontSize: 16,
                  border: 'none',
                  borderRadius: 10,
                  padding: '14px',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                  letterSpacing: '0.02em',
                }}
              >
                {status === 'loading' ? 'Signing you up…' : 'Join the Club →'}
              </button>

              <p style={{ fontSize: 11, color: '#9AA899', textAlign: 'center', margin: '4px 0 0', lineHeight: 1.5 }}>
                No spam. Unsubscribe anytime. We only send club updates.
              </p>
            </form>
          </>
        )}
      </div>

      {/* Footer links */}
      <div style={{ marginTop: 24, display: 'flex', gap: 20, fontSize: 12, color: '#6B9A40' }}>
        <Link href="https://www.denverbassmasters.com" style={{ color: '#6B9A40', textDecoration: 'none' }}>
          denverbassmasters.com
        </Link>
        <span style={{ color: '#2D4A10' }}>·</span>
        <Link href="/" style={{ color: '#6B9A40', textDecoration: 'none' }}>
          Trophy Cast App
        </Link>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: '#3A5C12',
  marginBottom: 6,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  fontSize: 15,
  border: '1.5px solid #D8E6C4',
  borderRadius: 9,
  outline: 'none',
  color: '#0C1A06',
  background: '#FAFFF5',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};
