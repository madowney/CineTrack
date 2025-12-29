import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StarRating, DisplayRating } from './StarRating'

describe('StarRating', () => {
  it('renders 5 stars by default', () => {
    render(<StarRating rating={0} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
  })

  it('renders custom number of stars', () => {
    render(<StarRating rating={0} maxRating={10} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(10)
  })

  it('shows rating value when showValue is true', () => {
    render(<StarRating rating={3.5} showValue />)
    expect(screen.getByText('3.5')).toBeInTheDocument()
  })

  it('shows label when provided', () => {
    render(<StarRating rating={3} label="Your Rating" />)
    expect(screen.getByText('Your Rating')).toBeInTheDocument()
  })

  it('calls onChange when star is clicked', () => {
    const handleChange = vi.fn()
    render(<StarRating rating={0} onChange={handleChange} />)

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[2]) // Click third star

    expect(handleChange).toHaveBeenCalled()
  })

  it('does not call onChange when readonly', () => {
    const handleChange = vi.fn()
    render(<StarRating rating={3} readonly onChange={handleChange} />)

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])

    expect(handleChange).not.toHaveBeenCalled()
  })

  it('disables buttons when readonly', () => {
    render(<StarRating rating={3} readonly />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('applies small size class', () => {
    render(<StarRating rating={3} size="sm" />)
    const buttons = screen.getAllByRole('button')
    // Check that the button contains the small size class
    expect(buttons[0].className).toContain('w-4')
    expect(buttons[0].className).toContain('h-4')
  })

  it('applies large size class', () => {
    render(<StarRating rating={3} size="lg" />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0].className).toContain('w-6')
    expect(buttons[0].className).toContain('h-6')
  })

  it('has correct aria-label on each star', () => {
    render(<StarRating rating={3} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveAttribute('aria-label', 'Rate 1 stars')
    expect(buttons[4]).toHaveAttribute('aria-label', 'Rate 5 stars')
  })
})

describe('DisplayRating', () => {
  it('renders with rating value', () => {
    render(<DisplayRating rating={8.5} />)
    // 8.5 out of 10 = 4.25 out of 5
    expect(screen.getByText('4.3')).toBeInTheDocument()
  })

  it('normalizes 10-point scale to 5-point scale', () => {
    render(<DisplayRating rating={10} maxRating={10} />)
    expect(screen.getByText('5.0')).toBeInTheDocument()
  })

  it('does not normalize when maxRating is 5', () => {
    render(<DisplayRating rating={4.5} maxRating={5} />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })

  it('hides value when showValue is false', () => {
    render(<DisplayRating rating={8.5} showValue={false} />)
    expect(screen.queryByText('4.3')).not.toBeInTheDocument()
  })

  it('applies small size class', () => {
    render(<DisplayRating rating={8} size="sm" />)
    const svg = document.querySelector('svg')
    expect(svg?.getAttribute('class')).toContain('w-4')
    expect(svg?.getAttribute('class')).toContain('h-4')
  })

  it('applies large size class', () => {
    render(<DisplayRating rating={8} size="lg" />)
    const svg = document.querySelector('svg')
    expect(svg?.getAttribute('class')).toContain('w-6')
    expect(svg?.getAttribute('class')).toContain('h-6')
  })
})
