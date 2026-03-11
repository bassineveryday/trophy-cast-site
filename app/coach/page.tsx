import { DeviceFrame } from "@/components/DeviceFrame";
import { FeaturePageHero } from "@/components/FeaturePageHero";
import { Section } from "@/components/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { siteContent } from "@/lib/content";

export default function CoachPage() {
  return (
    <>
      <FeaturePageHero
        eyebrow="TC Coach"
        title={siteContent.coachInsights.title.replace("TC Coach — ", "")}
        description={siteContent.coachInsights.description}
      />

      {/* ── Coaching insights ────────────────────────────────── */}
      <Section variant="surface">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="space-y-5">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
              How TC Coach works for you
            </p>
            <ul className="space-y-3">
              {siteContent.coachInsights.bullets.map((bullet) => (
                <li key={bullet.text} className="card-hover flex items-start gap-3 rounded-2xl border border-white/5 bg-deepPanel/80 p-4">
                  <span className="emoji-icon shrink-0">{bullet.emoji}</span>
                  <span className="text-sm text-copyMuted">{bullet.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center gap-6">
            <DeviceFrame
              src="/screenshots/tc-coach.png"
              alt="TC Coach chat interface on phone"
              type="phone"
              label="Ask TC Coach anything"
              className="w-52"
            />
            <DeviceFrame
              src="/screenshots/performance-edge.png"
              alt="Performance Edge coaching hub on desktop"
              type="browser"
              label="Performance Edge — desktop view"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </Section>

      {/* ── Conditions Engine ────────────────────────────────── */}
      <Section variant="surfaceLifted">
        <div className="space-y-5">
          <div className="space-y-1">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
              {siteContent.conditionsEngine.title}
            </p>
            <p className="max-w-3xl text-sm text-copyMuted">{siteContent.conditionsEngine.description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {siteContent.conditionsEngine.chips.map((chip) => (
              <div key={chip.label} className="card-hover gold-top-bar rounded-2xl border border-trophyGold/10 bg-deepPanel/70 p-4">
                <span className="text-2xl">{chip.emoji}</span>
                <p className="mt-2 font-heading text-sm font-bold text-trophyGold">{chip.label}</p>
                <p className="mt-1 text-xs text-copyMuted">{chip.detail}</p>
              </div>
            ))}
          </div>
          <p className="max-w-3xl text-xs text-copyMuted">{siteContent.conditionsEngine.score}</p>
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Section id="waitlist" variant="accent">
        <div className="space-y-6 text-center">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
            Ready to fish with TC Coach?
          </p>
          <p className="mx-auto max-w-2xl text-sm text-copyMuted">
            Join the waitlist — TC Coach gets smarter every time you fish.
          </p>
          <WaitlistForm />
        </div>
      </Section>
    </>
  );
}
