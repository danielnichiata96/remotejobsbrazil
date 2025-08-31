export function TagChip({ label }: { label: string }) {
  return (
    <span className="text-xs uppercase tracking-wider bg-brand-50 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 px-2 py-1 rounded-full">
      {label}
    </span>
  );
}
