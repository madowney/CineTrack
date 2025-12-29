import Link from 'next/link'
import type { AppMoviePreview } from '@/lib/tmdb'
import { DisplayRating } from '@/components/ui/StarRating'

interface SimilarMoviesProps {
  movies: AppMoviePreview[]
}

export function SimilarMovies({ movies }: SimilarMoviesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <Link
          key={movie.tmdbId}
          href={`/movie/${movie.tmdbId}`}
          className="group"
        >
          <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shadow hover:shadow-lg transition-shadow">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
            )}
          </div>
          <h4 className="mt-2 text-sm font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {movie.title}
          </h4>
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
        </Link>
      ))}
    </div>
  )
}
