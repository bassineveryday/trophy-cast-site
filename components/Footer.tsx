import Link from "next/link";

interface FooterProps {
  motto: string;
  tagline?: string;
  aiDisclaimer: string;
  links: Array<{ label: string; href: string }>;
}

export function Footer({ motto, tagline, aiDisclaimer, links }: FooterProps) {
  return (
    <footer className="border-t border-white/5 bg-deeperPanel/70 py-10 text-sm text-copyMuted">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-lg text-copyLight">{motto}</p>
          {tagline && <p className="text-sm text-trophyGold">{tagline}</p>}
          <p className="text-xs text-copyMuted">{aiDisclaimer}</p>
        </div>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-copyLight">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
