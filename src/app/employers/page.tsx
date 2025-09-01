import type { Metadata } from "next";
import EmployersForm from "@/components/EmployersForm";

export const metadata: Metadata = {
  title: "Para Empresas | Remote Jobs Brazil",
  description: "Publique vagas remotas e contrate talentos brasileiros. Resposta em 24h.",
  alternates: { canonical: "/employers" },
  openGraph: {
    title: "Contrate Talentos Brasileiros Remotos",
    description: "Publique vagas e alcance devs brasileiros qualificados.",
    type: "website",
    url: "/employers",
  },
};

export default function EmployersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Para Empresas</h1>
        <p className="text-sm text-foreground/70 mt-2">
          Contrate talentos brasileiros remotos. Publicação rápida, curadoria e distribuição.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-sm font-medium">Curadoria</p>
            <p className="text-xs text-foreground/70">Revisão manual e destaque.</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-sm font-medium">Distribuição</p>
            <p className="text-xs text-foreground/70">Comunidades e redes sociais.</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-sm font-medium">Rapidez</p>
            <p className="text-xs text-foreground/70">Resposta em até 24h.</p>
          </div>
        </div>

  <EmployersForm />
      </div>
  </div>
  );
}
 
