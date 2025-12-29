import type { AppMovie } from '@/lib/tmdb'

interface MovieOverviewProps {
  movie: AppMovie
}

export function MovieOverview({ movie }: MovieOverviewProps) {
  if (!movie.overview) {
    return null
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Overview
      </h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {movie.overview}
      </p>

      {/* Directors */}
      {movie.directors.length > 1 && (
        <div className="mt-4">
          <span className="text-gray-500 dark:text-gray-400">Directors: </span>
          <span className="text-gray-900 dark:text-white">
            {movie.directors.map((d) => d.name).join(', ')}
          </span>
        </div>
      )}
    </section>
  )
}
