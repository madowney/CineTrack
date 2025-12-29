import { BrowseTabs } from '@/components/browse/BrowseTabs'

export const metadata = {
  title: 'Browse Movies - CineTrack',
  description: 'Discover and browse movies',
}

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Movies</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Discover new movies and add them to your collection
        </p>
      </div>

      <BrowseTabs />

      <div className="mt-6">{children}</div>
    </div>
  )
}
