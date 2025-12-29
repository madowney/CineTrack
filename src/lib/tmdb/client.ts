// TMDB API Client

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3'

interface TMDBClientOptions {
  apiKey?: string
}

class TMDBClient {
  private apiKey: string

  constructor(options: TMDBClientOptions = {}) {
    const apiKey = options.apiKey || process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY

    if (!apiKey) {
      throw new Error('TMDB API key is required. Set TMDB_API_KEY or NEXT_PUBLIC_TMDB_API_KEY environment variable.')
    }

    this.apiKey = apiKey
  }

  private async request<T>(
    endpoint: string,
    params: Record<string, string | number | undefined> = {}
  ): Promise<T> {
    const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`)

    // Add API key
    url.searchParams.set('api_key', this.apiKey)

    // Add other params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new TMDBError(
        error.status_message || `TMDB API error: ${response.status}`,
        response.status,
        error.status_code
      )
    }

    return response.json()
  }

  // Search methods
  async searchMovies(query: string, page = 1): Promise<import('./types').TMDBSearchResult> {
    return this.request('/search/movie', { query, page, include_adult: 'false' })
  }

  // Movie methods
  async getMovie(movieId: number): Promise<import('./types').TMDBMovieDetails> {
    return this.request(`/movie/${movieId}`)
  }

  async getMovieCredits(movieId: number): Promise<import('./types').TMDBCredits> {
    return this.request(`/movie/${movieId}/credits`)
  }

  async getMovieReleaseDates(movieId: number): Promise<import('./types').TMDBReleaseDates> {
    return this.request(`/movie/${movieId}/release_dates`)
  }

  async getMovieWatchProviders(movieId: number): Promise<import('./types').TMDBWatchProviders> {
    return this.request(`/movie/${movieId}/watch/providers`)
  }

  async getSimilarMovies(movieId: number, page = 1): Promise<import('./types').TMDBSimilarMovies> {
    return this.request(`/movie/${movieId}/similar`, { page })
  }

  async getMovieWithCredits(movieId: number): Promise<import('./types').MovieWithCredits> {
    const [movie, credits, releaseDates] = await Promise.all([
      this.getMovie(movieId),
      this.getMovieCredits(movieId),
      this.getMovieReleaseDates(movieId),
    ])

    return {
      ...movie,
      credits,
      release_dates: releaseDates,
    }
  }

  // Discovery methods
  async getPopularMovies(page = 1): Promise<import('./types').TMDBSearchResult> {
    return this.request('/movie/popular', { page })
  }

  async getTopRatedMovies(page = 1): Promise<import('./types').TMDBSearchResult> {
    return this.request('/movie/top_rated', { page })
  }

  async getNowPlayingMovies(page = 1): Promise<import('./types').TMDBSearchResult> {
    return this.request('/movie/now_playing', { page })
  }

  async getUpcomingMovies(page = 1): Promise<import('./types').TMDBSearchResult> {
    return this.request('/movie/upcoming', { page })
  }

  async discoverMovies(
    options: {
      page?: number
      sort_by?: 'popularity.asc' | 'popularity.desc' | 'release_date.asc' | 'release_date.desc' | 'vote_average.asc' | 'vote_average.desc'
      with_genres?: string // comma-separated genre IDs
      'primary_release_date.gte'?: string // YYYY-MM-DD
      'primary_release_date.lte'?: string
      'vote_average.gte'?: number
      'vote_count.gte'?: number
      with_original_language?: string
    } = {}
  ): Promise<import('./types').TMDBSearchResult> {
    return this.request('/discover/movie', options as Record<string, string | number | undefined>)
  }

  // Genre methods
  async getGenres(): Promise<{ genres: import('./types').TMDBGenre[] }> {
    return this.request('/genre/movie/list')
  }

  // Person methods
  async getPerson(personId: number): Promise<import('./types').TMDBPerson> {
    return this.request(`/person/${personId}`)
  }

  async getPersonMovieCredits(personId: number): Promise<import('./types').TMDBPersonCredits> {
    return this.request(`/person/${personId}/movie_credits`)
  }
}

export class TMDBError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public tmdbStatusCode?: number
  ) {
    super(message)
    this.name = 'TMDBError'
  }
}

// Singleton instance for server-side usage
let clientInstance: TMDBClient | null = null

export function getTMDBClient(): TMDBClient {
  if (!clientInstance) {
    clientInstance = new TMDBClient()
  }
  return clientInstance
}

export { TMDBClient }
