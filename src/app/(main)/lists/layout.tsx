import { ListTabs } from '@/components/lists/ListTabs'

export const metadata = {
  title: 'My Lists - CineTrack',
  description: 'Manage your movie lists',
}

export default function ListsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Lists</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Organize and track your movie collection
        </p>
      </div>

      <ListTabs />

      <div className="mt-6">{children}</div>
    </div>
  )
}
