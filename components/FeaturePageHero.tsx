import { Container } from "./Container";
import { CTAButton } from "./CTAButton";

interface FeaturePageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  waitlistHref?: string;
}

export function FeaturePageHero({ eyebrow, title, description, waitlistHref = "#waitlist" }: FeaturePageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-midnight bg-heroMesh py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
            {eyebrow}
          </p>
          <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-copyMuted sm:text-base">
            {description}
          </p>
          <div className="flex justify-center gap-3">
            <CTAButton href={waitlistHref} label="Join the waitlist" variant="primary" />
            <CTAButton href="/" label="← Back to home" variant="ghost" />
          </div>
        </div>
      </Container>
    </section>
  );
}
