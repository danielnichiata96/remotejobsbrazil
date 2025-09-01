export default function PostLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Page title skeleton */}
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse" />
        
        {/* Form skeleton */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            {/* Title field */}
            <div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            
            {/* Company field */}
            <div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            
            {/* Apply URL field */}
            <div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            
            {/* Optional fields row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
            
            <div>
              <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            
            {/* Description field */}
            <div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-32 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            
            {/* Submit button */}
            <div className="h-12 w-32 bg-green-200 dark:bg-green-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
