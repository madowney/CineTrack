import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MovieSearchInput } from './MovieSearchInput'

// Mock the useTMDBSearch hook
vi.mock('@/hooks/useTMDBSearch', () => ({
  useTMDBSearch: vi.fn(),
}))

// Mock the useDebounce hook to return value immediately for testing
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}))

import { useTMDBSearch } from '@/hooks/useTMDBSearch'

const mockUseTMDBSearch = vi.mocked(useTMDBSearch)

const mockResults = [
  {
    tmdbId: 603,
    title: 'The Matrix',
    overview: 'A computer hacker learns about the true nature of reality.',
    posterUrl: 'https://image.tmdb.org/t/p/w342/poster.jpg',
    releaseDate: '1999-03-30',
    releaseYear: 1999,
    genreIds: [28, 878],
    voteAverage: 8.2,
    popularity: 100.5,
  },
  {
    tmdbId: 604,
    title: 'The Matrix Reloaded',
    overview: 'Neo and the rebels fight against the machines.',
    posterUrl: null,
    releaseDate: '2003-05-15',
    releaseYear: 2003,
    genreIds: [28, 878],
    voteAverage: 7.0,
    popularity: 80.2,
  },
]

describe('MovieSearchInput', () => {
  beforeEach(() => {
    mockUseTMDBSearch.mockReturnValue({
      results: [],
      totalResults: 0,
      totalPages: 0,
      page: 1,
      isLoading: false,
      isValidating: false,
      error: undefined,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input with placeholder', () => {
    render(<MovieSearchInput onSelect={() => {}} />)
    expect(screen.getByPlaceholderText('Search for a movie...')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<MovieSearchInput onSelect={() => {}} placeholder="Find movies" />)
    expect(screen.getByPlaceholderText('Find movies')).toBeInTheDocument()
  })

  it('updates input value on typing', async () => {
    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={() => {}} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'matrix')

    expect(input).toHaveValue('matrix')
  })

  it('shows loading state when searching', async () => {
    mockUseTMDBSearch.mockReturnValue({
      results: [],
      totalResults: 0,
      totalPages: 0,
      page: 1,
      isLoading: true,
      isValidating: false,
      error: undefined,
    })

    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={() => {}} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'matrix')

    expect(screen.getByText('Searching...')).toBeInTheDocument()
  })

  it('shows results when available', async () => {
    mockUseTMDBSearch.mockReturnValue({
      results: mockResults,
      totalResults: 2,
      totalPages: 1,
      page: 1,
      isLoading: false,
      isValidating: false,
      error: undefined,
    })

    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={() => {}} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'matrix')

    expect(screen.getByText('The Matrix')).toBeInTheDocument()
    expect(screen.getByText('The Matrix Reloaded')).toBeInTheDocument()
  })

  it('shows no results message when search returns empty', async () => {
    mockUseTMDBSearch.mockReturnValue({
      results: [],
      totalResults: 0,
      totalPages: 0,
      page: 1,
      isLoading: false,
      isValidating: false,
      error: undefined,
    })

    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={() => {}} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'xyznonexistent')

    expect(screen.getByText(/No movies found/)).toBeInTheDocument()
  })

  it('calls onSelect when a result is clicked', async () => {
    mockUseTMDBSearch.mockReturnValue({
      results: mockResults,
      totalResults: 2,
      totalPages: 1,
      page: 1,
      isLoading: false,
      isValidating: false,
      error: undefined,
    })

    const handleSelect = vi.fn()
    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={handleSelect} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'matrix')

    const firstResult = screen.getByText('The Matrix')
    await user.click(firstResult)

    expect(handleSelect).toHaveBeenCalledWith(mockResults[0])
  })

  it('clears input after selection', async () => {
    mockUseTMDBSearch.mockReturnValue({
      results: mockResults,
      totalResults: 2,
      totalPages: 1,
      page: 1,
      isLoading: false,
      isValidating: false,
      error: undefined,
    })

    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={() => {}} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'matrix')

    const firstResult = screen.getByText('The Matrix')
    await user.click(firstResult)

    expect(input).toHaveValue('')
  })

  it('shows error message when search fails', async () => {
    mockUseTMDBSearch.mockReturnValue({
      results: [],
      totalResults: 0,
      totalPages: 0,
      page: 1,
      isLoading: false,
      isValidating: false,
      error: new Error('API Error'),
    })

    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={() => {}} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'matrix')

    expect(screen.getByText(/Error searching movies/)).toBeInTheDocument()
  })

  it('does not show dropdown when query is less than 2 characters', async () => {
    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={() => {}} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'm')

    expect(screen.queryByText('Searching...')).not.toBeInTheDocument()
    expect(screen.queryByText('No movies found')).not.toBeInTheDocument()
  })

  it('shows clear button when input has value', async () => {
    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={() => {}} />)

    const input = screen.getByPlaceholderText('Search for a movie...')

    // Clear button should not be visible initially
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    await user.type(input, 'matrix')

    // Clear button should now be visible (it's the X icon button)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('clears input when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={() => {}} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'matrix')

    // Find and click the clear button (first button in the input container)
    const clearButton = screen.getAllByRole('button')[0]
    await user.click(clearButton)

    expect(input).toHaveValue('')
  })

  it('handles keyboard navigation - ArrowDown', async () => {
    mockUseTMDBSearch.mockReturnValue({
      results: mockResults,
      totalResults: 2,
      totalPages: 1,
      page: 1,
      isLoading: false,
      isValidating: false,
      error: undefined,
    })

    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={() => {}} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'matrix')

    // Press arrow down
    await user.keyboard('{ArrowDown}')

    // First item should be selected (has bg-gray-100 class)
    const buttons = screen.getAllByRole('button')
    // Filter to get only result buttons (not the clear button)
    const resultButtons = buttons.filter(btn => btn.textContent?.includes('Matrix'))
    expect(resultButtons[0].className).toContain('bg-gray-100')
  })

  it('handles keyboard navigation - Enter to select', async () => {
    mockUseTMDBSearch.mockReturnValue({
      results: mockResults,
      totalResults: 2,
      totalPages: 1,
      page: 1,
      isLoading: false,
      isValidating: false,
      error: undefined,
    })

    const handleSelect = vi.fn()
    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={handleSelect} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'matrix')

    // Navigate and select
    await user.keyboard('{ArrowDown}{Enter}')

    expect(handleSelect).toHaveBeenCalledWith(mockResults[0])
  })

  it('closes dropdown on Escape', async () => {
    mockUseTMDBSearch.mockReturnValue({
      results: mockResults,
      totalResults: 2,
      totalPages: 1,
      page: 1,
      isLoading: false,
      isValidating: false,
      error: undefined,
    })

    const user = userEvent.setup()
    render(<MovieSearchInput onSelect={() => {}} />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    await user.type(input, 'matrix')

    // Dropdown should be visible
    expect(screen.getByText('The Matrix')).toBeInTheDocument()

    // Press Escape
    await user.keyboard('{Escape}')

    // Dropdown should be closed
    expect(screen.queryByText('The Matrix')).not.toBeInTheDocument()
  })

  it('applies autoFocus when prop is true', () => {
    render(<MovieSearchInput onSelect={() => {}} autoFocus />)

    const input = screen.getByPlaceholderText('Search for a movie...')
    expect(document.activeElement).toBe(input)
  })
})
