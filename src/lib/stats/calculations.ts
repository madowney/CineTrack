import type { Movie } from '@/types/database'
import type { DashboardStats, GenreStat } from './types'

export function calculateDashboardStats(movies: Movie[]): DashboardStats {
  const totalMovies = movies.length
  const watchedMovies = movies.filter((m) => m.watched)
  const watchedCount = watchedMovies.length
  const unwatchedCount = totalMovies - watchedCount

  // Calculate average rating from movies that have a rating
  const moviesWithRating = movies.filter((m) => m.rating !== null && m.rating > 0)
  const averageRating =
    moviesWithRating.length > 0
      ? moviesWithRating.reduce((sum, m) => sum + (m.rating || 0), 0) / moviesWithRating.length
      : null

  // Calculate total hours watched (from movies with runtime)
  const totalMinutesWatched = watchedMovies.reduce((sum, m) => sum + (m.runtime || 0), 0)
  const totalHoursWatched = Math.round(totalMinutesWatched / 60)

  return {
    totalMovies,
    watchedCount,
    unwatchedCount,
    averageRating,
    totalHoursWatched,
  }
}

export function calculateGenreStats(movies: Movie[]): GenreStat[] {
  const genreCounts: Record<string, number> = {}

  movies.forEach((movie) => {
    // Use genres array if available, otherwise fall back to genre string
    if (movie.genres && movie.genres.length > 0) {
      movie.genres.forEach((g) => {
        genreCounts[g.name] = (genreCounts[g.name] || 0) + 1
      })
    } else if (movie.genre) {
      genreCounts[movie.genre] = (genreCounts[movie.genre] || 0) + 1
    }
  })

  const totalMovies = movies.length || 1 // Prevent division by zero

  return Object.entries(genreCounts)
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: Math.round((count / totalMovies) * 100),
    }))
    .sort((a, b) => b.count - a.count)
}

export function formatHours(hours: number): string {
  if (hours < 1) return '< 1 hour'
  if (hours === 1) return '1 hour'
  return `${hours} hours`
}

export function formatRating(rating: number | null): string {
  if (rating === null) return 'N/A'
  return rating.toFixed(1)
}
