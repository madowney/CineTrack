import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MovieForm } from './MovieForm'
import { Movie } from '@/types/database'

describe('MovieForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(
      <MovieForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/genre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/rating/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/poster url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/already watched/i)).toBeInTheDocument()
  })

  it('shows Add Movie button when no movie prop', () => {
    render(
      <MovieForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByRole('button', { name: /add movie/i })).toBeInTheDocument()
  })

  it('shows Update button when editing a movie', () => {
    const movie: Movie = {
      id: '1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      title: 'Test Movie',
      year: 2020,
      genre: 'Drama',
      rating: 4,
      watched: false,
      notes: 'Test notes',
      poster_url: null,
    }

    render(
      <MovieForm
        movie={movie}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByRole('button', { name: /update movie/i })).toBeInTheDocument()
  })

  it('populates form fields when editing a movie', () => {
    const movie: Movie = {
      id: '1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      title: 'Test Movie',
      year: 2020,
      genre: 'Drama',
      rating: 4,
      watched: true,
      notes: 'Test notes',
      poster_url: 'https://example.com/poster.jpg',
    }

    render(
      <MovieForm
        movie={movie}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Movie')
    expect(screen.getByLabelText(/year/i)).toHaveValue(2020)
    expect(screen.getByLabelText(/genre/i)).toHaveValue('Drama')
    expect(screen.getByLabelText(/rating/i)).toHaveValue('4')
    expect(screen.getByLabelText(/poster url/i)).toHaveValue('https://example.com/poster.jpg')
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Test notes')
    expect(screen.getByLabelText(/already watched/i)).toBeChecked()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <MovieForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('calls onSubmit with form data when form is submitted', async () => {
    const user = userEvent.setup()

    render(
      <MovieForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    await user.type(screen.getByLabelText(/title/i), 'New Movie')
    await user.type(screen.getByLabelText(/year/i), '2023')
    await user.type(screen.getByLabelText(/genre/i), 'Action')
    await user.selectOptions(screen.getByLabelText(/rating/i), '5')
    await user.type(screen.getByLabelText(/notes/i), 'Great movie')
    await user.click(screen.getByLabelText(/already watched/i))

    const submitButton = screen.getByRole('button', { name: /add movie/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Movie',
        year: 2023,
        genre: 'Action',
        rating: 5,
        watched: true,
        notes: 'Great movie',
        poster_url: null,
      })
    })
  })

  it('requires title field', () => {
    render(
      <MovieForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    const titleInput = screen.getByLabelText(/title/i)
    expect(titleInput).toBeRequired()
  })
})
