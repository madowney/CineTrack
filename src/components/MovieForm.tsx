'use client'

import { useState, useEffect } from 'react'
import { Movie, MovieInsert } from '@/types/database'

// Form data always has required title since form requires it
type MovieFormData = Omit<MovieInsert, 'id' | 'created_at' | 'updated_at'>

interface MovieFormProps {
  movie?: Movie | null
  onSubmit: (movie: MovieFormData) => void
  onCancel: () => void
}

export function MovieForm({ movie, onSubmit, onCancel }: MovieFormProps) {
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [genre, setGenre] = useState('')
  const [rating, setRating] = useState('')
  const [watched, setWatched] = useState(false)
  const [notes, setNotes] = useState('')
  const [posterUrl, setPosterUrl] = useState('')

  useEffect(() => {
    if (movie) {
      setTitle(movie.title)
      setYear(movie.year?.toString() || '')
      setGenre(movie.genre || '')
      setRating(movie.rating?.toString() || '')
      setWatched(movie.watched)
      setNotes(movie.notes || '')
      setPosterUrl(movie.poster_url || '')
    }
  }, [movie])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const movieData: MovieFormData = {
      title,
      year: year ? parseInt(year) : null,
      genre: genre || null,
      rating: rating ? parseInt(rating) : null,
      watched,
      notes: notes || null,
      poster_url: posterUrl || null,
    }

    onSubmit(movieData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Year
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1900"
            max={new Date().getFullYear() + 5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Genre
          </label>
          <input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Rating (1-5)
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">No rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} star{r > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Poster URL
        </label>
        <input
          type="url"
          id="posterUrl"
          value={posterUrl}
          onChange={(e) => setPosterUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="watched"
          checked={watched}
          onChange={(e) => setWatched(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="watched" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Already watched
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {movie ? 'Update' : 'Add'} Movie
        </button>
      </div>
    </form>
  )
}
