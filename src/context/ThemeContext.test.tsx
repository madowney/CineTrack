import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from './ThemeContext'

// Test component that uses the theme context
function TestComponent() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.getItem = vi.fn().mockReturnValue(null)
    window.localStorage.setItem = vi.fn()
    document.documentElement.classList.remove('dark')
  })

  it('provides default light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('toggles theme from light to dark', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('toggles theme from dark to light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const button = screen.getByRole('button')

    // Toggle to dark
    fireEvent.click(button)
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')

    // Toggle back to light
    fireEvent.click(button)
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('persists theme to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('loads saved theme from localStorage', () => {
    window.localStorage.getItem = vi.fn().mockReturnValue('dark')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('respects system preference when no saved theme', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('throws error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    )

    consoleSpy.mockRestore()
  })
})
