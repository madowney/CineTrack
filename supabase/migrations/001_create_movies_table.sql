-- Create movies table
CREATE TABLE IF NOT EXISTS public.movies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    title TEXT NOT NULL,
    year INTEGER,
    genre TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    watched BOOLEAN DEFAULT FALSE NOT NULL,
    notes TEXT,
    poster_url TEXT
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_movies_updated_at
    BEFORE UPDATE ON public.movies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (for demo purposes)
CREATE POLICY "Allow public access" ON public.movies
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS movies_watched_idx ON public.movies(watched);
CREATE INDEX IF NOT EXISTS movies_rating_idx ON public.movies(rating);
CREATE INDEX IF NOT EXISTS movies_title_idx ON public.movies(title);
