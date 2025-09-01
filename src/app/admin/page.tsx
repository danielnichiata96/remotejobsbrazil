import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

async function isAuthed() {
  const c = await cookies();
  const token = c.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

export default async function AdminPage() {
  const authed = await isAuthed();
  return (
  <div className="min-h-screen px-6 py-10 max-w-2xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <Link href="/" className="underline text-sm">Back</Link>
      </header>

      {!authed ? <LoginCard /> : <Dashboard />}
    </div>
  );
}

function LoginCard() {
  return (
    <Card>
      <CardHeader>
  <p className="text-sm text-foreground/70">Enter the admin key to access the dashboard.</p>
      </CardHeader>
      <CardContent>
        <form action="/api/admin/login" method="post" className="space-y-3">
          <div className="grid gap-1">
            <Label htmlFor="admin-key">Admin key</Label>
            <Input id="admin-key" name="key" type="password" required placeholder="Admin key" />
          </div>
          <Button type="submit">Login</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <form action="/api/admin/logout" method="post">
        <Button type="submit" variant="ghost" className="underline px-0">Logout</Button>
      </form>

      <div>
        <a href="/admin/leads" className="underline text-sm">Ver Leads</a>
      </div>

      <h2 className="text-lg font-semibold">Add Job (manual)</h2>
      <ManualJobForm />
    </div>
  );
}

function ManualJobForm() {
  return (
    <Card>
      <CardContent>
        <form className="space-y-4" action="/api/jobs" method="post">
          <div className="grid gap-1">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="company">Company *</Label>
            <Input id="company" name="company" required />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="applyUrl">Apply URL *</Label>
            <Input id="applyUrl" name="applyUrl" type="url" required />
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            <div className="grid gap-1">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="Brazil (Remote)" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="type">Type</Label>
              <Input id="type" name="type" placeholder="Full-time" />
            </div>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="salary">Salary</Label>
            <Input id="salary" name="salary" placeholder="R$ ..." />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="description">Description</Label>
            <textarea id="description" name="description" rows={6} className="border border-[var(--color-border)] rounded-md px-3 py-2 bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" placeholder="react, node, aws" />
          </div>
          <Button type="submit">Create</Button>
          <p className="text-xs text-zinc-500">After submit, go to the homepage to see it.</p>
        </form>
      </CardContent>
    </Card>
  );
}
