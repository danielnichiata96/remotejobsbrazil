import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";

vi.mock("next/link", () => ({
  default: (props: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href: props.href }, props.children),
}));

// Mock SidebarFilters to bypass next/navigation hooks in server render
vi.mock("@/components/SidebarFilters", () => ({
  default: () => null,
}));

const seed = [
  { id: "1", title: "Approved FE", company: "A", applyUrl: "#", createdAt: new Date().toISOString(), slug: "approved-a-1", status: "approved" },
  { id: "2", title: "Pending BE", company: "B", applyUrl: "#", createdAt: new Date().toISOString(), slug: "pending-b-2", status: "pending" },
  { id: "3", title: "Featured PM", company: "C", applyUrl: "#", createdAt: new Date().toISOString(), slug: "featured-c-3", status: "featured" },
  { id: "4", title: "Rejected QA", company: "D", applyUrl: "#", createdAt: new Date().toISOString(), slug: "rejected-d-4", status: "rejected" },
];

vi.mock("@/lib/jobs", async (og) => {
  const mod = await og<typeof import("@/lib/jobs")>();
  return {
    ...mod,
    readJobs: vi.fn(async () => seed as any),
    getSlug: (j: { slug?: string }) => j.slug ?? "slug",
  };
});

const loadPage = () => import("@/app/page");

describe("homepage status filter", () => {
  it("includes only approved and featured jobs", async () => {
    const mod = await loadPage();
    const Page = mod.default as () => Promise<React.ReactElement>;
    const html = renderToString(await Page());
    expect(html).toContain("Approved FE");
    expect(html).toContain("Featured PM");
    expect(html).not.toContain("Pending BE");
    expect(html).not.toContain("Rejected QA");
  });
});
