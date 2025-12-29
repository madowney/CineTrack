'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { TMDBGenre } from '@/lib/tmdb'
import { getGenreIdFromSlug } from '@/components/browse/GenreNav'

// Genre icons/emojis
const genreEmojis: Record<number, string> = {
  28: '💥', // Action
  12: '🗺️', // Adventure
  16: '🎨', // Animation
  35: '😂', // Comedy
  80: '🔪', // Crime
  99: '📹', // Documentary
  18: '🎭', // Drama
  10751: '👨‍👩‍👧', // Family
  14: '🧙', // Fantasy
  36: '📜', // History
  27: '👻', // Horror
  10402: '🎵', // Music
  9648: '🔍', // Mystery
  10749: '💕', // Romance
  878: '🚀', // Science Fiction
  10770: '📺', // TV Movie
  53: '😱', // Thriller
  10752: '⚔️', // War
  37: '🤠', // Western
}

export default function GenresPage() {
  const [genres, setGenres] = useState<TMDBGenre[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tmdb/genres')
      .then((res) => res.json())
      .then((data) => {
        setGenres(data.genres || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Explore movies by genre
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre) => {
          const slug = genre.name.toLowerCase().replace(/\s+/g, '-')
          return (
            <Link
              key={genre.id}
              href={`/browse/genres/${slug}`}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <span className="text-3xl">{genreEmojis[genre.id] || '🎬'}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {genre.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
