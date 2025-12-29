export default function MovieLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-[60vh] bg-gray-300 dark:bg-gray-700">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-gray-900 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex gap-8">
            <div className="w-48 h-72 bg-gray-400 dark:bg-gray-600 rounded-lg" />
            <div className="flex-1 space-y-4 py-4">
              <div className="h-8 bg-gray-400 dark:bg-gray-600 rounded w-1/2" />
              <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-1/4" />
              <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  )
}
