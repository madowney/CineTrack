export interface DashboardStats {
  totalMovies: number
  watchedCount: number
  unwatchedCount: number
  averageRating: number | null
  totalHoursWatched: number
}

export interface GenreStat {
  genre: string
  count: number
  percentage: number
}
