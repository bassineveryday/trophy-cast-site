import { DeviceFrame } from "@/components/DeviceFrame";
import { FeaturePageHero } from "@/components/FeaturePageHero";
import { Section } from "@/components/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { siteContent } from "@/lib/content";

export default function ClubsPage() {
  return (
    <>
      <FeaturePageHero
        eyebrow="For Clubs"
        title={siteContent.clubs.title}
        description={siteContent.clubs.lead}
      />

      {/* ── Club features ────────────────────────────────────── */}
      <Section variant="surface">
        <div className="space-y-5">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
            Everything your club needs
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siteContent.clubs.items.map((item) => (
              <div
                key={item.title}
                className="card-hover gold-top-bar rounded-2xl border border-trophyGold/10 bg-deepPanel/70 p-4"
              >
                <span className="text-2xl">{item.emoji}</span>
                <p className="mt-2 font-heading text-sm font-bold text-trophyGold">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-copyMuted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Screenshots ──────────────────────────────────────── */}
      <Section variant="surfaceLifted">
        <div className="flex flex-wrap items-start justify-center gap-8">
          <DeviceFrame
            src="/screenshots/clubhouse.png"
            alt="Club home screen on phone"
            type="phone"
            label="Clubhouse on your phone"
            className="w-48"
          />
          <DeviceFrame
            src="/screenshots/ask-dbm.png"
            alt="Ask DBM chat on phone"
            type="phone"
            label="Dock Talk — Ask DBM"
            className="w-48"
          />
        </div>
      </Section>

      {/* ── Club-in-a-Box ────────────────────────────────────── */}
      <Section variant="surface">
        <div className="mx-auto max-w-2xl space-y-5 text-center">
          <span className="inline-block rounded-full border border-trophyGold/30 bg-trophyGold/10 px-3 py-1 text-xs font-semibold text-trophyGold">
            {siteContent.clubInABox.badge}
          </span>
          <p className="font-heading text-xl font-bold text-copyLight sm:text-2xl">
            {siteContent.clubInABox.title}
          </p>
          <p className="text-sm text-copyMuted">
            {siteContent.clubInABox.description}
          </p>
          <ul className="mx-auto max-w-md space-y-2 text-left text-sm text-copyMuted">
            {siteContent.clubInABox.checklist.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Section id="waitlist" variant="accent">
        <div className="space-y-6 text-center">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
            Ready to organize your crew?
          </p>
          <p className="mx-auto max-w-2xl text-sm text-copyMuted">
            Join the waitlist — Trophy Cast is now onboarding clubs.
          </p>
          <WaitlistForm />
        </div>
      </Section>
    </>
  );
}
