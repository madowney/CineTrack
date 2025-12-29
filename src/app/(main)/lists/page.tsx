'use client'

import Link from 'next/link'
import { useLists } from '@/hooks/useLists'
import { useAuth } from '@/context/AuthContext'
import type { ListType } from '@/types/database'

const listTypeInfo: Record<ListType, { icon: string; description: string; href: string }> = {
  watched: {
    icon: '✓',
    description: 'Movies you have watched',
    href: '/lists/watched',
  },
  want_to_watch: {
    icon: '📋',
    description: 'Movies you want to watch',
    href: '/lists/want-to-watch',
  },
  owned: {
    icon: '📀',
    description: 'Movies you own',
    href: '/lists/owned',
  },
  custom: {
    icon: '📁',
    description: 'Your custom list',
    href: '/lists',
  },
}

export default function ListsOverviewPage() {
  const { user } = useAuth()
  const { lists, isLoading } = useLists()

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Please sign in to view your lists.
        </p>
        <Link
          href="/login?redirectTo=/lists"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Sign In
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse"
          >
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  const systemLists = lists.filter((list) => list.is_system)
  const customLists = lists.filter((list) => !list.is_system)

  return (
    <div className="space-y-8">
      {/* System Lists */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Lists
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemLists.map((list) => {
            const info = listTypeInfo[list.list_type]
            return (
              <Link
                key={list.id}
                href={info.href}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6 block"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl">{info.icon}</span>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                      {list.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {info.description}
                    </p>
                  </div>
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-2.5 py-0.5 rounded">
                    {list.item_count}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Custom Lists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Custom Lists
          </h2>
          <button
            type="button"
            className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 border border-indigo-600 dark:border-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            + New List
          </button>
        </div>

        {customLists.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              You haven&apos;t created any custom lists yet.
            </p>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create Your First List
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customLists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6 block"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl">📁</span>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                      {list.name}
                    </h3>
                    {list.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {list.description}
                      </p>
                    )}
                  </div>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium px-2.5 py-0.5 rounded">
                    {list.item_count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
