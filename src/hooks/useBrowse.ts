'use client'

import { useState, useCallback, useEffect } from 'react'
import type { AppMoviePreview } from '@/lib/tmdb'

interface BrowseResult {
  page: number
  totalPages: number
  totalResults: number
  results: AppMoviePreview[]
}

interface UseBrowseOptions {
  endpoint: string
  params?: Record<string, string | number | undefined>
}

export function useBrowse({ endpoint, params = {} }: UseBrowseOptions) {
  const [movies, setMovies] = useState<AppMoviePreview[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMovies = useCallback(
    async (pageNum: number, append = false) => {
      setIsLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()
        searchParams.set('page', String(pageNum))

        // Add additional params
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.set(key, String(value))
          }
        })

        const response = await fetch(`${endpoint}?${searchParams}`)

        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }

        const data: BrowseResult = await response.json()

        setMovies((prev) => (append ? [...prev, ...data.results] : data.results))
        setPage(data.page)
        setTotalPages(data.totalPages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    },
    [endpoint, params]
  )

  const loadMore = useCallback(() => {
    if (!isLoading && page < totalPages) {
      fetchMovies(page + 1, true)
    }
  }, [fetchMovies, isLoading, page, totalPages])

  const refresh = useCallback(() => {
    setMovies([])
    setPage(1)
    fetchMovies(1, false)
  }, [fetchMovies])

  // Initial fetch
  useEffect(() => {
    fetchMovies(1, false)
  }, [fetchMovies])

  return {
    movies,
    isLoading,
    error,
    hasMore: page < totalPages,
    loadMore,
    refresh,
  }
}
