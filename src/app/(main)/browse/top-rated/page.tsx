'use client'

import { useState } from 'react'
import { MovieGrid, QuickAddModal } from '@/components/browse'
import { useBrowse } from '@/hooks/useBrowse'
import type { AppMoviePreview } from '@/lib/tmdb'
import { useAuth } from '@/context/AuthContext'

export default function TopRatedMoviesPage() {
  const { user } = useAuth()
  const { movies, isLoading, hasMore, loadMore, error } = useBrowse({
    endpoint: '/api/tmdb/browse/top-rated',
  })
  const [quickAddMovie, setQuickAddMovie] = useState<AppMoviePreview | null>(null)

  const handleQuickAdd = (movie: AppMoviePreview) => {
    if (!user) {
      window.location.href = '/login?redirectTo=/browse/top-rated'
      return
    }
    setQuickAddMovie(movie)
  }

  const handleAddToList = async (movie: AppMoviePreview, listId: string, rating?: number) => {
    // TODO: Implement add to list functionality
    console.log('Add to list:', { movie, listId, rating })
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
    <>
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
    </>
  )
}
