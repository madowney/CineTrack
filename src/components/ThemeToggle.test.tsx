import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'
import { ThemeProvider } from '@/context/ThemeContext'

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.getItem = vi.fn().mockReturnValue(null)
    window.localStorage.setItem = vi.fn()
  })

  it('renders correctly', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('has correct aria-label for light mode', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
  })

  it('toggles theme when clicked', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button')

    // Initially light mode
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')

    // Click to toggle to dark mode
    fireEvent.click(button)

    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
  })

  it('persists theme to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })
})
