'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { AppMoviePreview } from '@/lib/tmdb'
import { BrowseMovieCard } from './BrowseMovieCard'

interface MovieGridProps {
  movies: AppMoviePreview[]
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  onQuickAdd?: (movie: AppMoviePreview) => void
}

export function MovieGrid({
  movies,
  onLoadMore,
  hasMore,
  isLoading,
  onQuickAdd,
}: MovieGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore()
      }
    },
    [hasMore, isLoading, onLoadMore]
  )

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: '100px',
    })

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  if (movies.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No movies found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <BrowseMovieCard
            key={movie.tmdbId}
            movie={movie}
            onQuickAdd={onQuickAdd}
          />
        ))}

        {/* Loading skeletons */}
        {isLoading &&
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            >
              <div className="aspect-[2/3]" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
              </div>
            </div>
          ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-10 mt-4" />

      {/* Loading indicator */}
      {isLoading && movies.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      )}

      {/* End of results */}
      {!hasMore && movies.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          You&apos;ve reached the end
        </div>
      )}
    </div>
  )
}
