import type { Metadata } from "next";

/**
 * Survey pages are per-club links sent to members, not public pages.
 * The page is a client component, so the noindex lives here.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
