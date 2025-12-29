'use client'

import { useState, useRef, useEffect } from 'react'
import { useLists, useMovieInLists } from '@/hooks/useLists'
import { useAuth } from '@/context/AuthContext'
import type { ListType } from '@/types/database'

interface AddToListButtonProps {
  tmdbMovieId: number
  movieTitle?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'button'
}

const listTypeIcons: Record<ListType, string> = {
  watched: '✓',
  want_to_watch: '📋',
  owned: '📀',
  custom: '📁',
}

const listTypeLabels: Record<ListType, string> = {
  watched: 'Watched',
  want_to_watch: 'Want to Watch',
  owned: 'Owned',
  custom: 'Custom',
}

export function AddToListButton({
  tmdbMovieId,
  movieTitle,
  size = 'md',
  variant = 'button',
}: AddToListButtonProps) {
  const { user } = useAuth()
  const { lists, isLoading: listsLoading } = useLists()
  const { listMemberships, addToList, removeFromList, isInList, isLoading: membershipLoading } =
    useMovieInLists(tmdbMovieId)
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) {
    return null
  }

  const handleToggleList = async (listId: string) => {
    setIsProcessing(true)
    try {
      if (isInList(listId)) {
        await removeFromList(listId)
      } else {
        await addToList(listId)
      }
    } catch (error) {
      console.error('Error toggling list membership:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const sizeClasses = {
    sm: 'p-1 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  }

  const isLoading = listsLoading || membershipLoading

  // Count how many lists the movie is in
  const listCount = listMemberships.length

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${sizeClasses[size]} rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-1`}
        disabled={isLoading || isProcessing}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={movieTitle ? `Add ${movieTitle} to list` : 'Add to list'}
      >
        {variant === 'icon' ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add to List</span>
            {listCount > 0 && (
              <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                {listCount}
              </span>
            )}
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 z-50">
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Add to List</p>
          </div>

          {isLoading ? (
            <div className="px-3 py-4 text-center">
              <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <>
              {/* System lists */}
              {lists
                .filter((list) => list.is_system)
                .map((list) => (
                  <button
                    key={list.id}
                    type="button"
                    onClick={() => handleToggleList(list.id)}
                    disabled={isProcessing}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2">
                      <span>{listTypeIcons[list.list_type]}</span>
                      <span>{listTypeLabels[list.list_type]}</span>
                    </span>
                    {isInList(list.id) && (
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}

              {/* Custom lists */}
              {lists.filter((list) => !list.is_system).length > 0 && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  {lists
                    .filter((list) => !list.is_system)
                    .map((list) => (
                      <button
                        key={list.id}
                        type="button"
                        onClick={() => handleToggleList(list.id)}
                        disabled={isProcessing}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between disabled:opacity-50"
                      >
                        <span className="flex items-center gap-2">
                          <span>📁</span>
                          <span className="truncate">{list.name}</span>
                        </span>
                        {isInList(list.id) && (
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
