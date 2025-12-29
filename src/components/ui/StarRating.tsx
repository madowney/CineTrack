'use client'

import { useState, useCallback } from 'react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  onChange?: (rating: number) => void
  showValue?: boolean
  label?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

const gapClasses = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  readonly = false,
  onChange,
  showValue = false,
  label,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const displayRating = hoverRating !== null ? hoverRating : rating

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
      if (readonly) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const isHalf = x < rect.width / 2

      setHoverRating(starIndex + (isHalf ? 0.5 : 1))
    },
    [readonly]
  )

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
      if (readonly || !onChange) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const isHalf = x < rect.width / 2

      const newRating = starIndex + (isHalf ? 0.5 : 1)
      onChange(newRating)
    },
    [readonly, onChange]
  )

  const handleMouseLeave = useCallback(() => {
    if (!readonly) {
      setHoverRating(null)
    }
  }, [readonly])

  const renderStar = (starIndex: number) => {
    const fillPercentage = Math.min(Math.max(displayRating - starIndex, 0), 1) * 100

    return (
      <button
        key={starIndex}
        type="button"
        className={`relative ${sizeClasses[size]} ${
          readonly ? 'cursor-default' : 'cursor-pointer'
        } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded-sm`}
        onMouseMove={(e) => handleMouseMove(e, starIndex)}
        onClick={(e) => handleClick(e, starIndex)}
        disabled={readonly}
        aria-label={`Rate ${starIndex + 1} stars`}
      >
        {/* Background star (empty) */}
        <svg
          className={`absolute inset-0 ${sizeClasses[size]} text-gray-300 dark:text-gray-600`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>

        {/* Foreground star (filled) with clip */}
        <svg
          className={`absolute inset-0 ${sizeClasses[size]} text-yellow-400`}
          fill="currentColor"
          viewBox="0 0 20 20"
          style={{
            clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
          }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="flex items-center">
      {label && (
        <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">{label}</span>
      )}
      <div
        className={`flex ${gapClasses[size]}`}
        onMouseLeave={handleMouseLeave}
        role="group"
        aria-label={label || 'Rating'}
      >
        {Array.from({ length: maxRating }, (_, i) => renderStar(i))}
      </div>
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

// Display-only star rating for showing TMDB ratings
interface DisplayRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export function DisplayRating({
  rating,
  maxRating = 10,
  size = 'sm',
  showValue = true,
}: DisplayRatingProps) {
  // Convert to 5-star scale if maxRating is 10
  const normalizedRating = maxRating === 10 ? rating / 2 : rating

  return (
    <div className="flex items-center">
      <svg
        className={`${sizeClasses[size]} text-yellow-400 mr-1`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {normalizedRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
