import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";

vi.mock("next/link", () => ({
  default: (props: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href: props.href }, props.children),
}));

const sampleJobs = [
  {
    id: "id-1",
    title: "Frontend Engineer",
    company: "Tech Samba",
    location: "Brazil (Remote)",
    type: "Full-time",
    salary: "R$ 18k–25k/mês",
    applyUrl: "https://example.com/apply/frontend",
    description: "Build UIs",
    createdAt: new Date().toISOString(),
    slug: "frontend-engineer-tech-samba-seed-1",
    tags: ["react"],
  },
];

vi.mock("@/lib/jobs", async (og) => {
  const mod = await og<typeof import("@/lib/jobs")>();
  return {
    ...mod,
    readJobs: vi.fn(async () => []),
    getSlug: (j: { slug?: string }) => j.slug ?? "slug",
  };
});

const loadPage = () => import("@/app/page");

describe("homepage", () => {
  it("renderiza estado vazio", async () => {
    const mod = await loadPage();
    const Page = mod.default as () => Promise<React.ReactElement>;
    const html = renderToString(await Page());
    expect(html).toContain("Nenhuma vaga");
  });

  it("lista vagas quando presentes", async () => {
    const jobsMod = await import("@/lib/jobs");
    (jobsMod.readJobs as unknown as { mockResolvedValueOnce: (v: unknown) => void }).mockResolvedValueOnce(
      sampleJobs
    );
    const mod = await loadPage();
    const Page = mod.default as () => Promise<React.ReactElement>;
    const html = renderToString(await Page());
    expect(html).toContain(sampleJobs[0].title);
    expect(html).toContain(`/jobs/${sampleJobs[0].slug}`);
  });
});
