import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";

// Fixture
const fixtureJob = {
  id: "job-123456",
  title: "Desenvolvedor React Sênior",
  company: "Tech Startup",
  location: "Brazil (Remote)",
  type: "Full-time",
  salary: "R$ 20k",
  applyUrl: "https://company.com/apply",
  description: "Trabalhe com React e Node.",
  createdAt: new Date().toISOString(),
  slug: "desenvolvedor-react-senior-tech-startup-123456",
  tags: ["react", "node"],
};

// Mocks necessários para App Router
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
vi.mock("next/link", () => ({
  default: (props: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href: props.href }, props.children),
}));

vi.mock("@/lib/jobs", async (og) => {
  const mod = await og<typeof import("@/lib/jobs")>();
  return {
    ...mod,
    readJobs: vi.fn(async () => [fixtureJob]),
    getSlug: (j: { slug?: string }) => j.slug ?? "slug",
  };
});

// Carrega o módulo após mocks
const loadPage = () => import("@/app/jobs/[slug]/page");

describe("/jobs/[slug] page", () => {
  it("renderiza título e CTA Candidatar-se", async () => {
    const mod = await loadPage();
    const Page = mod.default as (args: { params: Promise<{ slug: string }> }) => Promise<React.ReactElement>;
    const element = await Page({ params: Promise.resolve({ slug: fixtureJob.slug! }) });
    const html = renderToString(element);
    expect(html).toContain(fixtureJob.title);
    expect(html).toContain("Candidatar-se");
  });
});
