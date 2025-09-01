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
          setErrorMsg(typeof data.error === "string" ? data.error : "Erro ao enviar");
        } catch {
          setErrorMsg("Erro ao enviar");
        }
        setStatus("error");
        return;
      }
      (e.currentTarget as HTMLFormElement).reset();
      setStatus("ok");
    } catch {
      setStatus("error");
      setErrorMsg("Não foi possível enviar. Verifique sua conexão e tente novamente.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="grid gap-1">
        <label htmlFor="name" className="text-sm font-medium">Seu nome</label>
        <input id="name" name="name" className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
        <label htmlFor="email" className="text-sm font-medium">E-mail (obrigatório)</label>
        <input id="email" name="email" type="email" required className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
        <label htmlFor="company" className="text-sm font-medium">Empresa</label>
        <input id="company" name="company" className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent" />
      </div>
      <div className="grid gap-1">
        <label htmlFor="message" className="text-sm font-medium">Descrição da necessidade</label>
        <textarea id="message" name="message" rows={5} className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent" placeholder="Stack, nível, prazos, orçamento..." />
      </div>
  <button type="submit" disabled={status === "submitting"} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-md">
        Solicitar publicação/parceria
      </button>
  {status === "ok" && <p className="text-green-600 text-sm">Recebido! Entraremos em contato.</p>}
  {status === "error" && <p className="text-red-600 text-sm">{errorMsg || "Erro ao enviar. Tente novamente."}</p>}
    </form>
  );
}
