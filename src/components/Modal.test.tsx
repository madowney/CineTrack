import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './Modal'

describe('Modal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
  })

  it('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )

    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('displays the title', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="My Modal Title">
        <p>Content</p>
      </Modal>
    )

    expect(screen.getByText('My Modal Title')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <button>Action Button</button>
        <p>Some text content</p>
      </Modal>
    )

    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    expect(screen.getByText('Some text content')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <p>Content</p>
      </Modal>
    )

    // Find the close button (X button in the modal header)
    const buttons = screen.getAllByRole('button')
    const closeButton = buttons[0] // First button should be the X close button
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <p>Content</p>
      </Modal>
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <p>Content</p>
      </Modal>
    )

    // The backdrop has the class bg-black bg-opacity-50
    const backdrop = document.querySelector('.bg-black.bg-opacity-50')
    if (backdrop) {
      fireEvent.click(backdrop)
    }

    expect(mockOnClose).toHaveBeenCalled()
  })
})
