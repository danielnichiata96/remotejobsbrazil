import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";
import Link from "next/link";
import { readJobs } from "@/lib/jobs";
import AdminDashboard from "@/components/AdminDashboard";

async function isAuthed() {
  const c = await cookies();
  const token = c.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

export default async function AdminPage() {
  const authed = await isAuthed();
  
  if (!authed) {
    return (
      <div className="min-h-screen px-6 py-10 max-w-md mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <Link href="/" className="underline text-sm">Back</Link>
        </header>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form action="/api/admin/login" method="POST" className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Admin Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded py-2 px-4 hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const jobs = await readJobs();
  return <AdminDashboard initialJobs={jobs} />;
}
