'use client'

import Link from 'next/link'
import type { AppMoviePreview } from '@/lib/tmdb'
import { DisplayRating } from '@/components/ui/StarRating'

interface BrowseMovieCardProps {
  movie: AppMoviePreview
  onQuickAdd?: (movie: AppMoviePreview) => void
}

export function BrowseMovieCard({ movie, onQuickAdd }: BrowseMovieCardProps) {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/movie/${movie.tmdbId}`}>
        <div className="aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Quick add button overlay */}
      {onQuickAdd && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onQuickAdd(movie)
          }}
          className="absolute top-2 right-2 p-2 bg-indigo-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-700 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label={`Add ${movie.title} to list`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      <div className="p-3">
        <Link href={`/movie/${movie.tmdbId}`}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400">
            {movie.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-1">
          {movie.releaseYear && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {movie.releaseYear}
            </span>
          )}
          {movie.voteAverage > 0 && (
            <DisplayRating rating={movie.voteAverage} size="sm" />
          )}
        </div>
      </div>
    </div>
  )
}
