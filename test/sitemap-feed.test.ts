import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/jobs", async () => {
  return {
    readJobs: vi.fn(async () => [
      { id: '1', title: 'React Dev', company: 'Acme', applyUrl: 'https://acme.test', createdAt: '2024-01-01T00:00:00.000Z', source: 'manual', status: 'approved', tags: ['react'] },
      { id: '2', title: 'Node Eng', company: 'Beta', applyUrl: 'https://beta.test', createdAt: '2024-01-02T00:00:00.000Z', source: 'manual', status: 'approved', tags: ['node'] },
    ] as any),
    getSlug: (j: any) => `${j.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${j.company.toLowerCase()}`,
  } as any;
});

describe("discovery endpoints", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sitemap returns entries for jobs and static pages", async () => {
    const mod = await import("@/app/sitemap");
    const items = await mod.default();
    const urls = items.map((i: any) => i.url);
    expect(urls).toContain("http://localhost:3000/");
    expect(urls.some((u: string) => /\/jobs\//.test(u))).toBe(true);
  });

  it("global feed renders RSS XML", async () => {
    const mod = await import("@/app/feed.xml/route");
    const res = await mod.GET();
    const text = await (res as Response).text();
    expect(text).toMatch(/<rss/);
    expect(text).toMatch(/<item>/);
  });

  it("category feed filters by tag", async () => {
    const mod = await import("@/app/feed/[category].xml/route");
    const res = await mod.GET(new Request("http://localhost/feed/react.xml"), { params: Promise.resolve({ category: "react" }) } as any);
    const text = await (res as Response).text();
    // Should include React job
    expect(text).toMatch(/React Dev/);
  });
});
