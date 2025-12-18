import type { Metadata } from "next";
import { Montserrat, Raleway } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteContent } from "@/lib/content";
import { buildMailtoHref } from "@/lib/utils";

const heading = Montserrat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-heading" });
const body = Raleway({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });

export const metadata: Metadata = {
  title: `${siteContent.brand.name} | Confidence-first fishing log`,
  description:
    "Trophy Cast helps anglers log catches with photos and track season stats, with optional behind-the-scenes AI for logging assistance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const waitlistHref = buildMailtoHref(siteContent.waitlist);

  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} bg-midnight text-copyLight`}>
        <Navbar
          brand={{
            name: siteContent.brand.name,
            motto: siteContent.brand.motto,
            logoText: siteContent.brand.logoText,
          }}
          navItems={siteContent.nav}
          waitlistCta={{ label: siteContent.waitlist.primaryCta, href: waitlistHref }}
        />
        <main>{children}</main>
        <Footer {...siteContent.footer} />
      </body>
    </html>
  );
}
