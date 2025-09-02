import type { MetadataRoute } from "next";
import { readJobs, getSlug } from "@/lib/jobs";

function siteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return base.replace(/\/$/, "") + path;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await readJobs();
  const now = new Date().toISOString();
  const latestJobDate = jobs[0]?.createdAt || now;
  const items: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), lastModified: latestJobDate, changeFrequency: "daily", priority: 1 },
    { url: siteUrl("/post"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: siteUrl("/employers"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: siteUrl("/remote-react-jobs-brazil"), lastModified: latestJobDate, changeFrequency: "daily", priority: 0.9 },
    { url: siteUrl("/remote-node-jobs-brazil"), lastModified: latestJobDate, changeFrequency: "daily", priority: 0.9 },
    { url: siteUrl("/remote-qa-jobs-brazil"), lastModified: latestJobDate, changeFrequency: "daily", priority: 0.9 },
  // Category feeds for discovery
  { url: siteUrl("/feed/react.xml"), lastModified: latestJobDate, changeFrequency: "daily", priority: 0.2 },
  { url: siteUrl("/feed/node.xml"), lastModified: latestJobDate, changeFrequency: "daily", priority: 0.2 },
  { url: siteUrl("/feed/qa.xml"), lastModified: latestJobDate, changeFrequency: "daily", priority: 0.2 },
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
