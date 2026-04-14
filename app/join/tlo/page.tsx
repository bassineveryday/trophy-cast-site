'use client';

import { useState } from 'react';

const SPECIES = [
  { id: 'bass', label: 'Bass', emoji: '🐟' },
  { id: 'walleye', label: 'Walleye', emoji: '🐠' },
  { id: 'trout', label: 'Trout', emoji: '🐡' },
  { id: 'carp', label: 'Carp', emoji: '🎣' },
] as const;

type SpeciesId = (typeof SPECIES)[number]['id'];

export default function TLOJoinPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesId[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<{ feeTotal: number; speciesLabels: string } | null>(null);

  const feeTotal = selectedSpecies.length * 20;

  const toggleSpecies = (id: SpeciesId) => {
    setSelectedSpecies((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    selectedSpecies.length > 0 &&
    status !== 'loading';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/tlo/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          species: selectedSpecies,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong.');
        setStatus('error');
      } else {
        setResult(data);
        setStatus('success');
      }
    } catch {
      setErrorMsg('Could not connect. Please try again.');
      setStatus('error');
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const page: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #051018 0%, #0B1A2F 55%, #051018 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  const card: React.CSSProperties = {
    background: '#fff',
    borderRadius: 20,
    padding: '36px 32px',
    width: '100%',
    maxWidth: 480,
    boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
  };

  const label: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  };

  const input: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    fontSize: 15,
    borderRadius: 8,
    border: '1.5px solid #D1D5DB',
    outline: 'none',
    color: '#111827',
    background: '#fff',
    boxSizing: 'border-box' as const,
  };

  const fieldGroup: React.CSSProperties = { marginBottom: 18 };

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === 'success' && result) {
    return (
      <div style={page}>
        <div style={card}>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎣</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0B1A2F', margin: '0 0 10px' }}>
              You&rsquo;re registered!
            </h1>
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: '0 0 4px' }}>
              <strong>{result.speciesLabels}</strong>
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#C9A646', margin: '8px 0 4px' }}>
              ${result.feeTotal} due at check-in
            </p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>
              Cash only · collected by the TD at the event
            </p>

            <div style={{
              background: '#F0F8FF',
              border: '1px solid #BFDBFE',
              borderRadius: 10,
              padding: '14px 16px',
              marginBottom: 24,
              textAlign: 'left',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#1E40AF' }}>
                📅 First Event — Saturday, April 18
              </p>
              <p style={{ margin: 0, fontSize: 14, color: '#374151' }}>
                7:00 AM – 3:00 PM · Chatfield Reservoir
              </p>
            </div>

            <p style={{ fontSize: 14, color: '#374151', marginBottom: 20 }}>
              A confirmation email is on its way. Open Trophy Cast to track your catches and view the leaderboard.
            </p>

            <a
              href="https://trophycast.app"
              style={{
                display: 'block',
                background: '#C9A646',
                color: '#0B1A2F',
                fontWeight: 800,
                fontSize: 16,
                padding: '14px 20px',
                borderRadius: 10,
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Open Trophy Cast →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ──────────────────────────────────────────────────────
  return (
    <div style={page}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <p style={{ color: '#C9A646', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>
          Tightline Outdoors
        </p>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 6px', lineHeight: 1.2 }}>
          2026 Catch Rate Tournament
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 14, margin: 0 }}>
          Chatfield Reservoir · 9 events · Apr 18 – Aug 19
        </p>
      </div>

      {/* Card */}
      <div style={card}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0B1A2F', margin: '0 0 20px' }}>
          Register for the season
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Row: First / Last */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1 }}>
              <label style={label}>First name *</label>
              <input
                style={input}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="First"
                autoComplete="given-name"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Last name *</label>
              <input
                style={input}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Last"
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div style={fieldGroup}>
            <label style={label}>Email *</label>
            <input
              style={input}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div style={fieldGroup}>
            <label style={label}>Phone <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
            <input
              style={input}
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(720) 555-0100"
              autoComplete="tel"
            />
          </div>

          {/* Species picker */}
          <div style={{ marginBottom: 22 }}>
            <label style={label}>Species divisions * <span style={{ fontWeight: 400, textTransform: 'none' }}>— $20 each</span></label>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 10px' }}>
              Select all species you plan to fish. You can compete in multiple divisions.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {SPECIES.map((sp) => {
                const selected = selectedSpecies.includes(sp.id);
                return (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => toggleSpecies(sp.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 10,
                      border: selected ? '2px solid #C9A646' : '2px solid #E5E7EB',
                      background: selected ? '#FDF8EC' : '#F9FAFB',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontWeight: selected ? 700 : 500,
                      fontSize: 15,
                      color: selected ? '#92570A' : '#374151',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{sp.emoji}</span>
                    {sp.label}
                    {selected && <span style={{ marginLeft: 'auto', fontSize: 16 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fee total */}
          {selectedSpecies.length > 0 && (
            <div style={{
              background: '#0B1A2F',
              borderRadius: 10,
              padding: '14px 18px',
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ color: '#94A3B8', fontSize: 14 }}>
                {selectedSpecies.length} species × $20
              </span>
              <span style={{ color: '#C9A646', fontWeight: 800, fontSize: 20 }}>
                ${feeTotal} at check-in
              </span>
            </div>
          )}

          {/* Note about Carp */}
          {selectedSpecies.includes('carp') && (
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: 13,
              color: '#92400E',
            }}>
              <strong>Note:</strong> Carp is only eligible on 4 dates: Apr 18, May 6, Jun 3, Jun 17.
            </div>
          )}

          {errorMsg && (
            <p style={{ color: '#DC2626', fontSize: 14, marginBottom: 16, background: '#FEF2F2', padding: '10px 14px', borderRadius: 8 }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: '100%',
              padding: '14px',
              background: canSubmit ? '#C9A646' : '#E5E7EB',
              color: canSubmit ? '#0B1A2F' : '#9CA3AF',
              fontWeight: 800,
              fontSize: 16,
              borderRadius: 10,
              border: 'none',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s',
            }}
          >
            {status === 'loading' ? 'Registering…' : 'Register Now'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 16, lineHeight: 1.5 }}>
          Registration confirms your intent to enter. Payment is collected by the TD at each event.
          By registering you agree to the{' '}
          <a href="https://tightlineoutdoors.com" style={{ color: '#C9A646' }}>TLO tournament rules</a>.
        </p>
      </div>

      {/* Footer */}
      <p style={{ color: '#475569', fontSize: 12, marginTop: 20, textAlign: 'center' }}>
        Powered by{' '}
        <a href="https://trophycast.app" style={{ color: '#C9A646', textDecoration: 'none', fontWeight: 600 }}>
          Trophy Cast
        </a>
      </p>
    </div>
  );
}
