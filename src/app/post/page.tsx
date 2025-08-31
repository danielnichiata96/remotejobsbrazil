"use client";

import { useState } from "react";
import Link from "next/link";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; jobId: string }
  | { status: "error"; message: string };

export default function PostJobPage() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          company: data.company,
          location: data.location || "Brazil (Remote)",
          type: data.type || "Full-time",
          salary: data.salary || undefined,
          applyUrl: data.applyUrl,
          description: data.description || undefined,
          tags: data.tags || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create job");
      setState({ status: "success", jobId: json.job.id });
      form.reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState({ status: "error", message });
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Post a Job</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Share a remote opportunity for candidates in Brazil.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-1">
          <label htmlFor="title" className="text-sm font-medium">Job title *</label>
          <input id="title" name="title" required className="border rounded-md px-3 py-2 bg-transparent" placeholder="e.g., Senior React Developer" />
        </div>

        <div className="grid gap-1">
          <label htmlFor="company" className="text-sm font-medium">Company *</label>
          <input id="company" name="company" required className="border rounded-md px-3 py-2 bg-transparent" placeholder="e.g., Acme Ltd" />
        </div>

        <div className="grid gap-1">
          <label htmlFor="applyUrl" className="text-sm font-medium">Apply URL *</label>
          <input id="applyUrl" name="applyUrl" type="url" required className="border rounded-md px-3 py-2 bg-transparent" placeholder="https://..." />
        </div>

        <div className="grid gap-1 sm:grid-cols-2">
          <div className="grid gap-1">
            <label htmlFor="location" className="text-sm font-medium">Location</label>
            <input id="location" name="location" className="border rounded-md px-3 py-2 bg-transparent" placeholder="Brazil (Remote)" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="type" className="text-sm font-medium">Type</label>
            <input id="type" name="type" className="border rounded-md px-3 py-2 bg-transparent" placeholder="Full-time" />
          </div>
        </div>

        <div className="grid gap-1">
          <label htmlFor="salary" className="text-sm font-medium">Salary</label>
          <input id="salary" name="salary" className="border rounded-md px-3 py-2 bg-transparent" placeholder="R$ ..." />
        </div>

        <div className="grid gap-1">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea id="description" name="description" rows={6} className="border rounded-md px-3 py-2 bg-transparent" placeholder="Key responsibilities, requirements, benefits..." />
        </div>

        <div className="grid gap-1">
          <label htmlFor="tags" className="text-sm font-medium">Tags (comma-separated)</label>
          <input id="tags" name="tags" className="border rounded-md px-3 py-2 bg-transparent" placeholder="react, node, aws" />
        </div>

        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {state.status === "submitting" ? "Posting…" : "Post job"}
        </button>

        {state.status === "error" && (
          <p className="text-sm text-red-600">{state.message}</p>
        )}
        {state.status === "success" && (
          <p className="text-sm text-green-600">Job created! <Link className="underline" href="/">Back to jobs</Link></p>
        )}
      </form>
    </div>
  );
}
