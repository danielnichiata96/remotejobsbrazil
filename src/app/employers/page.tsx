import type { Metadata } from "next";
import EmployersForm from "@/components/EmployersForm";

export const metadata: Metadata = {
  title: "For Employers | Remote Jobs Brazil",
  description: "Post remote jobs and hire Brazilian talent. Response within 24h.",
  alternates: { canonical: "/employers" },
  openGraph: {
    title: "Hire Remote Brazilian Talent",
    description: "Post jobs and reach qualified Brazilian developers.",
    type: "website",
    url: "/employers",
  },
};

export default function EmployersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">For Employers</h1>
        <p className="text-sm text-foreground/70 mt-2">
          Hire remote Brazilian talent. Fast posting, curation, and distribution.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-sm font-medium">Curation</p>
            <p className="text-xs text-foreground/70">Manual review and highlighting.</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-sm font-medium">Distribution</p>
            <p className="text-xs text-foreground/70">Communities and social networks.</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-sm font-medium">Speed</p>
            <p className="text-xs text-foreground/70">Response within 24h.</p>
          </div>
        </div>

  <EmployersForm />
      </div>
  </div>
  );
}
 
