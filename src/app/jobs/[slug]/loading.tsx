export default function JobLoading() {
  return (
    <div className="px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse">
        <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-11/12 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-10/12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="mt-6 h-9 w-44 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
