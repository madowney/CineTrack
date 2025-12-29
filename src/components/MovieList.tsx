'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Movie, MovieInsert } from '@/types/database'
import { MovieCard } from './MovieCard'
import { MovieForm } from './MovieForm'
import { MovieDetail } from './MovieDetail'
import { Modal } from './Modal'

// Form data type matching MovieForm's output
type MovieFormData = Omit<MovieInsert, 'id' | 'created_at' | 'updated_at'>

export function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [viewingMovie, setViewingMovie] = useState<Movie | null>(null)
  const [filter, setFilter] = useState<'all' | 'watched' | 'unwatched'>('all')

  const supabase = createClient()

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMovies(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  const handleSubmitMovie = async (movieData: MovieFormData) => {
    try {
      if (editingMovie) {
        // Update existing movie
        const { error } = await supabase
          .from('movies')
          .update(movieData)
          .eq('id', editingMovie.id)

        if (error) throw error
        setEditingMovie(null)
      } else {
        // Add new movie
        const { error } = await supabase.from('movies').insert(movieData)
        if (error) throw error
      }

      await fetchMovies()
      setIsFormModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : editingMovie ? 'Failed to update movie' : 'Failed to add movie')
    }
  }

  const handleViewMovie = (movie: Movie) => {
    setViewingMovie(movie)
    setIsDetailModalOpen(true)
  }

  const handleDeleteMovie = async (id: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return

    try {
      const { error } = await supabase.from('movies').delete().eq('id', id)
      if (error) throw error
      await fetchMovies()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete movie')
    }
  }

  const handleToggleWatched = async (id: string, watched: boolean) => {
    try {
      const { error } = await supabase
        .from('movies')
        .update({ watched })
        .eq('id', id)

      if (error) throw error
      setMovies(movies.map((m) => (m.id === id ? { ...m, watched } : m)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update movie')
    }
  }

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie)
    setIsFormModalOpen(true)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingMovie(null)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setViewingMovie(null)
  }

  const filteredMovies = movies.filter((movie) => {
    if (filter === 'watched') return movie.watched
    if (filter === 'unwatched') return !movie.watched
    return true
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2">
          {(['all', 'watched', 'unwatched'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsFormModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Movie
        </button>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No movies found</p>
          <p className="text-sm mt-2">
            {filter !== 'all'
              ? 'Try changing the filter or add a new movie'
              : 'Start by adding your first movie'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={handleViewMovie}
              onToggleWatched={handleToggleWatched}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingMovie ? 'Edit Movie' : 'Add Movie'}
      >
        <MovieForm
          movie={editingMovie}
          onSubmit={handleSubmitMovie}
          onCancel={handleCloseFormModal}
        />
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        title="Movie Details"
      >
        {viewingMovie && (
          <MovieDetail
            movie={viewingMovie}
            onClose={handleCloseDetailModal}
            onEdit={handleEdit}
            onDelete={handleDeleteMovie}
            onToggleWatched={(id, watched) => {
              handleToggleWatched(id, watched)
              setViewingMovie(prev => prev ? { ...prev, watched } : null)
            }}
          />
        )}
      </Modal>
    </div>
  )
}
