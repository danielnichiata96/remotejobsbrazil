export default function ImportLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Page title skeleton */}
        <div className="h-8 w-56 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Import form */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              {/* Section title */}
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
              
              {/* Textarea */}
              <div className="h-64 w-full bg-gray-100 dark:bg-gray-700 rounded mb-4 animate-pulse" />
              
              {/* Import button */}
              <div className="h-12 w-36 bg-blue-200 dark:bg-blue-800 rounded animate-pulse" />
            </div>
            
            {/* Format info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Right column - Examples */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
              
              {/* Code block skeleton */}
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded border">
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                  <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Tips section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
              <div className="space-y-3">
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
