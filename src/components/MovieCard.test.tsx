import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MovieCard } from './MovieCard'
import { Movie } from '@/types/database'

const mockMovie: Movie = {
  id: '1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  title: 'The Matrix',
  year: 1999,
  genre: 'Sci-Fi',
  rating: 5,
  watched: true,
  notes: 'Great movie about reality',
  poster_url: null,
}

describe('MovieCard', () => {
  const mockOnClick = vi.fn()
  const mockOnToggleWatched = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders movie title', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        onToggleWatched={mockOnToggleWatched}
      />
    )

    expect(screen.getByText('The Matrix')).toBeInTheDocument()
  })

  it('renders movie year', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        onToggleWatched={mockOnToggleWatched}
      />
    )

    expect(screen.getByText('1999')).toBeInTheDocument()
  })

  it('renders movie genre', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        onToggleWatched={mockOnToggleWatched}
      />
    )

    expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
  })

  it('renders rating stars', () => {
    const { container } = render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        onToggleWatched={mockOnToggleWatched}
      />
    )

    // Should have 5 star SVGs with the star path
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(5)
  })

  it('renders movie notes', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        onToggleWatched={mockOnToggleWatched}
      />
    )

    expect(screen.getByText('Great movie about reality')).toBeInTheDocument()
  })

  it('shows watched checkbox as checked when movie is watched', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        onToggleWatched={mockOnToggleWatched}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('calls onClick when card is clicked', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        onToggleWatched={mockOnToggleWatched}
      />
    )

    const title = screen.getByText('The Matrix')
    fireEvent.click(title)

    expect(mockOnClick).toHaveBeenCalledWith(mockMovie)
  })

  it('shows click for details hint', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        onToggleWatched={mockOnToggleWatched}
      />
    )

    expect(screen.getByText('Click for details')).toBeInTheDocument()
  })

  it('calls onToggleWatched when checkbox is toggled', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        onToggleWatched={mockOnToggleWatched}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(mockOnToggleWatched).toHaveBeenCalledWith('1', false)
  })

  it('renders poster image when poster_url is provided', () => {
    const movieWithPoster = { ...mockMovie, poster_url: 'https://example.com/poster.jpg' }

    render(
      <MovieCard
        movie={movieWithPoster}
        onClick={mockOnClick}
        onToggleWatched={mockOnToggleWatched}
      />
    )

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/poster.jpg')
  })
})
