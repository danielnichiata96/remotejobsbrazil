import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createRevalidateResponse } from "@/lib/cache";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const paths: string[] = Array.isArray(body.paths) ? body.paths : [
      "/",
      "/sitemap.xml",
      "/feed.xml",
      "/feed/react.xml",
      "/feed/node.xml",
      "/feed/qa.xml",
      "/remote-react-jobs-brazil",
      "/remote-node-jobs-brazil",
      "/remote-qa-jobs-brazil",
    ];
    const tags: string[] = Array.isArray(body.tags) ? body.tags : ["jobs", "homepage", "landing-pages"];
    return createRevalidateResponse(paths, tags);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
