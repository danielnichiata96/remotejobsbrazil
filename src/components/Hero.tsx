import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate w-full overflow-hidden">
    {/* soft background gradient with Brazil theme */}
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_20%_20%,#009b3a1a_0%,transparent_50%),radial-gradient(60%_50%_at_80%_10%,#0027761a_0%,transparent_50%),linear-gradient(to_bottom,var(--color-background),#f8fafc)]" />
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24 lg:py-28">
        <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--color-foreground)]">
            Junte-se às melhores empresas da indústria
          </h1>
      <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-[var(--color-foreground)]/70">
            Explore centenas de oportunidades remotas e encontre a vaga perfeita para você. Curadoria leve, foco em qualidade.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#jobs"
        className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-5 py-2.5 text-sm font-medium shadow-sm hover:brightness-95"
            >
              Ver vagas
            </Link>
            <Link
              href="/post"
        className="inline-flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--color-muted)]"
            >
              Postar uma vaga
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
