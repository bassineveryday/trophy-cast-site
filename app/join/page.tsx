import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { TC_LOGOS } from "@/lib/brandAssets";
import { siteContent } from "@/lib/content";

export const metadata = {
  title: "Join Trophy Cast",
  description:
    "Join the Trophy Cast waitlist. TC Coach learns how you fish and gets smarter every time you go.",
};

/**
 * /join is where every Trophy Cast flyer and QR code sends people.
 *
 * It used to BE the Denver BassMasters mailing-list form, so scanning a Trophy
 * Cast flyer landed you on "Join Denver BassMasters" (found 2026-09-09). This
 * page is Trophy Cast and nothing else — we are not a directory for other
 * people's clubs.
 */
export default function JoinPage() {
  return (
    <div className="bg-midnight py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl space-y-10 text-center">
          <div className="flex justify-center">
            <Image
              src={TC_LOGOS.fishMark}
              alt="Trophy Cast"
              width={180}
              height={180}
              priority
              className="h-24 w-auto"
            />
          </div>

          <div className="space-y-5">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.34em] text-trophyGold">
              {siteContent.hero.eyebrow}
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Join Trophy Cast
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-copyMuted">
              TC Coach learns how you fish and gets smarter every time you go out. We&apos;re in
              private beta and onboarding founding anglers now.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#waitlist"
              className="rounded-full bg-trophyGold px-8 py-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-midnight shadow-glow transition hover:brightness-110"
            >
              {siteContent.waitlist.primaryCta}
            </Link>
            <Link
              href="/coach"
              className="rounded-full border border-trophyGold/40 px-8 py-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-trophyGold transition hover:bg-trophyGold/10"
            >
              Meet TC Coach
            </Link>
          </div>

          <p className="text-sm text-copyMuted">
            {siteContent.brand.motto}
          </p>
        </div>
      </Container>
    </div>
  );
}
