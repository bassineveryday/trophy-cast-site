"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "./CTAButton";
import { TC_LOGOS } from "@/lib/brandAssets";

interface NavbarProps {
  brand: { name: string; motto: string; logoText: string };
  navItems: Array<{ label: string; href: string }>;
  waitlistCta: { label: string; href: string };
}

export function Navbar({ brand, navItems, waitlistCta }: NavbarProps) {
  const [open, setOpen] = useState(false);
  return (
    <header id="top" className="sticky top-0 z-50 border-b border-white/5 bg-midnight/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="#top" className="flex items-center gap-3 text-copyLight">
          <Image
            src={TC_LOGOS.icon256}
            alt="Trophy Cast logo"
            width={256}
            height={256}
            priority
            className="h-10 w-10 rounded-full ring-1 ring-trophyGold/20 sm:h-11 sm:w-11"
          />
          <div className="hidden sm:block">
            <p className="font-heading text-base font-bold tracking-wide text-copyLight">{brand.name}</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-trophyGold/80">{brand.motto}</p>
          </div>
        </Link>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-copyLight sm:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="text-lg">{open ? "\u2715" : "\u2630"}</span>
        </button>

        <div className="hidden items-center gap-8 text-sm text-copyMuted sm:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-copyLight">
              {item.label}
            </Link>
          ))}
          <CTAButton href={waitlistCta.href} label={waitlistCta.label} variant="primary" />
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-midnight/90 px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-4 text-sm text-copyMuted">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 px-4 py-2 text-center"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <CTAButton
              href={waitlistCta.href}
              label={waitlistCta.label}
              variant="primary"
              className="w-full"
            />
          </div>
        </div>
      )}
    </header>
  );
}
