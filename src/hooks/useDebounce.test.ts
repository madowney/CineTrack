import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    // Update the value
    rerender({ value: 'updated', delay: 500 })

    // Value should not have changed yet
    expect(result.current).toBe('initial')

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Now the value should be updated
    expect(result.current).toBe('updated')
  })

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    )

    // Rapid changes
    rerender({ value: 'ab', delay: 300 })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: 'abc', delay: 300 })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: 'abcd', delay: 300 })

    // Value should still be 'a' since timer keeps resetting
    expect(result.current).toBe('a')

    // Wait full delay
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Should be the final value
    expect(result.current).toBe('abcd')
  })

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 1000 } }
    )

    rerender({ value: 'new value', delay: 1000 })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Not enough time has passed
    expect(result.current).toBe('test')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Now it should update
    expect(result.current).toBe('new value')
  })

  it('should work with different types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 42, delay: 100 } }
    )

    expect(result.current).toBe(42)

    rerender({ value: 100, delay: 100 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe(100)
  })

  it('should work with objects', () => {
    const initialObj = { name: 'test' }
    const updatedObj = { name: 'updated' }

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 200 } }
    )

    expect(result.current).toEqual(initialObj)

    rerender({ value: updatedObj, delay: 200 })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toEqual(updatedObj)
  })
})
