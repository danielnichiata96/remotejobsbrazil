import crypto from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "rjb_admin";

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function getKey(): string | null {
  return process.env.ADMIN_KEY ?? null;
}

export function signAdminToken(now = Date.now()): string | null {
  const key = getKey();
  if (!key) return null;
  const ts = String(now);
  const sig = crypto
    .createHmac("sha256", key)
    .update(ts)
    .digest("hex");
  return `${ts}.${sig}`;
}

export function verifyAdminToken(token: string | undefined | null, ttlMs = DEFAULT_TTL_MS): boolean {
  const key = getKey();
  if (!key || !token) return false;
  const [ts, sig] = token.split(".");
  if (!ts || !sig) return false;
  const expected = crypto.createHmac("sha256", key).update(ts).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const age = Date.now() - Number(ts);
  if (!Number.isFinite(age) || age < 0 || age > ttlMs) return false;
  return true;
}

export function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}
