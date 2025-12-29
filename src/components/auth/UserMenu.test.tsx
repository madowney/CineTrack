import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserMenu } from './UserMenu'

// Mock useRouter
const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

// Mock useAuth
const mockSignOut = vi.fn()
const mockUseAuth = vi.fn()
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSignOut.mockResolvedValue({ error: null })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      signOut: mockSignOut,
    })

    render(<UserMenu />)

    // Loading state shows a placeholder
    const loadingElement = document.querySelector('.animate-pulse')
    expect(loadingElement).toBeInTheDocument()
  })

  it('shows sign in and sign up buttons when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      signOut: mockSignOut,
    })

    render(<UserMenu />)

    expect(screen.getByText('Sign in')).toBeInTheDocument()
    expect(screen.getByText('Sign up')).toBeInTheDocument()
  })

  it('shows user avatar when authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: {
        email: 'test@example.com',
        user_metadata: { display_name: 'Test User' },
      },
      isLoading: false,
      signOut: mockSignOut,
    })

    render(<UserMenu />)

    // Should show initials TU for "Test User"
    expect(screen.getByText('TU')).toBeInTheDocument()
  })

  it('shows email first letter when no display name', () => {
    mockUseAuth.mockReturnValue({
      user: {
        email: 'test@example.com',
        user_metadata: {},
      },
      isLoading: false,
      signOut: mockSignOut,
    })

    render(<UserMenu />)

    // Should show T for first letter of email (split by space, so just first char)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('opens dropdown menu on click', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        email: 'test@example.com',
        user_metadata: { display_name: 'Test User' },
      },
      isLoading: false,
      signOut: mockSignOut,
    })

    const user = userEvent.setup()
    render(<UserMenu />)

    await user.click(screen.getByText('TU'))

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('My Lists')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Sign out')).toBeInTheDocument()
  })

  it('closes dropdown menu on second click', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        email: 'test@example.com',
        user_metadata: { display_name: 'Test User' },
      },
      isLoading: false,
      signOut: mockSignOut,
    })

    const user = userEvent.setup()
    render(<UserMenu />)

    // Open menu
    await user.click(screen.getByText('TU'))
    expect(screen.getByText('My Lists')).toBeInTheDocument()

    // Close menu
    await user.click(screen.getByText('TU'))
    expect(screen.queryByText('My Lists')).not.toBeInTheDocument()
  })

  it('calls signOut when sign out button is clicked', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        email: 'test@example.com',
        user_metadata: { display_name: 'Test User' },
      },
      isLoading: false,
      signOut: mockSignOut,
    })

    const user = userEvent.setup()
    render(<UserMenu />)

    // Open menu
    await user.click(screen.getByText('TU'))

    // Click sign out
    await user.click(screen.getByText('Sign out'))

    expect(mockSignOut).toHaveBeenCalled()
  })

  it('redirects to home after sign out', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        email: 'test@example.com',
        user_metadata: { display_name: 'Test User' },
      },
      isLoading: false,
      signOut: mockSignOut,
    })

    const user = userEvent.setup()
    render(<UserMenu />)

    await user.click(screen.getByText('TU'))
    await user.click(screen.getByText('Sign out'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('closes menu when clicking a link', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        email: 'test@example.com',
        user_metadata: { display_name: 'Test User' },
      },
      isLoading: false,
      signOut: mockSignOut,
    })

    const user = userEvent.setup()
    render(<UserMenu />)

    await user.click(screen.getByText('TU'))

    // Click My Lists link
    await user.click(screen.getByText('My Lists'))

    // Menu should be closed
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
  })

  it('closes menu when clicking outside', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        email: 'test@example.com',
        user_metadata: { display_name: 'Test User' },
      },
      isLoading: false,
      signOut: mockSignOut,
    })

    const user = userEvent.setup()
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <UserMenu />
      </div>
    )

    // Open menu
    await user.click(screen.getByText('TU'))
    expect(screen.getByText('My Lists')).toBeInTheDocument()

    // Click outside
    await user.click(screen.getByTestId('outside'))

    // Menu should be closed
    expect(screen.queryByText('My Lists')).not.toBeInTheDocument()
  })

  it('shows "User" when no display name in metadata', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        email: 'test@example.com',
        user_metadata: {},
      },
      isLoading: false,
      signOut: mockSignOut,
    })

    const user = userEvent.setup()
    render(<UserMenu />)

    await user.click(screen.getByText('T'))

    // Should show "User" as fallback display name
    expect(screen.getByText('User')).toBeInTheDocument()
  })
})
