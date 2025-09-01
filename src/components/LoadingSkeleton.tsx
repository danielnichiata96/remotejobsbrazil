export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="rounded-md p-4 bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="h-4 rounded w-3/4 mb-2 bg-[var(--color-muted)] animate-pulse" />
          <div className="h-3 rounded w-1/2 bg-[var(--color-muted)] animate-pulse" />
        </li>
      ))}
    </ul>
  );
}
