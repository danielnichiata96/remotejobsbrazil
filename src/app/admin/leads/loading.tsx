export default function AdminLeadsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        
        {/* Page title skeleton */}
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse" />
        
        {/* Stats bar skeleton */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-16 bg-blue-200 dark:bg-blue-800 rounded animate-pulse" />
            </div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        
        {/* Table skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table header */}
          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-5 gap-4">
              <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          </div>
          
          {/* Table rows */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div>
                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-600 rounded mb-1 animate-pulse" />
                    <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-20 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination skeleton */}
        <div className="mt-6 flex justify-between items-center">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
