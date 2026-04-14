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

      {/* ── Tight Line Outdoors ──────────────────────────────── */}
      <Section variant="surface">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
                Club Partner — Weekday Tournament Series
              </p>
              <p className="font-heading text-xl font-bold text-copyLight sm:text-2xl">
                Tightline Outdoors
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteContent.tightLineOutdoors.logoUrl}
              alt="Tightline Outdoors"
              className="h-10 w-auto object-contain opacity-90"
            />
          </div>

          {/* Description */}
          <p className="max-w-3xl text-sm text-copyMuted">
            {siteContent.tightLineOutdoors.description}
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-3">
            {siteContent.tightLineOutdoors.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-trophyGold/20 bg-deepPanel/60 px-3 py-2 text-center"
              >
                <p className="font-heading text-sm font-bold text-trophyGold">{s.label}</p>
                <p className="text-[10px] text-copyMuted">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Catch Rate card */}
          <div className="gold-top-bar rounded-2xl border border-trophyGold/20 bg-deepPanel/80 p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-block rounded-full border border-trophyGold/30 bg-trophyGold/10 px-3 py-0.5 text-[10px] font-semibold text-trophyGold">
                  {siteContent.tightLineOutdoors.catchRate.badge}
                </span>
                <p className="font-heading text-lg font-bold text-copyLight">Catch Rate 2026</p>
                <p className="text-xs text-copyMuted">{siteContent.tightLineOutdoors.catchRate.season}</p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-xs font-semibold text-trophyGold">{siteContent.tightLineOutdoors.catchRate.entry}</p>
                <p className="text-[10px] text-copyMuted">{siteContent.tightLineOutdoors.catchRate.format}</p>
                <p className="text-[10px] text-copyMuted">{siteContent.tightLineOutdoors.catchRate.location}</p>
              </div>
            </div>

            {/* Species pills */}
            <div className="flex flex-wrap gap-2">
              {siteContent.tightLineOutdoors.catchRate.species.map((sp) => (
                <span
                  key={sp}
                  className="rounded-full border border-trophyGold/30 bg-trophyGold/10 px-3 py-0.5 text-[11px] font-semibold text-trophyGold"
                >
                  {sp}
                </span>
              ))}
            </div>

            {/* Prizes + Beat Nate */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-copyMuted mb-1">Weekly Prizes</p>
                <p className="text-xs text-copyMuted">{siteContent.tightLineOutdoors.catchRate.prizes}</p>
              </div>
              <div className="rounded-xl border border-trophyGold/30 bg-trophyGold/5 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-trophyGold mb-1">Beat Nate Bonus</p>
                <p className="text-xs text-copyMuted">{siteContent.tightLineOutdoors.catchRate.beatNate}</p>
              </div>
            </div>

            {/* Schedule highlights */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-copyMuted mb-2">2026 Schedule</p>
              <div className="grid gap-y-1 grid-cols-1 sm:grid-cols-2">
                {siteContent.tightLineOutdoors.catchRate.schedule.map((ev) => (
                  <div key={ev.date} className="flex gap-3 text-xs">
                    <span className="w-14 shrink-0 font-semibold text-trophyGold">{ev.date}</span>
                    <span className="text-copyMuted">
                      <span className="font-medium text-copyLight">{ev.label}</span>
                      {ev.note ? ` — ${ev.note}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={siteContent.tightLineOutdoors.catchRate.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-semibold text-trophyGold underline underline-offset-2 hover:opacity-80"
            >
              Full tournament details →
            </a>
          </div>

          {/* Guides grid */}
          <div className="space-y-3">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
              Meet the Guides
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siteContent.tightLineOutdoors.guides.map((guide) => (
                <div
                  key={guide.name}
                  className="card-hover gold-top-bar rounded-2xl border border-trophyGold/10 bg-deepPanel/70 p-4"
                >
                  <p className="mt-2 font-heading text-sm font-bold text-trophyGold">{guide.name}</p>
                  <p className="text-xs font-medium text-copyLight">{guide.species}</p>
                  <p className="mt-1 text-[11px] text-copyMuted">{guide.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-trophyGold/10 pt-4 text-xs text-copyMuted">
            <a href={`tel:${siteContent.tightLineOutdoors.contact.phone}`} className="hover:text-trophyGold transition-colors">
              📞 {siteContent.tightLineOutdoors.contact.phone}
            </a>
            <a href={`mailto:${siteContent.tightLineOutdoors.contact.email}`} className="hover:text-trophyGold transition-colors">
              ✉️ {siteContent.tightLineOutdoors.contact.email}
            </a>
            <a href={`https://${siteContent.tightLineOutdoors.contact.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-trophyGold transition-colors">
              🌐 {siteContent.tightLineOutdoors.contact.website}
            </a>
            <a href={siteContent.tightLineOutdoors.contact.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-trophyGold transition-colors">
              Facebook
            </a>
          </div>
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

      {/* ── Live Club Partners ────────────────────────────────── */}
      <Section variant="surfaceLifted">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="space-y-3 text-center">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
              Two clubs. Live right now.
            </p>
            <p className="text-sm text-copyMuted">
              Trophy Cast launched with Denver Bassmasters and is now powering Tightline Outdoors&apos; Catch Rate tournament series. Two very different clubs — one platform.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Denver Bassmasters",
                detail: "50+ member bass club running full AOY standings, board tools, secretary minutes, treasurer, and live tournaments — all from their phones.",
              },
              {
                title: "Tightline Outdoors",
                detail: "Weekday tournament series — Catch Rate 2026. Multi-species, 9 events, $20/entry, Chatfield Reservoir. Open to any angler in the Denver metro.",
              },
              {
                title: "Your club",
                detail: "Clubs are onboarded in waves so every crew gets real setup support. Join the waitlist and we'll reach out with access details.",
              },
            ].map((org) => (
              <div
                key={org.title}
                className="card-hover rounded-2xl border border-trophyGold/10 bg-deepPanel/70 p-4 text-center"
              >
                <p className="mt-2 font-heading text-sm font-bold text-trophyGold">
                  {org.title}
                </p>
                <p className="mt-1 text-xs text-copyMuted">{org.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-copyMuted">
            Clubs are added carefully rather than all at once so the workflows hold up in real use.
          </p>
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Section id="waitlist" variant="accent">
        <div className="space-y-6 text-center">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-trophyGold">
            Want in?
          </p>
          <p className="mx-auto max-w-2xl text-sm text-copyMuted">
            Denver Bassmasters and Tightline Outdoors are live on Trophy Cast right now. Join the waitlist and we&apos;ll reach out when we&apos;re ready for your crew.
          </p>
          <WaitlistForm waitlist={siteContent.waitlist} message={siteContent.finalCta.message} />
        </div>
      </Section>
    </>
  );
}
