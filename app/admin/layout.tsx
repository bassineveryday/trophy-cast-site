import type { Metadata } from "next";

/**
 * Covers every nested /admin route. These pages are client components behind a
 * client-side password only, so the noindex has to live in a layout.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
