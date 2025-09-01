import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate w-full overflow-hidden">
      {/* soft background gradient to echo the reference design */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_20%_20%,theme(colors.violet.100)_0%,transparent_50%),radial-gradient(60%_50%_at_80%_10%,theme(colors.sky.100)_0%,transparent_50%),linear-gradient(to_bottom,white,theme(colors.slate.50))]" />
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24 lg:py-28">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Junte-se às melhores empresas da indústria
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-slate-600">
            Explore centenas de oportunidades remotas e encontre a vaga perfeita para você. Curadoria leve, foco em qualidade.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#jobs"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-slate-700"
            >
              Ver vagas
            </Link>
            <Link
              href="/post"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-900 px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
            >
              Postar uma vaga
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
