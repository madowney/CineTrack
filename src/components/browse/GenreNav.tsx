'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { TMDBGenre } from '@/lib/tmdb'

interface GenreNavProps {
  genres: TMDBGenre[]
  selectedGenreId?: number
}

// Map genre names to URL-friendly slugs
function genreToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export function GenreNav({ genres, selectedGenreId }: GenreNavProps) {
  const pathname = usePathname()

  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-hide pb-2">
        <div className="flex gap-2 min-w-max">
          <Link
            href="/browse/genres"
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === '/browse/genres' && !selectedGenreId
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Genres
          </Link>

          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/browse/genres/${genreToSlug(genre.name)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedGenreId === genre.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Fade indicators */}
      <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
    </div>
  )
}

// Static genre data with IDs for mapping slugs back to IDs
export const GENRE_MAP: Record<string, number> = {
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'comedy': 35,
  'crime': 80,
  'documentary': 99,
  'drama': 18,
  'family': 10751,
  'fantasy': 14,
  'history': 36,
  'horror': 27,
  'music': 10402,
  'mystery': 9648,
  'romance': 10749,
  'science-fiction': 878,
  'tv-movie': 10770,
  'thriller': 53,
  'war': 10752,
  'western': 37,
}

export function getGenreIdFromSlug(slug: string): number | undefined {
  return GENRE_MAP[slug]
}

export function getGenreNameFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
