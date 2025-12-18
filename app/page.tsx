import { CTAButton } from "@/components/CTAButton";
import { Container } from "@/components/Container";
import { Icon } from "@/components/Icon";
import { ScreenshotGrid } from "@/components/ScreenshotGrid";
import { Section } from "@/components/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { siteContent } from "@/lib/content";
import { buildMailtoHref } from "@/lib/utils";

export default function Page() {
  const waitlistHref = buildMailtoHref(siteContent.waitlist);

  return (
    <>
      <section id="hero" className="relative overflow-hidden bg-midnight bg-heroMesh py-16 sm:py-24">
        <Container className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-copyMuted">
              <Icon />
              <span>{siteContent.hero.eyebrow}</span>
            </div>
            <div className="space-y-4">
              <p className="font-heading text-sm uppercase tracking-[0.5em] text-trophyGold">
                {siteContent.brand.motto}
              </p>
              <h1 className="font-heading text-4xl font-semibold leading-tight text-copyLight sm:text-5xl lg:text-6xl">
                {siteContent.hero.title}
              </h1>
              <p className="max-w-2xl text-lg text-copyMuted">{siteContent.hero.description}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <CTAButton href={waitlistHref} label={siteContent.waitlist.primaryCta} variant="primary" />
              <CTAButton
                href={siteContent.waitlist.secondaryHref}
                label={siteContent.waitlist.secondaryCta}
                variant="secondary"
              />
            </div>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-deepPanel/60 p-6 text-sm text-copyMuted sm:grid-cols-2">
              {siteContent.hero.highlights.map((highlight) => (
                <div key={highlight.label} className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.45em] text-trophyGold">
                    {highlight.label}
                  </p>
                  <p className="text-base text-copyLight">{highlight.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-surface text-grid rounded-3xl border border-white/5 p-8">
            <p className="font-heading text-base text-trophyGold">{siteContent.brand.name}</p>
            <p className="text-sm text-copyMuted">{siteContent.hero.statRibbon}</p>
            <div className="mt-10 space-y-6">
              {siteContent.what.items.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/5 bg-deepPanel/60 p-4">
                  <p className="font-heading text-base text-copyLight">{item.title}</p>
                  <p className="text-sm text-copyMuted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Section id={siteContent.what.id} variant="surface">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm text-trophyGold">{siteContent.what.title}</p>
            <h2 className="font-heading text-3xl text-copyLight sm:text-4xl">{siteContent.what.summary}</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {siteContent.what.items.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/5 bg-deepPanel/70 p-6">
                <p className="font-heading text-xl text-copyLight">{item.title}</p>
                <p className="mt-3 text-copyMuted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id={siteContent.how.id} variant="surface">
        <div className="space-y-10">
          <div className="space-y-3">
            <p className="text-sm text-trophyGold">{siteContent.how.title}</p>
            <h2 className="font-heading text-3xl text-copyLight sm:text-4xl">{siteContent.how.tagline}</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {siteContent.how.steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-white/5 bg-deepPanel/80 p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bass/30 font-heading text-copyLight">
                  {index + 1}
                </span>
                <p className="mt-4 font-heading text-xl text-copyLight">{step.title}</p>
                <p className="mt-2 text-copyMuted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id={siteContent.anglers.id} variant="surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm text-trophyGold">{siteContent.anglers.title}</p>
            <p className="text-lg text-copyLight">{siteContent.anglers.description}</p>
          </div>
          <ul className="space-y-4 text-copyMuted">
            {siteContent.anglers.bulletPoints.map((point) => (
              <li key={point} className="rounded-2xl border border-white/5 bg-deepPanel/70 p-4">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id={siteContent.coachInsights.id} variant="surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm text-trophyGold">{siteContent.coachInsights.title}</p>
            <p className="mt-4 text-lg text-copyLight">{siteContent.coachInsights.description}</p>
          </div>
          <ul className="space-y-4 text-copyMuted">
            {siteContent.coachInsights.bullets.map((bullet) => (
              <li key={bullet} className="rounded-2xl border border-white/5 bg-deepPanel/80 p-4">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id={siteContent.clubs.id} variant="surface">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm text-trophyGold">{siteContent.clubs.title}</p>
            <p className="text-lg text-copyLight">{siteContent.clubs.lead}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {siteContent.clubs.items.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/5 bg-deepPanel/80 p-6">
                <p className="font-heading text-xl text-copyLight">{item.title}</p>
                <p className="mt-2 text-copyMuted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id={siteContent.clubInABox.id} variant="accent">
        <div className="space-y-6">
          <span className="inline-flex w-fit rounded-full border border-trophyGold/40 px-4 py-1 text-xs uppercase tracking-[0.45em] text-trophyGold">
            {siteContent.clubInABox.badge}
          </span>
          <h2 className="font-heading text-3xl text-copyLight sm:text-4xl">{siteContent.clubInABox.title}</h2>
          <p className="text-copyMuted">{siteContent.clubInABox.description}</p>
          <ul className="grid gap-4 text-copyLight sm:grid-cols-3">
            {siteContent.clubInABox.checklist.map((item) => (
              <li key={item} className="rounded-2xl border border-trophyGold/30 bg-deepPanel/70 p-4 text-sm text-copyLight">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id={siteContent.screenshots.id} variant="surface">
        <div className="space-y-6">
          <p className="text-sm text-trophyGold">{siteContent.screenshots.title}</p>
          <ScreenshotGrid caption={siteContent.screenshots.caption} images={siteContent.screenshots.images} />
        </div>
      </Section>

      <Section id={siteContent.trust.id} variant="surface">
        <div className="space-y-8">
          <p className="text-sm text-trophyGold">{siteContent.trust.title}</p>
          <div className="grid gap-6 lg:grid-cols-3">
            {siteContent.trust.pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-white/5 bg-deepPanel/80 p-6">
                <p className="font-heading text-xl text-copyLight">{pillar.title}</p>
                <p className="mt-3 text-copyMuted">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id={siteContent.finalCta.id} variant="surface">
        <div className="space-y-6">
          <p className="text-sm text-trophyGold">{siteContent.finalCta.title}</p>
          <p className="text-lg text-copyLight">{siteContent.finalCta.description}</p>
          <WaitlistForm waitlist={siteContent.waitlist} message={siteContent.finalCta.message} />
        </div>
      </Section>
    </>
  );
}
