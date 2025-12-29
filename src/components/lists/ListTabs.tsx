'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLists } from '@/hooks/useLists'
import type { ListType } from '@/types/database'

interface TabItem {
  name: string
  href: string
  icon: string
  type?: ListType
  count?: number
}

const systemTabs: TabItem[] = [
  { name: 'All', href: '/lists', icon: '📚' },
  { name: 'Watched', href: '/lists/watched', icon: '✓', type: 'watched' },
  { name: 'Want to Watch', href: '/lists/want-to-watch', icon: '📋', type: 'want_to_watch' },
  { name: 'Owned', href: '/lists/owned', icon: '📀', type: 'owned' },
]

export function ListTabs() {
  const pathname = usePathname()
  const { lists, isLoading } = useLists()

  // Get item counts for system lists
  const getListCount = (type: ListType | undefined): number | undefined => {
    if (!type) return undefined
    const list = lists.find((l) => l.list_type === type && l.is_system)
    return list?.item_count
  }

  const tabs = systemTabs.map((tab) => ({
    ...tab,
    count: getListCount(tab.type),
  }))

  const customLists = lists.filter((list) => !list.is_system)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Lists">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                isActive
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              {!isLoading && tab.count !== undefined && (
                <span
                  className={`ml-1 py-0.5 px-2 rounded-full text-xs ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          )
        })}

        {/* Custom lists dropdown or additional tabs */}
        {customLists.length > 0 && (
          <div className="relative group">
            <button
              type="button"
              className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-2"
            >
              <span>📁</span>
              <span>Custom Lists</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 z-50 hidden group-hover:block">
              {customLists.map((list) => {
                const isActive = pathname === `/lists/${list.id}`
                return (
                  <Link
                    key={list.id}
                    href={`/lists/${list.id}`}
                    className={`block px-4 py-2 text-sm ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="truncate">{list.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {list.item_count}
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
