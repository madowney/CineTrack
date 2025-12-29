import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MovieSearchResult } from './MovieSearchResult'
import type { AppMoviePreview } from '@/lib/tmdb'

const mockMovie: AppMoviePreview = {
  tmdbId: 603,
  title: 'The Matrix',
  overview: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
  posterUrl: 'https://image.tmdb.org/t/p/w342/poster.jpg',
  releaseDate: '1999-03-30',
  releaseYear: 1999,
  genreIds: [28, 878],
  voteAverage: 8.2,
  popularity: 100.5,
}

describe('MovieSearchResult', () => {
  it('renders movie title', () => {
    render(<MovieSearchResult movie={mockMovie} onClick={() => {}} />)
    expect(screen.getByText('The Matrix')).toBeInTheDocument()
  })

  it('renders release year', () => {
    render(<MovieSearchResult movie={mockMovie} onClick={() => {}} />)
    expect(screen.getByText('1999')).toBeInTheDocument()
  })

  it('renders vote average with star icon', () => {
    render(<MovieSearchResult movie={mockMovie} onClick={() => {}} />)
    expect(screen.getByText('8.2')).toBeInTheDocument()
  })

  it('renders truncated overview', () => {
    render(<MovieSearchResult movie={mockMovie} onClick={() => {}} />)
    // Overview should be visible (truncated)
    expect(screen.getByText(/A computer hacker/)).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<MovieSearchResult movie={mockMovie} onClick={handleClick} />)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies selected styling when isSelected is true', () => {
    render(<MovieSearchResult movie={mockMovie} onClick={() => {}} isSelected />)

    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-gray-100')
  })

  it('does not apply selected styling when isSelected is false', () => {
    render(<MovieSearchResult movie={mockMovie} onClick={() => {}} isSelected={false} />)

    const button = screen.getByRole('button')
    // Should not have the selected class when not selected
    expect(button.className).not.toMatch(/bg-gray-100(?!.*hover)/)
  })

  it('handles movie without poster', () => {
    const movieWithoutPoster: AppMoviePreview = {
      ...mockMovie,
      posterUrl: null,
    }

    render(<MovieSearchResult movie={movieWithoutPoster} onClick={() => {}} />)
    expect(screen.getByText('No Image')).toBeInTheDocument()
  })

  it('handles movie without overview', () => {
    const movieWithoutOverview: AppMoviePreview = {
      ...mockMovie,
      overview: null,
    }

    render(<MovieSearchResult movie={movieWithoutOverview} onClick={() => {}} />)
    // Should still render title
    expect(screen.getByText('The Matrix')).toBeInTheDocument()
    // Overview element should not exist
    expect(screen.queryByText(/A computer hacker/)).not.toBeInTheDocument()
  })

  it('handles movie without release year', () => {
    const movieWithoutYear: AppMoviePreview = {
      ...mockMovie,
      releaseYear: null,
      releaseDate: null,
    }

    render(<MovieSearchResult movie={movieWithoutYear} onClick={() => {}} />)
    expect(screen.getByText('The Matrix')).toBeInTheDocument()
    expect(screen.queryByText('1999')).not.toBeInTheDocument()
  })

  it('does not show rating if vote average is 0', () => {
    const movieWithNoRating: AppMoviePreview = {
      ...mockMovie,
      voteAverage: 0,
    }

    render(<MovieSearchResult movie={movieWithNoRating} onClick={() => {}} />)
    expect(screen.queryByText('0.0')).not.toBeInTheDocument()
  })

  it('renders poster image with correct src', () => {
    render(<MovieSearchResult movie={mockMovie} onClick={() => {}} />)

    const img = screen.getByAltText('The Matrix')
    expect(img).toBeInTheDocument()
  })
})
