import { DeviceFrame } from "@/components/DeviceFrame";
import { FeaturePageHero } from "@/components/FeaturePageHero";
import { Section } from "@/components/Section";
import { TCCoachBadge } from "@/components/TCCoachBadge";
import { WaitlistForm } from "@/components/WaitlistForm";
import { siteContent } from "@/lib/content";

export default function CoachPage() {
  return (
    <>
      <FeaturePageHero
        eyebrow="TC Coach"
        title="It's paying attention"
        description={siteContent.coachInsights.description}
      />

      {/* ── Coaching insights ────────────────────────────────── */}
      <Section variant="surface">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="space-y-5">
            <TCCoachBadge />
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
              How TC Coach works for you
            </p>
            <ul className="space-y-3">
              {siteContent.coachInsights.bullets.map((bullet) => (
                <li key={bullet.text} className="card-hover flex items-start gap-3 rounded-2xl border border-white/5 bg-deepPanel/80 p-4 text-sm text-copyMuted">
                  <span className="emoji-icon shrink-0">{bullet.emoji}</span>
                  <span>{bullet.text}</span>
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

      {/* ── Insight Boundaries ───────────────────────────────── */}
      <Section variant="surfaceLifted">
        <div className="space-y-5">
          <div className="space-y-1">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
              What TC Coach will and won&apos;t do
            </p>
            <p className="max-w-3xl text-sm text-copyMuted">
              Straight answer: TC Coach reads what you logged and what the day looks like, and tells
              you what it sees in your own fishing. It will not tell you the fish are biting, and it
              will not hand you somebody else&apos;s spot.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Yours", detail: "It coaches off your catches and your water — not a national average." },
              { title: "Honest", detail: "When it isn't sure, it says so instead of inventing a hot pattern." },
              { title: "No fake certainty", detail: "No secret spots, no guaranteed limits, no promises about the bite." },
              { title: "Optional", detail: "Log your fish and never open the Coach if you don't want to. It still works." },
            ].map((chip) => (
              <div key={chip.title} className="card-hover gold-top-bar rounded-2xl border border-trophyGold/10 bg-deepPanel/70 p-4">
                <p className="mt-2 font-heading text-sm font-bold text-trophyGold">{chip.title}</p>
                <p className="mt-1 text-xs text-copyMuted">{chip.detail}</p>
              </div>
            ))}
          </div>
          <p className="max-w-3xl text-xs text-copyMuted">
            We&apos;d rather under-promise here than sell you a coach that pretends to know
            something it doesn&apos;t. The more you fish, the more it actually has to work with.
          </p>
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
          <TCCoachBadge label="Gold sparkle = TC Coach" className="mx-auto" />
          <WaitlistForm waitlist={siteContent.waitlist} message={siteContent.finalCta.message} />
        </div>
      </Section>
    </>
  );
}
