import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Montserrat, Raleway } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteContent } from "@/lib/content";
import { TC_EMAIL_LOGOS } from "@/lib/brandAssets";

const heading = Montserrat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-heading" });
const body = Raleway({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });

/** Link-preview image: solid background so it reads on any chat app's canvas. */
const SHARE_IMAGE = {
  url: TC_EMAIL_LOGOS.emailHeader,
  width: 300,
  height: 300,
  alt: "Trophy Cast",
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://trophycast.app"),
  title: siteContent.seo.title,
  description: siteContent.seo.description,
  icons: {
    icon: "/tc-logos/trophy-cast-logo-48.png",
    apple: "/tc-logos/trophy-cast-logo-256.png",
  },
  openGraph: {
    type: "website",
    siteName: "Trophy Cast",
    url: "https://trophycast.app",
    title: siteContent.seo.title,
    description: siteContent.seo.description,
    // Solid-background mark. The transparent fish mark used to land here and
    // rendered against whatever colour the messaging app happened to use.
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.seo.title,
    description: siteContent.seo.description,
    images: [SHARE_IMAGE.url],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const waitlistHref = "/#waitlist";

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
        <Analytics />
      </body>
    </html>
  );
}
