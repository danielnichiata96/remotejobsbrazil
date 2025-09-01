import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";
import Link from "next/link";

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
    <form
      action="/api/admin/login"
      method="post"
      className="border rounded-lg p-4 space-y-3"
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Enter the admin key to access the dashboard.
      </p>
      <input
        name="key"
        type="password"
        required
        className="border rounded-md px-3 py-2 bg-transparent w-full"
        placeholder="Admin key"
      />
      <button className="inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium">
        Login
      </button>
    </form>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <form action="/api/admin/logout" method="post">
        <button className="underline text-sm" type="submit">Logout</button>
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
    <form
      className="space-y-3 border rounded-lg p-4"
      action="/api/jobs"
      method="post"
    >
      <div className="grid gap-1">
        <label className="text-sm font-medium">Title *</label>
        <input name="title" required className="border rounded-md px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Company *</label>
        <input name="company" required className="border rounded-md px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Apply URL *</label>
        <input name="applyUrl" type="url" required className="border rounded-md px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1 sm:grid-cols-2">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Location</label>
          <input name="location" className="border rounded-md px-3 py-2 bg-transparent" placeholder="Brazil (Remote)" />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Type</label>
          <input name="type" className="border rounded-md px-3 py-2 bg-transparent" placeholder="Full-time" />
        </div>
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Salary</label>
        <input name="salary" className="border rounded-md px-3 py-2 bg-transparent" placeholder="R$ ..." />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Description</label>
        <textarea name="description" rows={6} className="border rounded-md px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Tags (comma-separated)</label>
        <input name="tags" className="border rounded-md px-3 py-2 bg-transparent" placeholder="react, node, aws" />
      </div>
      <button className="inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium">
        Create
      </button>
      <p className="text-xs text-zinc-500">After submit, go to the homepage to see it.</p>
    </form>
  );
}
