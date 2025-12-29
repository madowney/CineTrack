import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from './RegisterForm'

// Mock useAuth
const mockSignUp = vi.fn()
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
  }),
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSignUp.mockResolvedValue({ error: null })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders register form with all fields', () => {
    render(<RegisterForm />)

    expect(screen.getByPlaceholderText('Display name (optional)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password (min. 8 characters)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument()
  })

  it('renders sign in link', () => {
    render(<RegisterForm />)

    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('updates field values on typing', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await user.type(screen.getByPlaceholderText('Display name (optional)'), 'Test User')
    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password (min. 8 characters)'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')

    expect(screen.getByPlaceholderText('Display name (optional)')).toHaveValue('Test User')
    expect(screen.getByPlaceholderText('Email address')).toHaveValue('test@example.com')
    expect(screen.getByPlaceholderText('Password (min. 8 characters)')).toHaveValue('password123')
    expect(screen.getByPlaceholderText('Confirm password')).toHaveValue('password123')
  })

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password (min. 8 characters)'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password456')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('shows error when password is too short', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password (min. 8 characters)'), 'short')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'short')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument()
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('calls signUp on valid form submission', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await user.type(screen.getByPlaceholderText('Display name (optional)'), 'Test User')
    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password (min. 8 characters)'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User')
    })
  })

  it('calls signUp without display name when not provided', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password (min. 8 characters)'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123', undefined)
    })
  })

  it('shows success message after successful registration', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password (min. 8 characters)'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(screen.getByText('Check your email')).toBeInTheDocument()
    })

    expect(screen.getByText(/confirmation email/)).toBeInTheDocument()
    expect(screen.getByText('Back to login')).toBeInTheDocument()
  })

  it('shows error message on registration failure', async () => {
    mockSignUp.mockResolvedValue({ error: { message: 'User already registered' } })

    const user = userEvent.setup()
    render(<RegisterForm />)

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password (min. 8 characters)'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(screen.getByText('User already registered')).toBeInTheDocument()
    })
  })

  it('shows loading state while creating account', async () => {
    mockSignUp.mockImplementation(() => new Promise(() => {}))

    const user = userEvent.setup()
    render(<RegisterForm />)

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password (min. 8 characters)'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText('Creating account...')).toBeInTheDocument()
  })

  it('disables submit button while loading', async () => {
    mockSignUp.mockImplementation(() => new Promise(() => {}))

    const user = userEvent.setup()
    render(<RegisterForm />)

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Password (min. 8 characters)'), 'password123')
    await user.type(screen.getByPlaceholderText('Confirm password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
