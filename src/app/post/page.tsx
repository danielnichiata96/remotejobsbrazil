"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; jobId: string }
  | { status: "error"; message: string };

export default function PostJobPage() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const alertRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (state.status === "error" || state.status === "success") {
      alertRef.current?.focus();
    }
  }, [state]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Postar Vaga</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Compartilhe uma oportunidade 100% remota para candidatos no Brasil.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6" aria-describedby="form-status" aria-live="polite">
          <div className="grid gap-1">
            <label htmlFor="title" className="text-sm font-medium">Título da vaga *</label>
            <input id="title" name="title" required className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Senior React Developer" />
          </div>

          <div className="grid gap-1">
            <label htmlFor="company" className="text-sm font-medium">Empresa *</label>
            <input id="company" name="company" required className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Acme Ltd" />
          </div>

          <div className="grid gap-1">
            <label htmlFor="applyUrl" className="text-sm font-medium">URL para aplicar *</label>
            <input id="applyUrl" name="applyUrl" type="url" required className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1">
              <label htmlFor="location" className="text-sm font-medium">Local</label>
              <input id="location" name="location" className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Brazil (Remote)" />
            </div>
            <div className="grid gap-1">
              <label htmlFor="type" className="text-sm font-medium">Tipo</label>
              <input id="type" name="type" className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full-time" />
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="salary" className="text-sm font-medium">Salário</label>
            <input id="salary" name="salary" className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="R$ ..." />
          </div>

          <div className="grid gap-1">
            <label htmlFor="description" className="text-sm font-medium">Descrição</label>
            <textarea id="description" name="description" rows={6} className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Responsabilidades, requisitos, benefícios..." />
          </div>

          <div className="grid gap-1">
            <label htmlFor="tags" className="text-sm font-medium">Tags (separadas por vírgula)</label>
            <input id="tags" name="tags" className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="react, node, aws" />
          </div>

          <button
            type="submit"
            disabled={state.status === "submitting"}
            className="inline-flex items-center justify-center rounded-md bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
          >
            {state.status === "submitting" ? "Publicando…" : "Publicar vaga"}
          </button>

          {state.status === "error" && (
            <p id="form-status" ref={alertRef} tabIndex={-1} role="alert" className="text-sm text-red-600">
              {state.message}
            </p>
          )}
          {state.status === "success" && (
            <p id="form-status" ref={alertRef} tabIndex={-1} role="status" className="text-sm text-green-600">
              Vaga criada! <Link className="underline" href="/">Voltar para vagas</Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
