import { NextResponse } from "next/server";
import { readJobs, getSlug } from "@/lib/jobs";

function siteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return base.replace(/\/$/, "") + path;
}

export async function GET() {
  const jobs = await readJobs();
  const filtered = jobs.filter((j) =>
    (j.tags || []).some((t) => /qa|quality|test|testing|automation|sdet/i.test(String(t)))
  );
  const xml = renderAtom(filtered, "QA");
  return new NextResponse(xml, {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}

function renderAtom(jobs: Awaited<ReturnType<typeof readJobs>>, label: string) {
  const updated = jobs[0]?.createdAt || new Date().toISOString();
  const feedId = siteUrl(`/feed/${label.toLowerCase()}.xml`);
  const items = jobs
    .map(
      (j) => `
    <entry>
      <id>${siteUrl(`/jobs/${getSlug(j)}`)}</id>
      <title>${escapeXml(`${j.title} — ${j.company}`)}</title>
      <link href="${siteUrl(`/jobs/${getSlug(j)}`)}" />
      <updated>${j.createdAt}</updated>
      <summary>${escapeXml(j.description || "Remote role in Brazil")}</summary>
    </entry>`
    )
    .join("");
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${feedId}</id>
  <title>Remote Jobs Brazil — ${label} Feed</title>
  <link href="${feedId}" rel="self" />
  <updated>${updated}</updated>
  <author><name>Remote Jobs Brazil</name></author>
  ${items}
</feed>`;
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
