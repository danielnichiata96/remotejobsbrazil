"use client";

import { useState } from "react";
import Link from "next/link";

function parseInput(text: string): unknown {
  // Accept JSON array or NDJSON (one JSON per line)
  const trimmed = text.trim();
  if (trimmed.startsWith("[")) {
    return JSON.parse(trimmed);
  }
  const lines = trimmed
    .split(/\r?\n/) 
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.map((l) => JSON.parse(l));
}

export default function ImportPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onImport() {
    setBusy(true);
    setResult(null);
    try {
      const parsed = parseInput(input);
      if (!Array.isArray(parsed)) throw new Error("Expected an array of jobs");
      const res = await fetch("/api/jobs/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobs: parsed }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed");
      setResult(
        `Imported ${json.created?.length ?? 0} jobs` +
          (json.errors?.length ? `, ${json.errors.length} errors` : "") +
          (json.warning ? ` (warning: ${json.warning})` : "")
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setResult(`Error: ${msg}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Import Jobs</h1>
        <Link className="underline text-sm" href="/">Back</Link>
      </header>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
        Paste a JSON array of jobs or NDJSON (one JSON per line) with fields: title, company, applyUrl, and optional location, type, salary, description.
      </p>

      <textarea
        className="w-full border rounded-md p-3 bg-transparent min-h-64"
        placeholder='[{"title":"...","company":"...","applyUrl":"https://..."}] or one per line'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={onImport}
          disabled={busy}
          className="inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Importing…" : "Import"}
        </button>
        {result && <span className="text-sm">{result}</span>}
      </div>

      <details className="mt-6 text-sm">
        <summary className="cursor-pointer">Example (NDJSON)</summary>
        <pre className="mt-2 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-md overflow-auto text-xs">
          <code>{`{"title":"Frontend Engineer","company":"Acme","applyUrl":"https://acme.com/apply","location":"Brazil (Remote)","type":"Full-time","salary":"R$ 15k–20k"}
{"title":"Backend Dev","company":"Beta","applyUrl":"https://beta.com/jobs/1"}`}</code>
        </pre>
      </details>
    </div>
  );
}
