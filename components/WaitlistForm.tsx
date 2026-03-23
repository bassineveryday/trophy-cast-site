"use client";

import { useState } from "react";
import { CTAButton } from "./CTAButton";
import { buildMailtoHref } from "@/lib/utils";

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
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to join waitlist");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error(error);
      // Optionally handle error state here
      setStatus("idle");
      alert("Something went wrong. Please try again.");
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

  return (
    <div className="rounded-3xl border border-white/10 bg-deepPanel/80 p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-copyMuted sm:max-w-md">{message}</p>
        
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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
      </div>
    </div>
  );
}
