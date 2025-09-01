"use client";
import { useState } from "react";

export default function EmployersForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "submitting">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      company: String(fd.get("company") || ""),
      message: String(fd.get("message") || ""),
    };
    try {
      setErrorMsg("");
      setStatus("submitting");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        try {
          const data = JSON.parse(text);
          setErrorMsg(typeof data.error === "string" ? data.error : "Error sending message");
        } catch {
          setErrorMsg("Error sending message");
        }
        setStatus("error");
        return;
      }
      (e.currentTarget as HTMLFormElement).reset();
      setStatus("ok");
    } catch {
      setStatus("error");
      setErrorMsg("Could not send message. Check your connection and try again.");
    }
  }

  return (
  <form onSubmit={onSubmit} className="mt-6 space-y-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
      <div className="grid gap-1">
    <label htmlFor="name" className="text-sm font-medium text-[var(--color-foreground)]">Your Name</label>
    <input id="name" name="name" className="border border-[var(--color-border)] rounded-md px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
    <label htmlFor="email" className="text-sm font-medium text-[var(--color-foreground)]">E-mail (required)</label>
    <input id="email" name="email" type="email" required className="border border-[var(--color-border)] rounded-md px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
    <label htmlFor="company" className="text-sm font-medium text-[var(--color-foreground)]">Company</label>
    <input id="company" name="company" className="border border-[var(--color-border)] rounded-md px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
    <label htmlFor="message" className="text-sm font-medium text-[var(--color-foreground)]">Description of need</label>
    <textarea id="message" name="message" rows={5} className="border border-[var(--color-border)] rounded-md px-3 py-2 bg-transparent" placeholder="Stack, level, deadlines, budget..." />
      </div>
  <button type="submit" disabled={status === "submitting"} className="w-full bg-[var(--color-accent)] hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed text-[var(--color-accent-foreground)] font-medium py-2.5 rounded-md">
        Request publication/partnership
      </button>
  {status === "ok" && <p className="text-green-600 text-sm">Received! We will be in touch.</p>}
  {status === "error" && <p className="text-red-600 text-sm">{errorMsg || "Error sending. Please try again."}</p>}
    </form>
  );
}
