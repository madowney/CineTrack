'use client'

import { useLists, useListItems } from '@/hooks/useLists'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function WatchedListPage() {
  const { user } = useAuth()
  const { getListByType, isLoading: listsLoading } = useLists()

  const watchedList = getListByType('watched')
  const { items, isLoading: itemsLoading } = useListItems(watchedList?.id || null)

  const isLoading = listsLoading || itemsLoading

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Please sign in to view your watched movies.
        </p>
        <Link
          href="/login?redirectTo=/lists/watched"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Sign In
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✓</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Watched Movies Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Start tracking the movies you&apos;ve watched by adding them to this list.
        </p>
        <Link
          href="/browse"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Browse Movies
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {items.length} movie{items.length !== 1 ? 's' : ''} watched
        </p>
        <div className="flex items-center gap-2">
          {/* Sort/filter controls can be added here */}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          >
            <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">Movie #{item.tmdb_movie_id}</span>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                TMDB ID: {item.tmdb_movie_id}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Added {new Date(item.added_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
