'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BrowseMovieCard, QuickAddModal } from '@/components/browse'
import type { AppMoviePreview } from '@/lib/tmdb'
import { useAuth } from '@/context/AuthContext'

interface MovieSection {
  title: string
  href: string
  movies: AppMoviePreview[]
  isLoading: boolean
}

export default function BrowseDiscoverPage() {
  const { user } = useAuth()
  const [sections, setSections] = useState<MovieSection[]>([
    { title: 'Popular Now', href: '/browse/popular', movies: [], isLoading: true },
    { title: 'Top Rated', href: '/browse/top-rated', movies: [], isLoading: true },
    { title: 'Now Playing', href: '/browse/now-playing', movies: [], isLoading: true },
    { title: 'Coming Soon', href: '/browse/upcoming', movies: [], isLoading: true },
  ])
  const [quickAddMovie, setQuickAddMovie] = useState<AppMoviePreview | null>(null)

  useEffect(() => {
    const endpoints = [
      '/api/tmdb/browse/popular',
      '/api/tmdb/browse/top-rated',
      '/api/tmdb/browse/now-playing',
      '/api/tmdb/browse/upcoming',
    ]

    endpoints.forEach((endpoint, index) => {
      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
          setSections((prev) =>
            prev.map((section, i) =>
              i === index
                ? { ...section, movies: data.results?.slice(0, 6) || [], isLoading: false }
                : section
            )
          )
        })
        .catch(() => {
          setSections((prev) =>
            prev.map((section, i) =>
              i === index ? { ...section, isLoading: false } : section
            )
          )
        })
    })
  }, [])

  const handleQuickAdd = (movie: AppMoviePreview) => {
    if (!user) {
      window.location.href = '/login?redirectTo=/browse'
      return
    }
    setQuickAddMovie(movie)
  }

  const handleAddToList = async (movie: AppMoviePreview, listId: string, rating?: number) => {
    // TODO: Implement add to list functionality
    console.log('Add to list:', { movie, listId, rating })
  }

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.title}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {section.title}
            </h2>
            <Link
              href={section.href}
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              View all &rarr;
            </Link>
          </div>

          {section.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                >
                  <div className="aspect-[2/3]" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {section.movies.map((movie) => (
                <BrowseMovieCard
                  key={movie.tmdbId}
                  movie={movie}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          )}
        </section>
      ))}

      <QuickAddModal
        movie={quickAddMovie}
        isOpen={!!quickAddMovie}
        onClose={() => setQuickAddMovie(null)}
        onAdd={handleAddToList}
      />
    </div>
  )
}
