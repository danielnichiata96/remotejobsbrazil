import type { MetadataRoute } from "next";
import { readJobs, getSlug } from "@/lib/jobs";

function siteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return base.replace(/\/$/, "") + path;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await readJobs();
  const now = new Date().toISOString();
  const items: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: siteUrl("/post"), lastModified: now },
  ];
  for (const j of jobs) {
    items.push({
      url: siteUrl(`/jobs/${getSlug(j)}`),
      lastModified: j.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  return items;
}
