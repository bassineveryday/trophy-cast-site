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
        title={siteContent.coachInsights.title.replace("TC Coach — ", "")}
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
                <li key={bullet} className="card-hover rounded-2xl border border-white/5 bg-deepPanel/80 p-4 text-sm text-copyMuted">
                  {bullet}
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
              What the product is actually doing
            </p>
            <p className="max-w-3xl text-sm text-copyMuted">
              The current coach experience is deliberately narrow: it restructures logs, surfaces
              confidence-oriented observations, and avoids pretending it can predict a bite.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Optional", detail: "TC Coach assists the log. It is not required to use the product well." },
              { title: "Grounded", detail: "Insights come from your own logging history and current entry context." },
              { title: "Non-prescriptive", detail: "No secret spots, no hard promises, no fake certainty." },
              { title: "Transparent", detail: "The site now frames this as confidence-building support, not magic coaching." },
            ].map((chip) => (
              <div key={chip.title} className="card-hover gold-top-bar rounded-2xl border border-trophyGold/10 bg-deepPanel/70 p-4">
                <p className="mt-2 font-heading text-sm font-bold text-trophyGold">{chip.title}</p>
                <p className="mt-1 text-xs text-copyMuted">{chip.detail}</p>
              </div>
            ))}
          </div>
          <p className="max-w-3xl text-xs text-copyMuted">
            The marketing copy and UI now line up with that boundary so the public site does not
            over-claim what the app is doing.
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
