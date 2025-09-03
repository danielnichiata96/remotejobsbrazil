import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { JobListItem } from "@/components/JobListItem";

vi.mock("next/link", () => ({
  default: (props: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href: props.href }, props.children),
}));

const job: any = {
  id: "j1",
  title: "Senior React Dev",
  company: "Acme",
  location: "Remote",
  type: "Full-time",
  applyUrl: "#",
  createdAt: new Date().toISOString(),
  slug: "senior-react-dev",
  status: "approved",
};

describe("bookmark button render", () => {
  it("renders star icon in list item", () => {
    const html = renderToString(React.createElement(JobListItem as any, { job }));
    expect(html).toContain("★");
  });
});
