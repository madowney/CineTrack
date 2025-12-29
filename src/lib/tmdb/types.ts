// TMDB API Response Types

export interface TMDBMovie {
  id: number
  title: string
  original_title: string
  overview: string | null
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  adult: boolean
  genre_ids: number[]
  original_language: string
  popularity: number
  vote_average: number
  vote_count: number
  video: boolean
}

export interface TMDBMovieDetails extends Omit<TMDBMovie, 'genre_ids'> {
  belongs_to_collection: {
    id: number
    name: string
    poster_path: string | null
    backdrop_path: string | null
  } | null
  budget: number
  genres: TMDBGenre[]
  homepage: string | null
  imdb_id: string | null
  production_companies: TMDBProductionCompany[]
  production_countries: { iso_3166_1: string; name: string }[]
  revenue: number
  runtime: number | null
  spoken_languages: { iso_639_1: string; name: string; english_name: string }[]
  status: string
  tagline: string | null
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface TMDBCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
  known_for_department: string
  gender: number
  adult: boolean
  popularity: number
  credit_id: string
  cast_id: number
}

export interface TMDBCrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
  gender: number
  adult: boolean
  popularity: number
  credit_id: string
  known_for_department: string
}

export interface TMDBCredits {
  id: number
  cast: TMDBCastMember[]
  crew: TMDBCrewMember[]
}

export interface TMDBReleaseDates {
  id: number
  results: {
    iso_3166_1: string
    release_dates: {
      certification: string
      descriptors: string[]
      iso_639_1: string
      note: string
      release_date: string
      type: number
    }[]
  }[]
}

export interface TMDBSearchResult {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

export interface TMDBPerson {
  id: number
  name: string
  also_known_as: string[]
  biography: string
  birthday: string | null
  deathday: string | null
  gender: number
  homepage: string | null
  imdb_id: string | null
  known_for_department: string
  place_of_birth: string | null
  popularity: number
  profile_path: string | null
}

export interface TMDBPersonCredits {
  id: number
  cast: (TMDBMovie & { character: string; credit_id: string })[]
  crew: (TMDBMovie & { job: string; department: string; credit_id: string })[]
}

export interface TMDBWatchProviders {
  id: number
  results: {
    [countryCode: string]: {
      link: string
      flatrate?: TMDBWatchProvider[]
      rent?: TMDBWatchProvider[]
      buy?: TMDBWatchProvider[]
    }
  }
}

export interface TMDBWatchProvider {
  logo_path: string
  provider_id: number
  provider_name: string
  display_priority: number
}

export interface TMDBSimilarMovies {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

// Helper types for our application
export interface MovieWithCredits extends TMDBMovieDetails {
  credits: TMDBCredits
  release_dates?: TMDBReleaseDates
}

// Image URL helpers
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export type TMDBImageSize =
  | 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'  // posters
  | 'w300' | 'w1280'  // backdrops

export function getTMDBImageUrl(
  path: string | null,
  size: TMDBImageSize = 'w500'
): string | null {
  if (!path) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function getTMDBPosterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' = 'w500'): string | null {
  return getTMDBImageUrl(path, size)
}

export function getTMDBBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null {
  return getTMDBImageUrl(path, size)
}

export function getTMDBProfileUrl(path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string | null {
  if (!path) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}
