'use client'

import { Movie } from '@/types/database'

interface MovieCardProps {
  movie: Movie
  onClick: (movie: Movie) => void
  onToggleWatched: (id: string, watched: boolean) => void
}

export function MovieCard({ movie, onClick, onToggleWatched }: MovieCardProps) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg cursor-pointer"
      onClick={() => onClick(movie)}
    >
      {movie.poster_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {movie.title}
          </h3>
          {movie.year && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {movie.year}
            </span>
          )}
        </div>

        {movie.genre && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {movie.genre}
          </p>
        )}

        {movie.rating && (
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= movie.rating!
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}

        {movie.notes && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
            {movie.notes}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <label
            className="flex items-center cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={movie.watched}
              onChange={(e) => onToggleWatched(movie.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              Watched
            </span>
          </label>

          <span className="text-sm text-gray-400 dark:text-gray-500">
            Click for details
          </span>
        </div>
      </div>
    </div>
  )
}
