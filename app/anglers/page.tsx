import { CTAButton } from "@/components/CTAButton";
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
              <li key={point.text} className="card-hover flex items-start gap-3 rounded-2xl border border-white/5 bg-deepPanel/70 p-4">
                <span className="emoji-icon shrink-0">{point.emoji}</span>
                <span className="text-sm text-copyMuted">{point.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Quick Capture ────────────────────────────────────── */}
      <Section variant="surfaceLifted">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="space-y-5">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
              {siteContent.quickCapture.title}
            </p>
            <p className="text-sm text-copyMuted">{siteContent.quickCapture.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {siteContent.quickCapture.features.map((feature) => (
                <div key={feature.title} className="card-hover gold-top-bar rounded-2xl border border-white/5 bg-deepPanel/70 p-4">
                  <span className="text-xl">{feature.emoji}</span>
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

      {/* ── Video Notes ──────────────────────────────────────── */}
      <Section variant="surface">
        <div className="space-y-5">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
            {siteContent.videoNotes.title}
          </p>
          <p className="max-w-2xl text-sm text-copyMuted">{siteContent.videoNotes.description}</p>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {siteContent.videoNotes.bullets.map((bullet) => (
              <li key={bullet.text} className="card-hover flex items-start gap-3 rounded-2xl border border-white/5 bg-deepPanel/80 p-4">
                <span className="emoji-icon shrink-0">{bullet.emoji}</span>
                <span className="text-sm text-copyMuted">{bullet.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Engagement Loop ──────────────────────────────────── */}
      <Section variant="surfaceLifted">
        <div className="space-y-5">
          <div className="space-y-1">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
              {siteContent.gamificationLoop.title}
            </p>
            <h2 className="font-heading text-xl font-extrabold text-copyLight sm:text-2xl">
              {siteContent.gamificationLoop.tagline}
            </h2>
            <p className="max-w-3xl text-sm text-copyMuted">{siteContent.gamificationLoop.description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {siteContent.gamificationLoop.features.map((feature) => (
              <div key={feature.title} className="card-hover gold-top-bar rounded-2xl border border-white/5 bg-deepPanel/70 p-4 text-center">
                <span className="text-2xl">{feature.emoji}</span>
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
          <WaitlistForm />
        </div>
      </Section>
    </>
  );
}
