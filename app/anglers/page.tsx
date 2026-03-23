import { DeviceFrame } from "@/components/DeviceFrame";
import { FeaturePageHero } from "@/components/FeaturePageHero";
import { Section } from "@/components/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { siteContent } from "@/lib/content";

export default function AnglersPage() {
  return (
    <>
      <FeaturePageHero
        eyebrow="Built for anglers first"
        title={siteContent.anglers.description}
        description="Whether you fish bass, walleye, trout, or everything in between — Trophy Cast adapts to how you fish. The more you use it, the more it gives back."
      />

      {/* ── Feature bullets ──────────────────────────────────── */}
      <Section variant="surface">
        <div className="space-y-5">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
            Everything an angler needs
          </p>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siteContent.anglers.bulletPoints.map((point) => (
              <li key={point} className="card-hover rounded-2xl border border-white/5 bg-deepPanel/70 p-4 text-sm text-copyMuted">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Logging Flow ─────────────────────────────────────── */}
      <Section variant="surfaceLifted">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="space-y-5">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
              Log on the water. Review at home.
            </p>
            <p className="text-sm text-copyMuted">
              Capture the catch quickly when it happens, then clean up the details later without
              losing the story of the day.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Fast capture",
                  description: "Photo-first and voice-assisted logging keeps the process lightweight while the bite is still on.",
                },
                {
                  title: "Context preserved",
                  description: "Time, place, and seasonal details stay attached so later reviews are grounded in what actually happened.",
                },
                {
                  title: "Season continuity",
                  description: "Every new entry feeds the same long-view stats and personal history instead of getting buried in a timeline.",
                },
                {
                  title: "Desktop follow-up",
                  description: "Review and tidy the day from a larger screen once you are off the water.",
                },
              ].map((feature) => (
                <div key={feature.title} className="card-hover gold-top-bar rounded-2xl border border-white/5 bg-deepPanel/70 p-4">
                  <p className="mt-2 font-heading text-sm font-bold text-copyLight">{feature.title}</p>
                  <p className="mt-1 text-xs text-copyMuted">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-6">
            <DeviceFrame
              src="/screenshots/log-catch.png"
              alt="Quick Capture voice logging on phone"
              type="phone"
              label="Log on the water"
              className="w-48"
            />
            <DeviceFrame
              src="/screenshots/review-catch.png"
              alt="Review and edit catch on desktop"
              type="browser"
              label="Edit at home"
              className="hidden w-72 self-center sm:block"
            />
          </div>
        </div>
      </Section>

      {/* ── Why It Helps ─────────────────────────────────────── */}
      <Section variant="surface">
        <div className="space-y-5">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
            Why anglers stick with it
          </p>
          <p className="max-w-2xl text-sm text-copyMuted">
            The product is built to make honest logging feel worth it, because the payoff shows up
            later in your stats and season review instead of as empty busywork.
          </p>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              "Confidence grows because the same log becomes your season record, not a throwaway note.",
              "Cross-species support lets one angler keep everything in one system instead of splitting by app or spreadsheet.",
              "Private observations stay private until you decide to share a recap with your club.",
              "The more consistent your logging gets, the easier your patterns are to trust later.",
            ].map((bullet) => (
              <li key={bullet} className="card-hover rounded-2xl border border-white/5 bg-deepPanel/80 p-4 text-sm text-copyMuted">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Personal Value ───────────────────────────────────── */}
      <Section variant="surfaceLifted">
        <div className="space-y-5">
          <div className="space-y-1">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
              What you get back from logging well
            </p>
            <h2 className="font-heading text-xl font-extrabold text-copyLight sm:text-2xl">
              Stronger records. Clearer seasons. Better recall.
            </h2>
            <p className="max-w-3xl text-sm text-copyMuted">
              Trophy Cast is most useful when the season gets busy and you need one place to check
              what actually happened, not what you vaguely remember from three months ago.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Session recall", description: "Revisit the exact context around strong days without digging through your camera roll." },
              { title: "Species continuity", description: "Keep bass, trout, and walleye entries together while still making them easy to compare." },
              { title: "Club readiness", description: "Show up with cleaner stats and cleaner recaps when tournament or meeting season ramps up." },
              { title: "Less friction", description: "Capture once, clean once, and let the season record stay organized the whole way through." },
            ].map((feature) => (
              <div key={feature.title} className="card-hover gold-top-bar rounded-2xl border border-white/5 bg-deepPanel/70 p-4 text-center">
                <p className="mt-2 font-heading text-sm font-bold text-copyLight">{feature.title}</p>
                <p className="mt-1 text-xs text-copyMuted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Section id="waitlist" variant="accent">
        <div className="space-y-6 text-center">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
            Ready to fish smarter?
          </p>
          <p className="mx-auto max-w-2xl text-sm text-copyMuted">
            Join the waitlist — we&apos;re onboarding anglers and clubs now.
          </p>
          <WaitlistForm waitlist={siteContent.waitlist} message={siteContent.finalCta.message} />
        </div>
      </Section>
    </>
  );
}
