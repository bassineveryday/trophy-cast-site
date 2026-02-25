"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";

const ROLE_OPTIONS = [
  { value: "angler", label: "🎣 Angler (I fish for fun or competitively)" },
  { value: "club-leader", label: "🏆 Club Leader / Officer (I run a fishing club)" },
  { value: "tournament-director", label: "🏟️ Tournament Director (I organize tournaments)" },
  { value: "investor", label: "📈 Investor / Partner (I want to learn more)" },
];

export function WaitlistForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [clubName, setClubName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const showClubField = role !== "" && role !== "investor";
  const clubRequired = role === "club-leader" || role === "tournament-director";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, role, clubName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const inputClass = `
    w-full bg-midnight border border-white/10 rounded-xl px-4 py-3
    text-white placeholder-white/25 text-base
    focus:outline-none focus:border-trophyGold/60 focus:ring-1 focus:ring-trophyGold/30
    transition-colors
  `;

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <Image src="/trophy-cast-logo-256.png" alt="Trophy Cast" width={96} height={96} className="opacity-100" style={{ mixBlendMode: 'screen' }} />
        <h3 className="font-heading text-2xl font-extrabold text-white">You&apos;re on the list! 🎣</h3>
        <p className="max-w-sm text-copyMuted">
          Welcome to Trophy Cast. We&apos;ll be in touch soon with updates and early access info.
        </p>
        <p className="text-sm font-semibold italic text-trophyGold">Where Every Cast Counts.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-5">

      {/* Logo + tagline */}
      <div className="flex flex-col items-center gap-2 pb-2">
        <Image src="/trophy-cast-logo-256.png" alt="Trophy Cast" width={80} height={80} className="opacity-100" style={{ mixBlendMode: 'screen' }} />
        <p className="text-center text-sm text-copyMuted">
          Be among the first anglers and clubs in.
        </p>
      </div>

      {/* First Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="wl-firstName" className="text-sm font-medium text-copyMuted">
          First Name <span className="text-trophyGold">*</span>
        </label>
        <input
          id="wl-firstName"
          type="text"
          required
          placeholder="John"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="wl-email" className="text-sm font-medium text-copyMuted">
          Email <span className="text-trophyGold">*</span>
        </label>
        <input
          id="wl-email"
          type="email"
          required
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Role */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="wl-role" className="text-sm font-medium text-copyMuted">
          I am a... <span className="text-trophyGold">*</span>
        </label>
        <select
          id="wl-role"
          required
          value={role}
          onChange={(e) => { setRole(e.target.value); setClubName(""); }}
          className={inputClass + " appearance-none cursor-pointer"}
        >
          <option value="" disabled>Select your role...</option>
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-midnight">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Club Name — shows for all except investor */}
      {showClubField && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="wl-club" className="text-sm font-medium text-copyMuted">
            {clubRequired ? (
              <>Club Name <span className="text-trophyGold">*</span></>
            ) : (
              <>Are you part of a fishing club? <span className="text-copyMuted/50 font-normal">(optional)</span></>
            )}
          </label>
          <input
            id="wl-club"
            type="text"
            required={clubRequired}
            placeholder={clubRequired ? "e.g. Denver Bassmasters" : "Club name (if any)"}
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-copyMuted/40">
            {clubRequired
              ? "We\u2019ll reach out to help get your club set up on Trophy Cast."
              : "We\u2019d love to get your club on Trophy Cast too!"}
          </p>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <p className="text-center text-sm text-red-400">{errorMsg}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-1 w-full rounded-xl bg-trophyGold px-6 py-4 text-base font-extrabold uppercase tracking-wider text-midnight shadow-glow transition-all duration-200 hover:bg-trophyGold/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : "🎣 Join the Waitlist"}
      </button>

      <p className="text-center text-xs text-copyMuted/30">
        No spam. No sharing. Just Trophy Cast updates.
      </p>
    </form>
  );
}
