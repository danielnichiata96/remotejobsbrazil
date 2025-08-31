export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </li>
      ))}
    </ul>
  );
}
