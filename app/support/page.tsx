"use client";

import { useState, useEffect, useRef } from "react";

export default function SupportPage() {
  const [secret, setSecret] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear countdown when link disappears
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function handleGenerate() {
    setError(null);
    setLink(null);
    setSecondsLeft(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLoading(true);

    try {
      const res = await fetch("/api/support/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ email, reason }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Unknown error");
        return;
      }

      setLink(json.action_link);

      // 60-second countdown then expire the link
      let secs = 60;
      setSecondsLeft(secs);
      intervalRef.current = setInterval(() => {
        secs -= 1;
        setSecondsLeft(secs);
        if (secs <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setLink(null);
          setSecondsLeft(null);
        }
      }, 1000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B1A2F] flex items-center justify-center p-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-md space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-[#C9A646] font-bold text-xl tracking-tight">
            🎣 Trophy Cast Support
          </h1>
          <p className="text-white/50 text-sm">
            Generate a one-time magic link to log in as a member for debugging.
            Every use is permanently logged.
          </p>
        </div>

        {/* Admin secret */}
        <div className="space-y-1">
          <label className="text-white/70 text-sm font-medium block">
            Admin secret
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoComplete="off"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm outline-none focus:border-[#C9A646] transition-colors"
            placeholder="••••••••••••"
          />
        </div>

        {/* Member email or phone */}
        <div className="space-y-1">
          <label className="text-white/70 text-sm font-medium block">
            Member email or phone
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm outline-none focus:border-[#C9A646] transition-colors"
            placeholder="member@example.com or (303) 555-1234"
          />
        </div>

        {/* Reason */}
        <div className="space-y-1">
          <label className="text-white/70 text-sm font-medium block">
            Reason{" "}
            <span className="text-white/30 font-normal">(logged)</span>
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm outline-none focus:border-[#C9A646] transition-colors"
            placeholder="e.g. Member can't see their tournament results"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleGenerate}
          disabled={loading || !email || !secret}
          className="w-full bg-[#C9A646] text-[#0B1A2F] font-bold py-2.5 rounded-lg disabled:opacity-40 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {loading ? "Generating…" : "Generate Magic Link"}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3 text-red-300 text-sm">
            ✗ {error}
          </div>
        )}

        {/* Success — link + countdown */}
        {link && (
          <div className="space-y-3">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-green-400 text-sm font-semibold">
                  ✓ Link ready
                </p>
                <span
                  className={`text-sm font-mono font-bold tabular-nums ${
                    (secondsLeft ?? 0) <= 10 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {secondsLeft}s
                </span>
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A646] text-xs break-all underline underline-offset-2 hover:opacity-80"
              >
                {link}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(link)}
                className="text-white/40 text-xs hover:text-white/70 transition-colors"
              >
                Copy to clipboard
              </button>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-yellow-300 text-xs leading-relaxed">
              ⚠️{" "}
              <strong>Open in Incognito / Private browsing</strong> so you
              don&apos;t get logged out of your own account.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
