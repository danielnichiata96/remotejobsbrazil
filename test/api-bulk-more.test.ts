import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "@/app/api/jobs/bulk/route";

// Stub admin cookie verification
vi.mock("@/lib/auth", () => ({
  isAdmin: () => true,
}));

// Mock Supabase to simulate missing column errors
const mockSb = {
  from: vi.fn(() => ({
    update: vi.fn(() => ({
      eq: vi.fn(async () => ({ error: { code: 'PGRST204', message: "Could not find the 'curated_description' column" } })),
      in: vi.fn(async () => ({ error: { code: 'PGRST204', message: "Could not find the 'status' column" } })),
    })),
    upsert: vi.fn(async () => ({ error: undefined })),
  })),
};

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => mockSb,
}));

// Mock read/write file persistence
const mem: any[] = [
  { id: '1', title: 'A', company: 'C', applyUrl: 'https://x', createdAt: new Date().toISOString(), status: 'pending' },
];

vi.mock("@/lib/jobs", async () => {
  const actual: any = await vi.importActual("@/lib/jobs");
  return {
    ...actual,
    readJobs: vi.fn(async () => mem as any),
    writeJobsFile: vi.fn(async (jobs: any[]) => { mem.length = 0; mem.push(...jobs); return { ok: true }; }),
    writeJobs: vi.fn(async (jobs: any[]) => { mem.length = 0; mem.push(...jobs); return { ok: true }; }),
  } as any;
});

function makeReq(body: any, cookie = "rjb_admin=dummy") {
  return new Request("http://localhost/api/jobs/bulk", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cookie": cookie,
    },
    body: JSON.stringify(body),
  });
}

describe("bulk API extra", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("update_status falls back to file and returns 200", async () => {
    const res = await POST(makeReq({ action: 'update_status', jobIds: ['1'], status: 'approved' }) as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(mem[0].status).toBe('approved');
  });

  it("update_curated falls back to file and returns 200", async () => {
    // Make curated update trigger missing column path by making .update().eq return error; already mocked above
    const res = await POST(makeReq({ action: 'update_curated', jobId: '1', curatedDescription: 'Resumo' }) as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(mem[0].curatedDescription).toBe('Resumo');
  });
});
