'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { MovieGrid, QuickAddModal, getGenreIdFromSlug, getGenreNameFromSlug } from '@/components/browse'
import { useBrowse } from '@/hooks/useBrowse'
import type { AppMoviePreview } from '@/lib/tmdb'
import { useAuth } from '@/context/AuthContext'

export default function GenreMoviesPage() {
  const params = useParams()
  const slug = params.slug as string
  const { user } = useAuth()

  const genreId = getGenreIdFromSlug(slug)
  const genreName = getGenreNameFromSlug(slug)

  const browseParams = useMemo(
    () => (genreId ? { genreId } : {}),
    [genreId]
  )

  const { movies, isLoading, hasMore, loadMore, error } = useBrowse({
    endpoint: '/api/tmdb/browse/discover',
    params: browseParams,
  })

  const [quickAddMovie, setQuickAddMovie] = useState<AppMoviePreview | null>(null)

  const handleQuickAdd = (movie: AppMoviePreview) => {
    if (!user) {
      window.location.href = `/login?redirectTo=/browse/genres/${slug}`
      return
    }
    setQuickAddMovie(movie)
  }

  const handleAddToList = async (movie: AppMoviePreview, listId: string, rating?: number) => {
    // TODO: Implement add to list functionality
    console.log('Add to list:', { movie, listId, rating })
  }

  if (!genreId) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Genre Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          We couldn&apos;t find the genre &quot;{genreName}&quot;.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {genreName} Movies
      </h2>

      <MovieGrid
        movies={movies}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        onQuickAdd={handleQuickAdd}
      />

      <QuickAddModal
        movie={quickAddMovie}
        isOpen={!!quickAddMovie}
        onClose={() => setQuickAddMovie(null)}
        onAdd={handleAddToList}
      />
    </div>
  )
}
