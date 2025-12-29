import { NextRequest, NextResponse } from 'next/server'
import { discoverMovies, transformMoviePreview } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1', 10)
  const genreId = searchParams.get('genreId')
  const year = searchParams.get('year')
  const sortBy = searchParams.get('sortBy') as 'popularity' | 'release_date' | 'vote_average' | null
  const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | null
  const minRating = searchParams.get('minRating')
  const minVotes = searchParams.get('minVotes')

  try {
    const results = await discoverMovies({
      page,
      genreId: genreId ? parseInt(genreId, 10) : undefined,
      year: year ? parseInt(year, 10) : undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      minVotes: minVotes ? parseInt(minVotes, 10) : undefined,
    })

    return NextResponse.json({
      page: results.page,
      totalPages: results.total_pages,
      totalResults: results.total_results,
      results: results.results.map(transformMoviePreview),
    })
  } catch (error) {
    console.error('TMDB discover movies error:', error)
    return NextResponse.json(
      { error: 'Failed to discover movies' },
      { status: 500 }
    )
  }
}
