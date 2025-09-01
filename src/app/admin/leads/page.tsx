import { cookies } from "next/headers";
import Link from "next/link";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, Tbody, Td, Th, Thead, Trow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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
        <Card>
          <CardHeader>
            <p className="text-red-600 text-sm">Erro ao carregar: {error}</p>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">Verifique as variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE no ambiente.</p>
            <Button variant="secondary" size="sm" onClick={() => {}}>
              <a href="/admin/leads">Tentar novamente</a>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Últimos Leads</p>
            <Badge>{data.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="border border-gray-200 dark:border-gray-700">
            <Thead>
              <Trow>
                <Th>Data</Th>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Empresa</Th>
                <Th>Mensagem</Th>
              </Trow>
            </Thead>
            <Tbody>
              {data.map((l) => (
                <Trow key={l.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                  <Td className="whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</Td>
                  <Td>{l.name || "—"}</Td>
                  <Td>{l.email}</Td>
                  <Td>{l.company || "—"}</Td>
                  <Td className="max-w-[520px] whitespace-pre-wrap">{l.message || "—"}</Td>
                </Trow>
              ))}
              {data.length === 0 && !error && (
                <Trow>
                  <Td colSpan={5} className="p-4 text-center text-gray-500">Nenhum lead encontrado.</Td>
                </Trow>
              )}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
