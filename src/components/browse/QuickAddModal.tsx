'use client'

import { useState } from 'react'
import { Modal } from '@/components/Modal'
import { StarRating } from '@/components/ui/StarRating'
import { useLists } from '@/hooks/useLists'
import type { AppMoviePreview } from '@/lib/tmdb'

interface QuickAddModalProps {
  movie: AppMoviePreview | null
  isOpen: boolean
  onClose: () => void
  onAdd: (movie: AppMoviePreview, listId: string, rating?: number) => Promise<void>
}

export function QuickAddModal({ movie, isOpen, onClose, onAdd }: QuickAddModalProps) {
  const { lists, isLoading: listsLoading } = useLists()
  const [selectedListId, setSelectedListId] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get system lists (watched, want-to-watch, owned)
  const systemLists = lists.filter((list) => list.is_system)
  const customLists = lists.filter((list) => !list.is_system)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!movie || !selectedListId) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onAdd(movie, selectedListId, rating > 0 ? rating : undefined)
      onClose()
      // Reset form
      setSelectedListId('')
      setRating(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add movie')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!movie) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to List">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Movie preview */}
        <div className="flex gap-4">
          {movie.posterUrl && (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-20 h-30 object-cover rounded"
            />
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {movie.title}
            </h3>
            {movie.releaseYear && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {movie.releaseYear}
              </p>
            )}
          </div>
        </div>

        {/* List selection */}
        <div>
          <label
            htmlFor="list-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Add to list
          </label>
          <select
            id="list-select"
            value={selectedListId}
            onChange={(e) => setSelectedListId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={listsLoading}
          >
            <option value="">Select a list...</option>
            <optgroup label="My Lists">
              {systemLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </optgroup>
            {customLists.length > 0 && (
              <optgroup label="Custom Lists">
                {customLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your rating (optional)
          </label>
          <StarRating
            rating={rating}
            onChange={setRating}
            showValue
            size="lg"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedListId || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add to List'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
