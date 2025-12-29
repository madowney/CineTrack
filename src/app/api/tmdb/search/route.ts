import { NextRequest, NextResponse } from 'next/server'
import { searchMovies, transformMoviePreview } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const page = parseInt(searchParams.get('page') || '1', 10)

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    )
  }

  try {
    const results = await searchMovies(query, page)

    return NextResponse.json({
      page: results.page,
      totalPages: results.total_pages,
      totalResults: results.total_results,
      results: results.results.map(transformMoviePreview),
    })
  } catch (error) {
    console.error('TMDB search error:', error)
    return NextResponse.json(
      { error: 'Failed to search movies' },
      { status: 500 }
    )
  }
}
