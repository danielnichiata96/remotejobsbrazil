import { cookies } from "next/headers";
import Link from "next/link";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

async function isAuthed() {
  const c = await cookies();
  const token = c.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

async function fetchLeads() {
  const sb = getServiceSupabase();
  if (!sb) return { data: [] as any[], error: "Service role not configured" };
  const { data, error } = await sb
    .from("leads")
    .select("id,name,email,company,message,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  return { data: data ?? [], error: error?.message };
}

export default async function AdminLeadsPage() {
  const authed = await isAuthed();
  if (!authed) {
    return (
      <div className="min-h-screen px-6 py-10 max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Leads</h1>
          <Link href="/" className="underline text-sm">Back</Link>
        </header>
        <p className="text-sm">Não autorizado. Faça login em <Link href="/admin" className="underline">/admin</Link>.</p>
      </div>
    );
  }

  const { data, error } = await fetchLeads();

  return (
    <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="underline text-sm">Admin</Link>
          <Link href="/" className="underline text-sm">Home</Link>
        </div>
      </header>

      {error && (
        <p className="text-red-600 text-sm">Erro ao carregar: {error}</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left p-2 border-b">Data</th>
              <th className="text-left p-2 border-b">Nome</th>
              <th className="text-left p-2 border-b">Email</th>
              <th className="text-left p-2 border-b">Empresa</th>
              <th className="text-left p-2 border-b">Mensagem</th>
            </tr>
          </thead>
          <tbody>
            {data.map((l) => (
              <tr key={l.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                <td className="align-top p-2 border-b whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                <td className="align-top p-2 border-b">{l.name || "—"}</td>
                <td className="align-top p-2 border-b">{l.email}</td>
                <td className="align-top p-2 border-b">{l.company || "—"}</td>
                <td className="align-top p-2 border-b max-w-[520px] whitespace-pre-wrap">{l.message || "—"}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">Nenhum lead encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
