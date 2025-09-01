export default function EmployersLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Hero section skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto animate-pulse" />
          <div className="h-6 w-[32rem] bg-gray-200 dark:bg-gray-700 rounded mb-2 mx-auto animate-pulse" />
          <div className="h-4 w-80 bg-gray-100 dark:bg-gray-600 rounded mx-auto animate-pulse" />
        </div>
        
        {/* Features/Benefits section skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
              <div className="h-12 w-12 bg-green-200 dark:bg-green-800 rounded-full mx-auto mb-4 animate-pulse" />
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3 mx-auto animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-600 rounded mx-auto animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Contact form skeleton */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 dark:bg-gray-600 rounded mb-8 animate-pulse" />
          
          <div className="space-y-6">
            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-12 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-12 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
            
            <div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-12 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            
            <div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-32 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            
            {/* Submit button */}
            <div className="h-12 w-40 bg-green-200 dark:bg-green-800 rounded animate-pulse" />
          </div>
        </div>
        
        {/* FAQ/Info section skeleton */}
        <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-green-200 dark:bg-green-800 rounded-full flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-full bg-gray-100 dark:bg-gray-600 rounded mb-1 animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
