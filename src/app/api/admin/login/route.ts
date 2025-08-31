import { NextResponse } from "next/server";
import { ADMIN_COOKIE, signAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  const secret = process.env.ADMIN_KEY;
  if (!secret) {
    return NextResponse.json({ error: "ADMIN_KEY not set" }, { status: 500 });
  }
  let body: { key?: string } = {};
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      body = Object.fromEntries(form.entries()) as { key?: string };
    } else {
      body = await req.json();
    }
  } catch {}
  if (!body.key || body.key !== secret) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }
  const token = signAdminToken();
  if (!token) return NextResponse.json({ error: "Auth error" }, { status: 500 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
