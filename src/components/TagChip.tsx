export function TagChip({ label }: { label: string }) {
  return (
    <span className="text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
      {label}
    </span>
  );
}
