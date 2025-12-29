import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MovieList } from './MovieList'
import { mockMovies, createMockSupabaseClient } from '@/test/mocks/supabase'

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => createMockSupabaseClient()),
}))

// Mock useAuth
const mockUseAuth = vi.fn()
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('MovieList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: authenticated user
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      isLoading: false,
    })
  })

  it('renders loading state initially', () => {
    // Set auth to loading state
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
    })

    render(<MovieList />)

    // Should show loading spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders movies after loading', async () => {
    render(<MovieList />)

    await waitFor(() => {
      expect(screen.getByText('The Matrix')).toBeInTheDocument()
      expect(screen.getByText('Inception')).toBeInTheDocument()
    })
  })

  it('renders filter buttons', async () => {
    render(<MovieList />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Watched' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Unwatched' })).toBeInTheDocument()
    })
  })

  it('renders Add Movie button', async () => {
    render(<MovieList />)

    await waitFor(() => {
      expect(screen.getByText('Add Movie')).toBeInTheDocument()
    })
  })

  it('filters movies by watched status', async () => {
    render(<MovieList />)

    await waitFor(() => {
      expect(screen.getByText('The Matrix')).toBeInTheDocument()
    })

    // Click "Watched" filter button
    fireEvent.click(screen.getByRole('button', { name: 'Watched' }))

    // Only watched movie should be visible
    expect(screen.getByText('The Matrix')).toBeInTheDocument()
    expect(screen.queryByText('Inception')).not.toBeInTheDocument()
  })

  it('filters movies by unwatched status', async () => {
    render(<MovieList />)

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument()
    })

    // Click "Unwatched" filter
    fireEvent.click(screen.getByText('Unwatched'))

    // Only unwatched movie should be visible
    expect(screen.getByText('Inception')).toBeInTheDocument()
    expect(screen.queryByText('The Matrix')).not.toBeInTheDocument()
  })

  it('opens modal when Add Movie is clicked', async () => {
    render(<MovieList />)

    await waitFor(() => {
      expect(screen.getByText('Add Movie')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Add Movie'))

    expect(screen.getByRole('heading', { name: 'Add Movie' })).toBeInTheDocument()
  })

  it('shows empty state message when no movies', async () => {
    // Mock empty response
    const { createClient } = await import('@/lib/supabase/client')
    vi.mocked(createClient).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    } as any)

    render(<MovieList />)

    await waitFor(() => {
      expect(screen.getByText('No movies found')).toBeInTheDocument()
    })
  })
})
