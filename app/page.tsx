import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { Container } from "@/components/Container";
import { Icon } from "@/components/Icon";
import { ScreenshotGrid } from "@/components/ScreenshotGrid";
import { Section } from "@/components/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ScrollToTop } from "@/components/ScrollToTop";
import { siteContent } from "@/lib/content";

export default function Page() {
  const waitlistHref = "#waitlist";

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="hero" className="relative overflow-hidden bg-midnight bg-heroMesh py-5 sm:py-8">
        <Container className="relative">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
            {/* Left column */}
            <div className="space-y-4">
              {/* Inline logo + brand */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="absolute -inset-3 animate-pulse-soft rounded-full bg-electric/10 blur-2xl" />
                  <Image
                    src="/trophy-cast-logo-256.png"
                    alt="Trophy Cast logo"
                    width={256}
                    height={256}
                    priority
                    className="relative h-14 w-auto drop-shadow-xl"
                  />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                    {siteContent.brand.name}
                  </h1>
                  <p className="text-sm font-semibold text-trophyGold">{siteContent.brand.motto}</p>
                </div>
              </div>

              {/* Eyebrow */}
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-copyLight backdrop-blur-sm">
                <Icon />
                <span>{siteContent.hero.eyebrow}</span>
              </div>

              {/* Headline + description */}
              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-extrabold leading-[1.1] text-white sm:text-3xl">
                  {siteContent.hero.title}
                </h2>
                <p className="max-w-xl text-xs leading-relaxed text-copyMuted sm:text-sm">{siteContent.hero.description}</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <CTAButton href={waitlistHref} label={siteContent.waitlist.primaryCta} variant="primary" />
                <CTAButton
                  href={siteContent.waitlist.secondaryHref}
                  label={siteContent.waitlist.secondaryCta}
                  variant="secondary"
                />
              </div>

              {/* Highlights grid */}
              <div className="grid gap-2 rounded-xl border border-trophyGold/15 bg-deepPanel/50 p-4 text-sm text-copyMuted backdrop-blur-sm sm:grid-cols-2">
                {siteContent.hero.highlights.map((highlight) => (
                  <div key={highlight.label} className="space-y-0.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-trophyGold">
                      {highlight.label}
                    </p>
                    <p className="text-xs text-copyLight">{highlight.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="rounded-3xl border border-trophyGold/10 bg-liftedPanel/60 p-5 shadow-glow backdrop-blur-sm">
              {/* Stat chips */}
              <div className="mb-5 flex flex-wrap gap-2">
                {[
                  { icon: "🎣", label: "80+ screens" },
                  { icon: "🏆", label: "30 trophies" },
                  { icon: "⚡", label: "Voice-first" },
                  { icon: "✨", label: "65 knowledge packs" },
                ].map((chip) => (
                  <span key={chip.label} className="inline-flex items-center gap-1.5 rounded-full border border-trophyGold/20 bg-deepPanel/60 px-3 py-1 text-xs font-semibold text-copyLight">
                    {chip.icon} {chip.label}
                  </span>
                ))}
              </div>
              {/* Feature cards */}
              <div className="space-y-3">
                {[
                  { emoji: "🎙️", title: "Log a catch in one breath", desc: "One tap, speak 15 seconds. GPS, weather, and TC Coach auto-fill the rest." },
                  { emoji: "✨", title: "65 coaching knowledge packs", desc: "Physics-backed answers on lure physics, pressure, feeding windows, and seasonal migration." },
                  { emoji: "🏆", title: "30 real trophies to earn", desc: "Photo Pro, Species Slam, Ten Bass Day — actual angling milestones." },
                  { emoji: "🤝", title: "Full club-in-a-box", desc: "Tournaments, AOY standings, board tools, Dock Talk. Denver Bassmasters runs their whole club here." },
                ].map((item) => (
                  <div key={item.title} className="card-hover rounded-2xl border border-white/5 bg-deepPanel/60 p-4">
                    <div className="flex items-center gap-2">
                      <span className="emoji-icon text-base">{item.emoji}</span>
                      <p className="font-heading text-sm font-semibold text-copyLight">{item.title}</p>
                    </div>
                    <p className="mt-1 text-xs text-copyMuted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Gold divider ─────────────────────────────────────── */}
      <div className="gold-divider" />

      {/* ── WHAT ─────────────────────────────────────────────── */}
      <Section id={siteContent.what.id} variant="surface">
        <div className="space-y-7">
          <div className="space-y-3">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.what.title}</p>
            <h2 className="font-heading text-2xl font-extrabold text-copyLight sm:text-3xl">{siteContent.what.summary}</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {siteContent.what.items.map((item) => (
              <div key={item.title} className="card-hover gold-top-bar rounded-2xl border border-white/5 bg-deepPanel/70 p-5">
                <span className="emoji-icon">{item.emoji}</span>
                <p className="mt-2 font-heading text-base font-bold text-copyLight">{item.title}</p>
                <p className="mt-2 text-sm text-copyMuted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <Section id={siteContent.how.id} variant="surfaceLifted">
        <div className="space-y-7">
          <div className="space-y-1">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.how.title}</p>
            <h2 className="font-heading text-xl font-extrabold text-copyLight sm:text-2xl">{siteContent.how.tagline}</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {siteContent.how.steps.map((step, index) => (
              <div key={step.title} className="card-hover relative rounded-2xl border border-trophyGold/10 bg-deepPanel/80 p-5 text-center">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-trophyGold/20 font-heading text-sm font-bold text-trophyGold">
                  {index + 1}
                </span>
                <span className="mt-3 block text-2xl">{step.emoji}</span>
                <p className="mt-2 font-heading text-base font-bold text-copyLight">{step.title}</p>
                <p className="mt-1 text-sm text-copyMuted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SCREENSHOTS ──────────────────────────────────────── */}
      <Section id={siteContent.screenshots.id} variant="surfaceLifted">
        <div className="space-y-7">
          <div className="space-y-2">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.screenshots.title}</p>
            <h2 className="font-heading text-2xl font-extrabold text-copyLight sm:text-3xl">{siteContent.screenshots.headline}</h2>
          </div>
          {/* Social proof quote */}
          <div className="rounded-2xl border border-trophyGold/20 bg-deepPanel/60 p-4">
            <blockquote className="text-sm leading-relaxed text-copyLight italic">
              &ldquo;{siteContent.socialProof.quote}&rdquo;
            </blockquote>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-trophyGold/20 flex items-center justify-center text-xs font-bold text-trophyGold">NM</div>
              <div>
                <p className="text-sm font-semibold text-copyLight">{siteContent.socialProof.author}</p>
                <p className="text-xs text-copyMuted">{siteContent.socialProof.detail}</p>
              </div>
              <div className="ml-auto hidden sm:block">
                <p className="text-xs text-trophyGold font-medium">{siteContent.socialProof.stat}</p>
              </div>
            </div>
          </div>
          <ScreenshotGrid caption={siteContent.screenshots.caption} images={siteContent.screenshots.images} />
        </div>
      </Section>

      {/* ── TRUST ────────────────────────────────────────────── */}
      <Section id={siteContent.trust.id} variant="surface">
        <div className="space-y-5">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.trust.title}</p>
          <div className="grid gap-4 lg:grid-cols-3">
            {siteContent.trust.pillars.map((pillar) => (
              <div key={pillar.title} className="card-hover gold-top-bar rounded-2xl border border-white/5 bg-deepPanel/80 p-4">
                <span className="emoji-icon">{pillar.emoji}</span>
                <p className="mt-2 font-heading text-base font-bold text-copyLight">{pillar.title}</p>
                <p className="mt-2 text-sm text-copyMuted">{pillar.description}</p>
              </div>
            ))}
          </div>
          {/* Mid-page CTA banner */}
          <div className="rounded-2xl border border-trophyGold/15 bg-liftedPanel/50 p-5 shadow-glow sm:flex sm:items-center sm:justify-between">
            <p className="text-sm text-copyMuted sm:max-w-xl">{siteContent.midCta.message}</p>
            <CTAButton href={waitlistHref} label={siteContent.waitlist.primaryCta} variant="primary" className="mt-4 w-full sm:mt-0 sm:w-auto" />
          </div>
        </div>
      </Section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <Section id={siteContent.finalCta.id} variant="surfaceLifted">
        <div className="space-y-8 text-center">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.finalCta.title}</p>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-copyLight">{siteContent.finalCta.description}</p>
          <WaitlistForm />
        </div>
      </Section>
      <ScrollToTop />
    </>
  );
}
