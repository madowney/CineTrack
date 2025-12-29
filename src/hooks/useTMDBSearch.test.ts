import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTMDBSearch } from './useTMDBSearch'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Counter to generate unique queries for each test to avoid SWR cache conflicts
let testCounter = 0

describe('useTMDBSearch', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    testCounter++
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const mockSearchResponse = {
    page: 1,
    totalPages: 1,
    totalResults: 2,
    results: [
      {
        tmdbId: 603,
        title: 'The Matrix',
        overview: 'A computer hacker learns about the true nature of reality.',
        posterUrl: 'https://image.tmdb.org/t/p/w342/poster.jpg',
        releaseDate: '1999-03-30',
        releaseYear: 1999,
        genreIds: [28, 878],
        voteAverage: 8.2,
        popularity: 100.5,
      },
      {
        tmdbId: 604,
        title: 'The Matrix Reloaded',
        overview: 'Neo and the rebels fight against the machines.',
        posterUrl: 'https://image.tmdb.org/t/p/w342/poster2.jpg',
        releaseDate: '2003-05-15',
        releaseYear: 2003,
        genreIds: [28, 878],
        voteAverage: 7.0,
        popularity: 80.2,
      },
    ],
  }

  it('should not fetch when query is empty', () => {
    renderHook(() => useTMDBSearch(''))
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should not fetch when query is too short (less than 2 chars)', () => {
    renderHook(() => useTMDBSearch('a'))
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should return empty results when query is too short', () => {
    const { result } = renderHook(() => useTMDBSearch('a'))

    expect(result.current.results).toEqual([])
    expect(result.current.totalResults).toBe(0)
    expect(result.current.isLoading).toBe(false)
  })

  it('should fetch when query is 2 or more characters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    const { result } = renderHook(() => useTMDBSearch('matrix'))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/tmdb/search?query=matrix&page=1'
    )
    expect(result.current.results).toHaveLength(2)
    expect(result.current.results[0].title).toBe('The Matrix')
  })

  it('should include page parameter', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    renderHook(() => useTMDBSearch('matrix', 2))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/tmdb/search?query=matrix&page=2'
      )
    })
  })

  it('should URL encode the query', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ...mockSearchResponse, results: [] }),
    })

    renderHook(() => useTMDBSearch('the matrix'))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/tmdb/search?query=the%20matrix&page=1'
      )
    })
  })

  it('should handle errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    // Use unique query to avoid cache conflicts
    const uniqueQuery = `errortest${testCounter}`
    const { result } = renderHook(() => useTMDBSearch(uniqueQuery))

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    }, { timeout: 2000 })

    expect(result.current.results).toEqual([])
  })

  it('should return totalPages and totalResults from response', async () => {
    const customResponse = {
      page: 1,
      totalPages: 5,
      totalResults: 100,
      results: mockSearchResponse.results,
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(customResponse),
    })

    // Use unique query to avoid cache conflicts
    const uniqueQuery = `pagestest${testCounter}`
    const { result } = renderHook(() => useTMDBSearch(uniqueQuery))

    await waitFor(() => {
      expect(result.current.results.length).toBeGreaterThan(0)
    })

    expect(result.current.totalPages).toBe(5)
    expect(result.current.totalResults).toBe(100)
  })
})
