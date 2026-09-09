import type { MetadataRoute } from "next";

const SITE_URL = "https://trophycast.app";

/**
 * Keep internal tooling out of search results.
 *
 * /support mints one-time sign-in links for a member, and /admin is guarded
 * only on the client — neither belongs in an index. This is the crawler-facing
 * half; each of those routes also ships a `noindex` layout so a crawler that
 * reaches the URL directly still refuses to list it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/support", "/survey/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
