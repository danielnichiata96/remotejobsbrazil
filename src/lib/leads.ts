import { promises as fs } from "fs";
import path from "path";

export type Lead = {
  id: string;
  name?: string | null;
  email: string;
  company?: string | null;
  message?: string | null;
  createdAt: string; // ISO
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "leads.json");

export async function writeLead(input: Omit<Lead, "id" | "createdAt"> & { email: string }): Promise<{ ok: boolean; error?: string }> {
  const lead: Lead = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    ...input,
  };
  try {
    await fs.mkdir(dataDir, { recursive: true });
    let arr: Lead[] = [];
    try {
      const raw = await fs.readFile(dataFile, "utf-8");
      arr = JSON.parse(raw) as Lead[];
    } catch {
      arr = [];
    }
    arr.unshift(lead);
    await fs.writeFile(dataFile, JSON.stringify(arr, null, 2) + "\n", "utf-8");
    return { ok: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown FS error";
    return { ok: false, error: message };
  }
}
