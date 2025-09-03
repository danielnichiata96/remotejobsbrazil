import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const host = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const base = host.replace(/\/$/, "");
  return {
    // Allow only the public discovery endpoints; block internal APIs and admin pages
    rules: {
      userAgent: "*",
      allow: ["/", "/sitemap.xml", "/feed.xml"],
      disallow: ["/api/", "/_next/", "/admin", "/admin/", "/post", "/import"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
