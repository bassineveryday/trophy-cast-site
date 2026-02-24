import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { Container } from "@/components/Container";
import { Icon } from "@/components/Icon";
import { ScreenshotGrid } from "@/components/ScreenshotGrid";
import { Section } from "@/components/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ScrollToTop } from "@/components/ScrollToTop";
import { siteContent } from "@/lib/content";
import { buildMailtoHref } from "@/lib/utils";

export default function Page() {
  const waitlistHref = buildMailtoHref(siteContent.waitlist);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="hero" className="relative overflow-hidden bg-midnight bg-heroMesh py-24 sm:py-36">
        <Container className="relative space-y-16">
          {/* Logo + Name */}
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <div className="absolute -inset-6 animate-pulse-soft rounded-full bg-electric/10 blur-3xl" />
              <Image
                src="/trophy-cast-logo-256.png"
                alt="Trophy Cast logo"
                width={256}
                height={256}
                priority
                className="relative h-40 w-auto drop-shadow-2xl sm:h-56 lg:h-64"
              />
            </div>
            <div className="space-y-3">
              <h1 className="font-heading text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
                {siteContent.brand.name}
              </h1>
              <p className="text-xl font-semibold text-trophyGold sm:text-2xl">{siteContent.brand.motto}</p>
            </div>
          </div>

          {/* Two-column hero body */}
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-copyLight backdrop-blur-sm">
                <Icon />
                <span>{siteContent.hero.eyebrow}</span>
              </div>
              <div className="space-y-6">
                <h2 className="font-heading text-5xl font-extrabold leading-[1.08] text-white sm:text-6xl lg:text-7xl">
                  {siteContent.hero.title}
                </h2>
                <p className="max-w-2xl text-xl leading-relaxed text-copyMuted">{siteContent.hero.description}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <CTAButton href={waitlistHref} label={siteContent.waitlist.primaryCta} variant="primary" />
                <CTAButton
                  href={siteContent.waitlist.secondaryHref}
                  label={siteContent.waitlist.secondaryCta}
                  variant="secondary"
                />
              </div>
              <div className="grid gap-4 rounded-3xl border border-trophyGold/15 bg-deepPanel/50 p-6 text-sm text-copyMuted backdrop-blur-sm sm:grid-cols-2">
                {siteContent.hero.highlights.map((highlight) => (
                  <div key={highlight.label} className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.45em] text-trophyGold">
                      {highlight.label}
                    </p>
                    <p className="text-base font-medium text-copyLight">{highlight.value}</p>
                  </div>
                ))}
              </div>
              <blockquote className="border-l-2 border-white/15 pl-4 text-sm italic text-copyMuted/80">
                {siteContent.brand.northStar}
              </blockquote>
            </div>

            {/* Feature preview sidebar */}
            <div className="rounded-3xl border border-trophyGold/10 bg-liftedPanel/60 p-8 shadow-glow backdrop-blur-sm">
              <p className="font-heading text-base font-bold text-trophyGold">{siteContent.brand.name}</p>
              <p className="text-sm text-copyMuted">{siteContent.hero.statRibbon}</p>
              <div className="mt-8 space-y-5">
                {siteContent.what.items.map((item) => (
                  <div key={item.title} className="card-hover rounded-2xl border border-white/5 bg-deepPanel/60 p-5">
                    <div className="flex items-center gap-3">
                      <span className="emoji-icon">{item.emoji}</span>
                      <p className="font-heading text-base font-semibold text-copyLight">{item.title}</p>
                    </div>
                    <p className="mt-2 text-sm text-copyMuted">{item.description}</p>
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
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.what.title}</p>
            <h2 className="font-heading text-4xl font-extrabold text-copyLight sm:text-5xl">{siteContent.what.summary}</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {siteContent.what.items.map((item) => (
              <div key={item.title} className="card-hover gold-top-bar rounded-2xl border border-white/5 bg-deepPanel/70 p-6">
                <span className="emoji-icon-lg">{item.emoji}</span>
                <p className="mt-3 font-heading text-xl font-bold text-copyLight">{item.title}</p>
                <p className="mt-3 text-copyMuted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <Section id={siteContent.how.id} variant="surfaceLifted">
        <div className="space-y-10">
          <div className="space-y-3 text-center">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.how.title}</p>
            <h2 className="font-heading text-4xl font-extrabold text-copyLight sm:text-5xl">{siteContent.how.tagline}</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {siteContent.how.steps.map((step, index) => (
              <div key={step.title} className="card-hover relative rounded-2xl border border-trophyGold/10 bg-deepPanel/80 p-7 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-trophyGold/20 font-heading text-lg font-bold text-trophyGold">
                  {index + 1}
                </span>
                <span className="mt-4 block text-3xl">{step.emoji}</span>
                <p className="mt-3 font-heading text-xl font-bold text-copyLight">{step.title}</p>
                <p className="mt-2 text-copyMuted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FOR ANGLERS ──────────────────────────────────────── */}
      <Section id={siteContent.anglers.id} variant="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.anglers.title}</p>
            <p className="text-lg leading-relaxed text-copyLight">{siteContent.anglers.description}</p>
          </div>
          <ul className="space-y-4">
            {siteContent.anglers.bulletPoints.map((point) => (
              <li key={point.text} className="card-hover flex items-start gap-4 rounded-2xl border border-white/5 bg-deepPanel/70 p-5">
                <span className="emoji-icon shrink-0">{point.emoji}</span>
                <span className="text-copyMuted">{point.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── AI COACH ─────────────────────────────────────────── */}
      <Section id={siteContent.coachInsights.id} variant="surfaceLifted">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.coachInsights.title}</p>
            <p className="text-lg leading-relaxed text-copyLight">{siteContent.coachInsights.description}</p>
          </div>
          <ul className="space-y-4">
            {siteContent.coachInsights.bullets.map((bullet) => (
              <li key={bullet.text} className="card-hover flex items-start gap-4 rounded-2xl border border-white/5 bg-deepPanel/80 p-5">
                <span className="emoji-icon shrink-0">{bullet.emoji}</span>
                <span className="text-copyMuted">{bullet.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── FOR CLUBS ────────────────────────────────────────── */}
      <Section id={siteContent.clubs.id} variant="surface">
        <div className="space-y-10">
          <div className="space-y-3">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.clubs.title}</p>
            <p className="text-lg leading-relaxed text-copyLight">{siteContent.clubs.lead}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {siteContent.clubs.items.map((item) => (
              <div key={item.title} className="card-hover gold-top-bar rounded-2xl border border-white/5 bg-deepPanel/80 p-6">
                <span className="emoji-icon-lg">{item.emoji}</span>
                <p className="mt-3 font-heading text-xl font-bold text-copyLight">{item.title}</p>
                <p className="mt-2 text-copyMuted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Gold divider ─────────────────────────────────────── */}
      <div className="gold-divider" />

      {/* ── CLUB IN A BOX ────────────────────────────────────── */}
      <Section id={siteContent.clubInABox.id} variant="accent">
        <div className="space-y-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-trophyGold/40 bg-trophyGold/10 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.45em] text-trophyGold shadow-glow">
            🚀 {siteContent.clubInABox.badge}
          </span>
          <h2 className="font-heading text-4xl font-extrabold text-copyLight sm:text-5xl">{siteContent.clubInABox.title}</h2>
          <p className="max-w-3xl text-lg text-copyMuted">{siteContent.clubInABox.description}</p>
          <ul className="grid gap-4 sm:grid-cols-3">
            {siteContent.clubInABox.checklist.map((item) => (
              <li key={item} className="card-hover rounded-2xl border border-trophyGold/20 bg-deepPanel/70 p-5 text-sm font-medium text-copyLight">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── SCREENSHOTS ──────────────────────────────────────── */}
      <Section id={siteContent.screenshots.id} variant="surfaceLifted">
        <div className="space-y-8">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.screenshots.title}</p>
          <ScreenshotGrid caption={siteContent.screenshots.caption} images={siteContent.screenshots.images} />
        </div>
      </Section>

      {/* ── TRUST ────────────────────────────────────────────── */}
      <Section id={siteContent.trust.id} variant="surface">
        <div className="space-y-10">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.trust.title}</p>
          <div className="grid gap-6 lg:grid-cols-3">
            {siteContent.trust.pillars.map((pillar) => (
              <div key={pillar.title} className="card-hover gold-top-bar rounded-2xl border border-white/5 bg-deepPanel/80 p-6">
                <span className="emoji-icon-lg">{pillar.emoji}</span>
                <p className="mt-3 font-heading text-xl font-bold text-copyLight">{pillar.title}</p>
                <p className="mt-3 text-copyMuted">{pillar.description}</p>
              </div>
            ))}
          </div>
          {/* Mid-page CTA banner */}
          <div className="rounded-3xl border border-trophyGold/15 bg-liftedPanel/50 p-8 shadow-glow sm:flex sm:items-center sm:justify-between">
            <p className="text-base text-copyMuted sm:max-w-xl">{siteContent.midCta.message}</p>
            <CTAButton href={waitlistHref} label={siteContent.waitlist.primaryCta} variant="primary" className="mt-4 w-full sm:mt-0 sm:w-auto" />
          </div>
        </div>
      </Section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <Section id={siteContent.finalCta.id} variant="surfaceLifted">
        <div className="space-y-8 text-center">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">{siteContent.finalCta.title}</p>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-copyLight">{siteContent.finalCta.description}</p>
          <WaitlistForm waitlist={siteContent.waitlist} message={siteContent.finalCta.message} />
        </div>
      </Section>
      <ScrollToTop />
    </>
  );
}
