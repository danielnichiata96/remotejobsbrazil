import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const host = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const base = host.replace(/\/$/, "");
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Disallow API and internal tooling from being crawled
      { userAgent: "*", disallow: [
        "/api/",
        "/_next/",
        "/admin",
        "/import",
      ] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
