'use client'

import { useState } from 'react'
import type { AppMovie } from '@/lib/tmdb'
import { DisplayRating } from '@/components/ui/StarRating'
import { useAuth } from '@/context/AuthContext'
import { useLists } from '@/hooks/useLists'

interface MovieHeroProps {
  movie: AppMovie
}

export function MovieHero({ movie }: MovieHeroProps) {
  const { user } = useAuth()
  const { lists } = useLists()
  const [isAdding, setIsAdding] = useState(false)
  const [showListMenu, setShowListMenu] = useState(false)

  const handleAddToList = async (listId: string) => {
    setIsAdding(true)
    try {
      // TODO: Implement add to list functionality
      console.log('Add to list:', { movieId: movie.tmdbId, listId })
      setShowListMenu(false)
    } catch (error) {
      console.error('Failed to add to list:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="absolute inset-0 h-[60vh]">
        {movie.backdropUrl ? (
          <img
            src={movie.backdropUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-white/50 dark:via-gray-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-gray-900 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 py-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 italic">
                  &quot;{movie.tagline}&quot;
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {movie.releaseYear && <span>{movie.releaseYear}</span>}
                {movie.mpaaRating && (
                  <span className="px-2 py-0.5 border border-gray-400 dark:border-gray-600 rounded">
                    {movie.mpaaRating}
                  </span>
                )}
                {movie.runtimeFormatted && <span>{movie.runtimeFormatted}</span>}
              </div>

              {/* Genres */}
              {movie.genres.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Rating */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <DisplayRating rating={movie.voteAverage} size="lg" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({movie.voteCount.toLocaleString()} votes)
                  </span>
                </div>
              </div>

              {/* Director */}
              {movie.director && (
                <div className="mt-4 text-gray-700 dark:text-gray-300">
                  <span className="text-gray-500 dark:text-gray-400">Directed by </span>
                  <span className="font-medium">{movie.director}</span>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowListMenu(!showListMenu)}
                      disabled={isAdding}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add to List
                    </button>

                    {showListMenu && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                        {lists.map((list) => (
                          <button
                            key={list.id}
                            onClick={() => handleAddToList(list.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {list.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={`/login?redirectTo=/movie/${movie.tmdbId}`}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Sign in to add to list
                  </a>
                )}

                {movie.imdbId && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdbId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    <span className="font-bold">IMDb</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
