export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Page title skeleton */}
        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse" />
        
        {/* Navigation/Menu skeleton */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Admin menu items */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-4 w-24 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats/Dashboard skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          ))}
        </div>
        
        {/* Content area skeleton */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded">
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
