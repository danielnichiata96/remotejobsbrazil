"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Props = {
  total: number;
  page: number;
  perPage: number;
};

export default function Pagination({ total, page, perPage }: Props) {
  const sp = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  const mkHref = (p: number) => {
    const params = new URLSearchParams(sp?.toString());
    if (p > 1) params.set("page", String(p));
    if (perPage !== 20) params.set("perPage", String(perPage));
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  const neighbors = 1;
  const pages: number[] = [];
  for (let i = Math.max(1, page - neighbors); i <= Math.min(totalPages, page + neighbors); i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-between" aria-label="pagination">
      <Link
        href={mkHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`px-3 py-1.5 rounded-md border border-[var(--color-border)] ${page === 1 ? "opacity-50 pointer-events-none" : "hover:bg-[var(--color-muted)]"}`}
      >
        Previous
      </Link>
      <ul className="flex items-center gap-2">
        {page - neighbors > 1 && (
          <li>
            <Link href={mkHref(1)} className="px-3 py-1.5 rounded-md border border-[var(--color-border)] hover:bg-[var(--color-muted)]">1</Link>
          </li>
        )}
        {page - neighbors > 2 && <li className="px-1.5 text-[var(--color-foreground)]/60">…</li>}
        {pages.map((p) => (
          <li key={p}>
            {p === page ? (
              <span className="px-3 py-1.5 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">{p}</span>
            ) : (
              <Link href={mkHref(p)} className="px-3 py-1.5 rounded-md border border-[var(--color-border)] hover:bg-[var(--color-muted)]">{p}</Link>
            )}
          </li>
        ))}
        {page + neighbors < totalPages - 1 && <li className="px-1.5 text-[var(--color-foreground)]/60">…</li>}
        {page + neighbors < totalPages && (
          <li>
            <Link href={mkHref(totalPages)} className="px-3 py-1.5 rounded-md border border-[var(--color-border)] hover:bg-[var(--color-muted)]">{totalPages}</Link>
          </li>
        )}
      </ul>
      <Link
        href={mkHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={`px-3 py-1.5 rounded-md border border-[var(--color-border)] ${page === totalPages ? "opacity-50 pointer-events-none" : "hover:bg-[var(--color-muted)]"}`}
      >
        Next
      </Link>
    </nav>
  );
}
