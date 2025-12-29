'use client'

import { Movie } from '@/types/database'

interface MovieDetailProps {
  movie: Movie
  onClose: () => void
  onEdit: (movie: Movie) => void
  onDelete: (id: string) => void
  onToggleWatched: (id: string, watched: boolean) => void
}

export function MovieDetail({ movie, onClose, onEdit, onDelete, onToggleWatched }: MovieDetailProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this movie?')) {
      onDelete(movie.id)
      onClose()
    }
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {movie.poster_url && (
        <div className="w-full h-64 mb-4 rounded-lg overflow-hidden">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {movie.title}
          </h2>
          {movie.year && (
            <span className="text-lg text-gray-500 dark:text-gray-400">
              ({movie.year})
            </span>
          )}
        </div>

        {movie.genre && (
          <div>
            <span className="inline-block px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
              {movie.genre}
            </span>
          </div>
        )}

        {movie.rating && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Rating:</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
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
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {movie.rating}/5
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={movie.watched}
              onChange={(e) => onToggleWatched(movie.id, e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              {movie.watched ? 'Watched' : 'Not watched yet'}
            </span>
          </label>
        </div>

        {movie.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {movie.notes}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-400 dark:text-gray-500">
          Added: {new Date(movie.created_at).toLocaleDateString()}
          {movie.updated_at !== movie.created_at && (
            <> · Updated: {new Date(movie.updated_at).toLocaleDateString()}</>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </button>
          <button
            onClick={() => {
              onEdit(movie)
              onClose()
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
