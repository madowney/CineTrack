// High-level TMDB API functions

import { getTMDBClient } from './client'
import type {
  TMDBMovie,
  TMDBMovieDetails,
  TMDBSearchResult,
  TMDBGenre,
  MovieWithCredits,
  TMDBPerson,
  TMDBPersonCredits,
} from './types'
import { getTMDBPosterUrl, getTMDBBackdropUrl, getTMDBProfileUrl } from './types'

// Search for movies by title
export async function searchMovies(query: string, page = 1): Promise<TMDBSearchResult> {
  const client = getTMDBClient()
  return client.searchMovies(query, page)
}

// Get full movie details with credits
export async function getMovieDetails(movieId: number): Promise<MovieWithCredits> {
  const client = getTMDBClient()
  return client.getMovieWithCredits(movieId)
}

// Get basic movie info
export async function getMovie(movieId: number): Promise<TMDBMovieDetails> {
  const client = getTMDBClient()
  return client.getMovie(movieId)
}

// Get similar movies
export async function getSimilarMovies(movieId: number, page = 1) {
  const client = getTMDBClient()
  return client.getSimilarMovies(movieId, page)
}

// Get movie watch providers (streaming/rent/buy)
export async function getWatchProviders(movieId: number, countryCode = 'US') {
  const client = getTMDBClient()
  const providers = await client.getMovieWatchProviders(movieId)
  return providers.results[countryCode] || null
}

// Browse endpoints
export async function getPopularMovies(page = 1): Promise<TMDBSearchResult> {
  const client = getTMDBClient()
  return client.getPopularMovies(page)
}

export async function getTopRatedMovies(page = 1): Promise<TMDBSearchResult> {
  const client = getTMDBClient()
  return client.getTopRatedMovies(page)
}

export async function getNowPlayingMovies(page = 1): Promise<TMDBSearchResult> {
  const client = getTMDBClient()
  return client.getNowPlayingMovies(page)
}

export async function getUpcomingMovies(page = 1): Promise<TMDBSearchResult> {
  const client = getTMDBClient()
  return client.getUpcomingMovies(page)
}

// Discover movies with filters
export async function discoverMovies(options: {
  page?: number
  genreId?: number
  year?: number
  sortBy?: 'popularity' | 'release_date' | 'vote_average'
  sortOrder?: 'asc' | 'desc'
  minRating?: number
  minVotes?: number
}): Promise<TMDBSearchResult> {
  const client = getTMDBClient()

  const params: Parameters<typeof client.discoverMovies>[0] = {
    page: options.page,
  }

  if (options.genreId) {
    params.with_genres = String(options.genreId)
  }

  if (options.year) {
    params['primary_release_date.gte'] = `${options.year}-01-01`
    params['primary_release_date.lte'] = `${options.year}-12-31`
  }

  if (options.sortBy) {
    const order = options.sortOrder || 'desc'
    params.sort_by = `${options.sortBy}.${order}` as typeof params.sort_by
  }

  if (options.minRating) {
    params['vote_average.gte'] = options.minRating
  }

  if (options.minVotes) {
    params['vote_count.gte'] = options.minVotes
  }

  return client.discoverMovies(params)
}

// Get all genres
let cachedGenres: TMDBGenre[] | null = null

export async function getGenres(): Promise<TMDBGenre[]> {
  if (cachedGenres) {
    return cachedGenres
  }

  const client = getTMDBClient()
  const { genres } = await client.getGenres()
  cachedGenres = genres
  return genres
}

export function getGenreById(genres: TMDBGenre[], id: number): TMDBGenre | undefined {
  return genres.find((g) => g.id === id)
}

export function getGenresByIds(genres: TMDBGenre[], ids: number[]): TMDBGenre[] {
  return ids.map((id) => getGenreById(genres, id)).filter((g): g is TMDBGenre => !!g)
}

// Person endpoints
export async function getPersonDetails(personId: number): Promise<TMDBPerson> {
  const client = getTMDBClient()
  return client.getPerson(personId)
}

export async function getPersonFilmography(personId: number): Promise<TMDBPersonCredits> {
  const client = getTMDBClient()
  return client.getPersonMovieCredits(personId)
}

// Helper to extract MPAA rating from release dates
export function extractMPAARating(releaseDates: MovieWithCredits['release_dates']): string | null {
  if (!releaseDates) return null

  // Try to find US release first
  const usRelease = releaseDates.results.find((r) => r.iso_3166_1 === 'US')
  if (usRelease) {
    const theatrical = usRelease.release_dates.find((rd) => rd.certification)
    if (theatrical?.certification) {
      return theatrical.certification
    }
  }

  return null
}

// Helper to get director from credits
export function extractDirector(credits: MovieWithCredits['credits']): string | null {
  const director = credits.crew.find((c) => c.job === 'Director')
  return director?.name || null
}

// Helper to get directors (for movies with multiple)
export function extractDirectors(credits: MovieWithCredits['credits']): { id: number; name: string }[] {
  return credits.crew
    .filter((c) => c.job === 'Director')
    .map((d) => ({ id: d.id, name: d.name }))
}

// Helper to get top cast members
export function getTopCast(credits: MovieWithCredits['credits'], limit = 10) {
  return credits.cast.slice(0, limit).map((c) => ({
    id: c.id,
    name: c.name,
    character: c.character,
    profileUrl: getTMDBProfileUrl(c.profile_path),
    order: c.order,
  }))
}

// Format runtime to human readable
export function formatRuntime(minutes: number | null): string {
  if (!minutes) return 'Unknown'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

// Transform TMDB movie to our app format
export interface AppMovie {
  tmdbId: number
  imdbId: string | null
  title: string
  originalTitle: string
  overview: string | null
  tagline: string | null
  posterUrl: string | null
  backdropUrl: string | null
  releaseDate: string | null
  releaseYear: number | null
  runtime: number | null
  runtimeFormatted: string
  genres: TMDBGenre[]
  director: string | null
  directors: { id: number; name: string }[]
  cast: ReturnType<typeof getTopCast>
  mpaaRating: string | null
  voteAverage: number
  voteCount: number
  popularity: number
  status: string
}

export function transformMovieDetails(movie: MovieWithCredits): AppMovie {
  return {
    tmdbId: movie.id,
    imdbId: movie.imdb_id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    tagline: movie.tagline,
    posterUrl: getTMDBPosterUrl(movie.poster_path),
    backdropUrl: getTMDBBackdropUrl(movie.backdrop_path),
    releaseDate: movie.release_date || null,
    releaseYear: movie.release_date ? parseInt(movie.release_date.split('-')[0], 10) : null,
    runtime: movie.runtime,
    runtimeFormatted: formatRuntime(movie.runtime),
    genres: movie.genres,
    director: extractDirector(movie.credits),
    directors: extractDirectors(movie.credits),
    cast: getTopCast(movie.credits),
    mpaaRating: extractMPAARating(movie.release_dates),
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    status: movie.status,
  }
}

// Transform search result movie (less data available)
export interface AppMoviePreview {
  tmdbId: number
  title: string
  overview: string | null
  posterUrl: string | null
  releaseDate: string | null
  releaseYear: number | null
  genreIds: number[]
  voteAverage: number
  popularity: number
}

export function transformMoviePreview(movie: TMDBMovie): AppMoviePreview {
  return {
    tmdbId: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterUrl: getTMDBPosterUrl(movie.poster_path, 'w342'),
    releaseDate: movie.release_date || null,
    releaseYear: movie.release_date ? parseInt(movie.release_date.split('-')[0], 10) : null,
    genreIds: movie.genre_ids,
    voteAverage: movie.vote_average,
    popularity: movie.popularity,
  }
}

// Re-export image URL helpers
export { getTMDBPosterUrl, getTMDBBackdropUrl, getTMDBProfileUrl }
