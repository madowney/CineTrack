import { NextRequest, NextResponse } from 'next/server'
import { getMovieDetails, transformMovieDetails } from '@/lib/tmdb'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  const movieId = parseInt(id, 10)

  if (isNaN(movieId)) {
    return NextResponse.json(
      { error: 'Invalid movie ID' },
      { status: 400 }
    )
  }

  try {
    const movie = await getMovieDetails(movieId)
    const transformed = transformMovieDetails(movie)

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('TMDB movie details error:', error)

    // Check if it's a 404 from TMDB
    if (error instanceof Error && error.message.includes('404')) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    )
  }
}
