export function TagChip({ label }: { label: string }) {
  return (
  <span className="text-[10px] uppercase tracking-wider bg-[var(--color-muted)] text-[var(--color-accent)] px-2 py-1 rounded-full">
      {label}
    </span>
  );
}
