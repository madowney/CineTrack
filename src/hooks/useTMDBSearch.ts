'use client'

import useSWR from 'swr'
import type { AppMoviePreview } from '@/lib/tmdb'

interface SearchResponse {
  page: number
  totalPages: number
  totalResults: number
  results: AppMoviePreview[]
}

const fetcher = async (url: string): Promise<SearchResponse> => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to search movies')
  }
  return res.json()
}

export function useTMDBSearch(query: string, page = 1) {
  const shouldFetch = query.trim().length >= 2

  const { data, error, isLoading, isValidating } = useSWR<SearchResponse>(
    shouldFetch ? `/api/tmdb/search?query=${encodeURIComponent(query)}&page=${page}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
    }
  )

  return {
    results: data?.results ?? [],
    totalResults: data?.totalResults ?? 0,
    totalPages: data?.totalPages ?? 0,
    page: data?.page ?? 1,
    isLoading: shouldFetch && isLoading,
    isValidating,
    error,
  }
}
