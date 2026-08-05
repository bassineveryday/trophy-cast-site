"use client";

import { useState } from "react";

interface WaitlistFormProps {
  waitlist: {
    email: string;
    subject: string;
    body: string;
    primaryCta: string;
  };
  message: string;
}

export function WaitlistForm({ waitlist, message }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [joinAs, setJoinAs] = useState<"solo" | "club">("solo");
  const [clubName, setClubName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, joinAs, clubName }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to join waitlist");
      }

      setStatus("success");
      setEmail("");
      setClubName("");
    } catch (error) {
      console.error(error);
      setStatus("idle");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col gap-4 rounded-3xl border border-trophyGold/20 bg-deepPanel/80 p-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="font-heading text-lg text-trophyGold">You&apos;re on the list!</p>
          <p className="text-sm text-copyMuted">We&apos;ll be in touch shortly.</p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-copyLight underline decoration-trophyGold/50 underline-offset-4 hover:decoration-trophyGold"
        >
          Add another email
        </button>
      </div>
    );
  }

  const toggleBase =
    "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition sm:flex-none sm:px-6";

  return (
    <div className="rounded-3xl border border-white/10 bg-deepPanel/80 p-6">
      <div className="flex flex-col gap-6">
        <p className="text-sm text-copyMuted">{message}</p>

        <div className="flex w-full gap-2 rounded-full border border-white/10 bg-midnight/50 p-1 sm:w-fit">
          <button
            type="button"
            onClick={() => setJoinAs("solo")}
            aria-pressed={joinAs === "solo"}
            className={`${toggleBase} ${
              joinAs === "solo" ? "bg-trophyGold text-midnight" : "text-copyMuted hover:text-copyLight"
            }`}
          >
            Just me
          </button>
          <button
            type="button"
            onClick={() => setJoinAs("club")}
            aria-pressed={joinAs === "club"}
            className={`${toggleBase} ${
              joinAs === "club" ? "bg-trophyGold text-midnight" : "text-copyMuted hover:text-copyLight"
            }`}
          >
            My whole club
          </button>
        </div>

        <div className="flex w-full flex-col gap-2">
          {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
            {joinAs === "club" && (
              <input
                type="text"
                required
                placeholder="Club name"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-midnight/50 px-4 py-2 text-sm text-copyLight placeholder:text-white/20 focus:border-trophyGold/50 focus:outline-none focus:ring-1 focus:ring-trophyGold/50 sm:w-56"
              />
            )}
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-midnight/50 px-4 py-2 text-sm text-copyLight placeholder:text-white/20 focus:border-trophyGold/50 focus:outline-none focus:ring-1 focus:ring-trophyGold/50 sm:w-64"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-trophyGold px-6 py-2 text-sm font-semibold text-midnight transition hover:bg-trophyGold/90 disabled:opacity-50"
            >
              {status === "loading" ? "Joining..." : waitlist.primaryCta}
            </button>
          </form>
          {joinAs === "club" && (
            <p className="text-xs text-copyMuted">
              Club officers: we&apos;ll reach out personally to set your whole season up with you.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
