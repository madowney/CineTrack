'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { name: 'Discover', href: '/browse' },
  { name: 'Popular', href: '/browse/popular' },
  { name: 'Top Rated', href: '/browse/top-rated' },
  { name: 'Now Playing', href: '/browse/now-playing' },
  { name: 'Upcoming', href: '/browse/upcoming' },
  { name: 'By Genre', href: '/browse/genres' },
]

export function BrowseTabs() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/browse') {
      return pathname === '/browse'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Browse tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              isActive(tab.href)
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
