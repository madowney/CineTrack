'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { QuickStats, WatchlistPreview, RecentlyWatched } from '@/components/dashboard'
import { calculateDashboardStats } from '@/lib/stats'
import type { Movie } from '@/types/database'
import type { DashboardStats } from '@/lib/stats'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalMovies: 0,
    watchedCount: 0,
    unwatchedCount: 0,
    averageRating: null,
    totalHoursWatched: 0,
  })

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setIsLoading(false)
      return
    }

    const fetchMovies = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching movies:', error)
        setIsLoading(false)
        return
      }

      setMovies(data || [])
      setStats(calculateDashboardStats(data || []))
      setIsLoading(false)
    }

    fetchMovies()
  }, [user, authLoading])

  // Show welcome page for non-authenticated users
  if (!authLoading && !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to CineTrack
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Track your movie collection, discover new films, and keep a record of everything you&apos;ve watched.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 border border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Track Movies
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep track of what you&apos;ve watched and want to watch
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Rate & Review
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rate movies and add personal notes
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Discover
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse popular movies and find your next watch
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const watchedMovies = movies.filter((m) => m.watched)
  const unwatchedMovies = movies.filter((m) => !m.watched)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here&apos;s an overview of your movie collection.
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={stats} isLoading={isLoading} />

      {/* Main content grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WatchlistPreview movies={unwatchedMovies} isLoading={isLoading} />
        <RecentlyWatched movies={watchedMovies} isLoading={isLoading} />
      </div>

      {/* Quick actions */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/browse"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Movies
          </Link>
          <Link
            href="/lists"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            My Lists
          </Link>
        </div>
      </div>
    </div>
  )
}
