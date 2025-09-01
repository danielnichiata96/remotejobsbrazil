import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { writeLead } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({} as Record<string, unknown>));
    const name = typeof json.name === "string" ? json.name : null;
    const email = typeof json.email === "string" ? json.email : null;
    const company = typeof json.company === "string" ? json.company : null;
    const message = typeof json.message === "string" ? json.message : null;
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const sb = getServiceSupabase();
  if (sb) {
      const { error } = await sb.from("leads").insert({ name, email, company, message });
      if (!error) return NextResponse.json({ ok: true }, { status: 201 });
      // If DB failed, continue to file fallback
    }

    const fsRes = await writeLead({ name, email, company, message });
    if (fsRes.ok) {
      return NextResponse.json({ ok: true, warning: "Lead salvo localmente" }, { status: 201 });
    }
    // As último recurso, aceite sem persistir para não quebrar UX
    console.warn("Lead not persisted", { email, company, reason: fsRes.error });
    return NextResponse.json({ ok: true, warning: "Lead recebido (não persistido)" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
