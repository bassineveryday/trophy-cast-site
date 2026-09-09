import type { MetadataRoute } from "next";

const SITE_URL = "https://trophycast.app";

/** Public marketing pages only — internal tools and one-off flyers stay out. */
const ROUTES = [
  "",
  "/coach",
  "/anglers",
  "/clubs",
  "/join",
  "/privacy",
  "/terms",
  "/sms-consent",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.7,
  }));
}
