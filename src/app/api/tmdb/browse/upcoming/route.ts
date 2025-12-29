import { NextRequest, NextResponse } from 'next/server'
import { getUpcomingMovies, transformMoviePreview } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1', 10)

  try {
    const results = await getUpcomingMovies(page)

    return NextResponse.json({
      page: results.page,
      totalPages: results.total_pages,
      totalResults: results.total_results,
      results: results.results.map(transformMoviePreview),
    })
  } catch (error) {
    console.error('TMDB upcoming movies error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming movies' },
      { status: 500 }
    )
  }
}
