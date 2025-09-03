import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";

// Mock Link for server render
vi.mock("next/link", () => ({
  default: (props: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href: props.href }, props.children),
}));

// Mock SidebarFilters to bypass next/navigation hooks in server render
vi.mock("@/components/SidebarFilters", () => ({
  default: () => null,
}));

const seed = [
  { id: "1", title: "Full React", company: "A", applyUrl: "#", createdAt: new Date().toISOString(), slug: "full-react-1", status: "approved", type: "full-time", tags: ["front-end"] },
  { id: "2", title: "Part Node", company: "B", applyUrl: "#", createdAt: new Date().toISOString(), slug: "part-node-2", status: "approved", type: "part-time", tags: ["back-end"] },
  { id: "3", title: "Design Lead", company: "C", applyUrl: "#", createdAt: new Date().toISOString(), slug: "design-lead-3", status: "featured", type: "full-time", tags: ["design"] },
  { id: "4", title: "Pending Should Not Show", company: "D", applyUrl: "#", createdAt: new Date().toISOString(), slug: "pending-4", status: "pending", type: "full-time", tags: ["front-end"] },
  { id: "5", title: "Salary 12000 BRL", company: "E", applyUrl: "#", createdAt: new Date().toISOString(), slug: "salary-5", status: "approved", type: "full-time", salary: "R$ 12.000", tags: ["back-end"] },
];

vi.mock("@/lib/cache", () => ({
  readJobsLightCached: vi.fn(async () => seed as any),
}));

const loadPage = () => import("@/app/page");

describe("homepage server-side filters", () => {
  it("filters by type=full-time", async () => {
    const mod = await loadPage();
    const Page = mod.default as (props?: any) => Promise<React.ReactElement>;
    const html = renderToString(await Page({ searchParams: Promise.resolve({ type: "full-time" }) }));
    expect(html).toContain("Full React");
    expect(html).toContain("Design Lead");
    expect(html).toContain("Salary 12000 BRL");
    expect(html).not.toContain("Part Node");
    expect(html).not.toContain("Pending Should Not Show");
  });

  it("filters by tags=design,front-end (AND)", async () => {
    const mod = await loadPage();
    const Page = mod.default as (props?: any) => Promise<React.ReactElement>;
    const html = renderToString(await Page({ searchParams: Promise.resolve({ tags: "design,front-end" }) }));
    // No job has both tags
    expect(html).not.toContain("Design Lead");
    expect(html).not.toContain("Full React");
    expect(html).toContain("Latest jobs");
  });

  it("filters by salary range 10000+", async () => {
    const mod = await loadPage();
    const Page = mod.default as (props?: any) => Promise<React.ReactElement>;
    const html = renderToString(await Page({ searchParams: Promise.resolve({ salary: "10000+" }) }));
    expect(html).toContain("Salary 12000 BRL");
    expect(html).not.toContain("Full React");
    expect(html).not.toContain("Part Node");
  });
});
