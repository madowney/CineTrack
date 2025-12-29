-- Migration: Add TMDB fields to movies table
-- This adds TMDB-specific fields to enrich movie data

-- Add TMDB-specific columns to existing movies table
ALTER TABLE public.movies
ADD COLUMN IF NOT EXISTS tmdb_id INTEGER UNIQUE,
ADD COLUMN IF NOT EXISTS imdb_id TEXT,
ADD COLUMN IF NOT EXISTS overview TEXT,
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS backdrop_url TEXT,
ADD COLUMN IF NOT EXISTS runtime INTEGER,
ADD COLUMN IF NOT EXISTS release_date DATE,
ADD COLUMN IF NOT EXISTS director TEXT,
ADD COLUMN IF NOT EXISTS cast_members JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS crew_members JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS genres JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS production_companies JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS vote_average DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS vote_count INTEGER,
ADD COLUMN IF NOT EXISTS popularity DECIMAL(10,3),
ADD COLUMN IF NOT EXISTS mpaa_rating TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Released',
ADD COLUMN IF NOT EXISTS tmdb_last_fetched TIMESTAMPTZ;

-- Create index on tmdb_id for faster lookups
CREATE INDEX IF NOT EXISTS movies_tmdb_id_idx ON public.movies(tmdb_id);

-- Create index on imdb_id for lookups
CREATE INDEX IF NOT EXISTS movies_imdb_id_idx ON public.movies(imdb_id);

-- Create GIN index on genres for genre-based queries
CREATE INDEX IF NOT EXISTS movies_genres_idx ON public.movies USING gin(genres);

-- Add comments for documentation
COMMENT ON COLUMN public.movies.tmdb_id IS 'The Movie Database (TMDB) unique identifier';
COMMENT ON COLUMN public.movies.imdb_id IS 'IMDB unique identifier (e.g., tt1234567)';
COMMENT ON COLUMN public.movies.overview IS 'Movie synopsis/plot summary from TMDB';
COMMENT ON COLUMN public.movies.tagline IS 'Movie tagline from TMDB';
COMMENT ON COLUMN public.movies.backdrop_url IS 'Full URL to movie backdrop image';
COMMENT ON COLUMN public.movies.runtime IS 'Runtime in minutes';
COMMENT ON COLUMN public.movies.release_date IS 'Original theatrical release date';
COMMENT ON COLUMN public.movies.director IS 'Primary director name';
COMMENT ON COLUMN public.movies.cast_members IS 'JSON array of cast members with id, name, character, profile_path, order';
COMMENT ON COLUMN public.movies.crew_members IS 'JSON array of crew members with id, name, job, department';
COMMENT ON COLUMN public.movies.genres IS 'JSON array of genres with id and name';
COMMENT ON COLUMN public.movies.production_companies IS 'JSON array of production companies';
COMMENT ON COLUMN public.movies.vote_average IS 'TMDB average user rating (0-10)';
COMMENT ON COLUMN public.movies.vote_count IS 'Number of TMDB user votes';
COMMENT ON COLUMN public.movies.popularity IS 'TMDB popularity score';
COMMENT ON COLUMN public.movies.mpaa_rating IS 'MPAA content rating (G, PG, PG-13, R, NC-17)';
COMMENT ON COLUMN public.movies.status IS 'Release status (Released, Post Production, etc.)';
COMMENT ON COLUMN public.movies.tmdb_last_fetched IS 'Timestamp of last TMDB data fetch for cache invalidation';
