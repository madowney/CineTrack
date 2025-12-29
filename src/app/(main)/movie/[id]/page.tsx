import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMovieDetails, getSimilarMovies, getWatchProviders, transformMovieDetails, transformMoviePreview } from '@/lib/tmdb'
import { MovieHero } from '@/components/movie/MovieHero'
import { MovieOverview } from '@/components/movie/MovieOverview'
import { CastCarousel } from '@/components/movie/CastCarousel'
import { SimilarMovies } from '@/components/movie/SimilarMovies'
import { StreamingProviders } from '@/components/movie/StreamingProviders'

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params
  const movieId = parseInt(id, 10)

  if (isNaN(movieId)) {
    return { title: 'Movie Not Found - CineTrack' }
  }

  try {
    const movieData = await getMovieDetails(movieId)
    const movie = transformMovieDetails(movieData)
    return {
      title: `${movie.title} (${movie.releaseYear}) - CineTrack`,
      description: movie.overview || `Details for ${movie.title}`,
    }
  } catch {
    return { title: 'Movie Not Found - CineTrack' }
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  const movieId = parseInt(id, 10)

  if (isNaN(movieId)) {
    notFound()
  }

  try {
    const [movieData, similarData, watchProviders] = await Promise.all([
      getMovieDetails(movieId),
      getSimilarMovies(movieId).catch(() => null),
      getWatchProviders(movieId).catch(() => null),
    ])

    const movie = transformMovieDetails(movieData)
    const similarMovies = similarData?.results?.slice(0, 6).map(transformMoviePreview) || []

    return (
      <div className="min-h-screen">
        {/* Hero section with backdrop */}
        <MovieHero movie={movie} />

        {/* Content sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              <MovieOverview movie={movie} />

              {movie.cast.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Top Cast
                  </h2>
                  <CastCarousel cast={movie.cast} />
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Streaming providers */}
              {watchProviders && (
                <StreamingProviders providers={watchProviders} />
              )}

              {/* Movie info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Movie Info
                </h3>
                <dl className="space-y-3 text-sm">
                  {movie.releaseDate && (
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Release Date</dt>
                      <dd className="text-gray-900 dark:text-white">
                        {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </dd>
                    </div>
                  )}
                  {movie.runtime && (
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Runtime</dt>
                      <dd className="text-gray-900 dark:text-white">{movie.runtimeFormatted}</dd>
                    </div>
                  )}
                  {movie.mpaaRating && (
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Rating</dt>
                      <dd className="text-gray-900 dark:text-white">{movie.mpaaRating}</dd>
                    </div>
                  )}
                  {movie.status && (
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                      <dd className="text-gray-900 dark:text-white">{movie.status}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Similar movies */}
          {similarMovies.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Similar Movies
              </h2>
              <SimilarMovies movies={similarMovies} />
            </section>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching movie:', error)
    notFound()
  }
}
