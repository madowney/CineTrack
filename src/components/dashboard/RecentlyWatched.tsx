'use client'

import Link from 'next/link'
import type { Movie } from '@/types/database'
import { DisplayRating } from '@/components/ui/StarRating'

interface RecentlyWatchedProps {
  movies: Movie[]
  isLoading?: boolean
}

export function RecentlyWatched({ movies, isLoading }: RecentlyWatchedProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recently Watched
        </h3>
        <Link
          href="/lists/watched"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
        >
          View all &rarr;
        </Link>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎬</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No movies watched yet
          </p>
          <Link
            href="/browse"
            className="mt-2 inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            Discover movies &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {movies.slice(0, 5).map((movie) => (
            <div key={movie.id} className="flex items-center gap-3">
              <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200 dark:bg-gray-700">
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {movie.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  {movie.year && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {movie.year}
                    </span>
                  )}
                  {movie.rating && (
                    <DisplayRating rating={movie.rating * 2} size="sm" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
