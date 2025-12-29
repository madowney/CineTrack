import { vi } from 'vitest'
import { Movie } from '@/types/database'

// Base TMDB fields that are null by default for test data
const tmdbDefaults = {
  tmdb_id: null,
  imdb_id: null,
  overview: null,
  tagline: null,
  backdrop_url: null,
  runtime: null,
  release_date: null,
  director: null,
  cast_members: [],
  crew_members: [],
  genres: [],
  production_companies: [],
  vote_average: null,
  vote_count: null,
  popularity: null,
  mpaa_rating: null,
  status: null,
  tmdb_last_fetched: null,
  user_id: null,
}

export const mockMovies: Movie[] = [
  {
    id: '1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    title: 'The Matrix',
    year: 1999,
    genre: 'Sci-Fi',
    rating: 5,
    watched: true,
    notes: 'Great movie',
    poster_url: null,
    ...tmdbDefaults,
  },
  {
    id: '2',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    title: 'Inception',
    year: 2010,
    genre: 'Sci-Fi',
    rating: 4,
    watched: false,
    notes: null,
    poster_url: null,
    ...tmdbDefaults,
  },
]

export const createMockSupabaseClient = () => {
  const mockFrom = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: mockMovies, error: null }),
      }),
      order: vi.fn().mockResolvedValue({ data: mockMovies, error: null }),
    }),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    delete: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  })

  return {
    from: mockFrom,
  }
}

export const mockCreateClient = vi.fn(() => createMockSupabaseClient())
