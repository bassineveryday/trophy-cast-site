import type { Metadata } from "next";

/**
 * The support console mints one-time sign-in links for a member's account.
 * The page itself is a client component and cannot export metadata, so the
 * noindex lives here.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
