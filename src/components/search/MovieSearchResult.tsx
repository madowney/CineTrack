'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import type { AppMoviePreview } from '@/lib/tmdb'

interface MovieSearchResultProps {
  movie: AppMoviePreview
  isSelected?: boolean
  onClick: () => void
}

export function MovieSearchResult({
  movie,
  isSelected = false,
  onClick,
}: MovieSearchResultProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        isSelected ? 'bg-gray-100 dark:bg-gray-700' : ''
      }`}
    >
      {/* Poster */}
      <div className="flex-shrink-0 w-12 h-18 relative rounded overflow-hidden bg-gray-200 dark:bg-gray-700">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            width={48}
            height={72}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-white truncate">
          {movie.title}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          {movie.releaseYear && <span>{movie.releaseYear}</span>}
          {movie.voteAverage > 0 && (
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              {movie.voteAverage.toFixed(1)}
            </span>
          )}
        </div>
        {movie.overview && (
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
            {movie.overview}
          </p>
        )}
      </div>
    </button>
  )
}
