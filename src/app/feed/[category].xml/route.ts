import { NextResponse } from "next/server";
import { getSlug } from "@/lib/jobs";
import { readJobsDirect } from "@/lib/cache";

// Next.js doesn't enforce a strict type for dynamic route params here; use unknown and validate at runtime
type Params = { params: Promise<unknown> };

function siteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return base.replace(/\/$/, "") + path;
}

function toRss(title: string, items: Array<{ title: string; link: string; description?: string; pubDate?: string }>) {
  const feedItems = items
    .map((i) => `\n    <item>\n      <title><![CDATA[${i.title}]]></title>\n      <link>${i.link}</link>\n      ${i.description ? `<description><![CDATA[${i.description}]]></description>` : ""}\n      ${i.pubDate ? `<pubDate>${new Date(i.pubDate).toUTCString()}</pubDate>` : ""}\n    </item>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${title}</title>
    <link>${siteUrl("/")}</link>
    <description>Vagas remotas para o Brasil</description>${feedItems}
  </channel>
</rss>`;
}

export const runtime = "nodejs";

export async function GET(_: Request, ctx: Params) {
  const p = (await ctx.params) as { category?: string };
  const { category } = p;
  const key = String(category).toLowerCase();
  const jobs = await readJobsDirect();

  const filtered = jobs.filter((j) => {
    const tags = (j.tags || []).map((t) => t.toLowerCase());
    const role = (j.roleCategory || "").toLowerCase();
    if (key === "react") return tags.includes("react") || /react/.test(role);
    if (key === "node") return tags.includes("node") || tags.includes("node.js") || /node/.test(role);
    if (key === "qa") return tags.includes("qa") || /qa|quality/.test(role);
    return false;
  });

  const items = filtered.slice(0, 50).map((j) => ({
    title: `${j.title} — ${j.company}`,
    link: siteUrl(`/jobs/${getSlug(j)}`),
    description: j.curatedDescription || j.description?.slice(0, 240),
    pubDate: j.createdAt,
  }));
  const xml = toRss(`Remote Jobs Brazil — ${key.toUpperCase()}`, items);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
