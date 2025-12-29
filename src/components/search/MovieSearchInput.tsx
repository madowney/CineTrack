'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useTMDBSearch } from '@/hooks/useTMDBSearch'
import { MovieSearchResult } from './MovieSearchResult'
import type { AppMoviePreview } from '@/lib/tmdb'

interface MovieSearchInputProps {
  onSelect: (movie: AppMoviePreview) => void
  placeholder?: string
  autoFocus?: boolean
}

export function MovieSearchInput({
  onSelect,
  placeholder = 'Search for a movie...',
  autoFocus = false,
}: MovieSearchInputProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 300)
  const { results, isLoading, error } = useTMDBSearch(debouncedQuery)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [results])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  function handleSelect(movie: AppMoviePreview) {
    onSelect(movie)
    setQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  function handleClear() {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const showDropdown = isOpen && query.length >= 2

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500">Searching...</span>
            </div>
          ) : error ? (
            <div className="px-4 py-3 text-red-500">
              Error searching movies. Please try again.
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-gray-500">
              No movies found for &quot;{debouncedQuery}&quot;
            </div>
          ) : (
            <ul className="py-1">
              {results.slice(0, 8).map((movie, index) => (
                <li key={movie.tmdbId}>
                  <MovieSearchResult
                    movie={movie}
                    isSelected={index === selectedIndex}
                    onClick={() => handleSelect(movie)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
