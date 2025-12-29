import { NextRequest, NextResponse } from 'next/server'
import { getPopularMovies, transformMoviePreview } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1', 10)

  try {
    const results = await getPopularMovies(page)

    return NextResponse.json({
      page: results.page,
      totalPages: results.total_pages,
      totalResults: results.total_results,
      results: results.results.map(transformMoviePreview),
    })
  } catch (error) {
    console.error('TMDB popular movies error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular movies' },
      { status: 500 }
    )
  }
}
