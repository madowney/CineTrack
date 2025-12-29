-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    favorite_genres TEXT[] DEFAULT '{}',
    preferences JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create a trigger function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NULL)
    );
    RETURN NEW;
END;
$$;

-- Create trigger to call the function on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Add updated_at trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add user_id column to movies table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'movies'
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.movies ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create index on movies.user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_movies_user_id ON public.movies(user_id);

-- Update RLS policies for movies to be user-specific
-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on movies" ON public.movies;
DROP POLICY IF EXISTS "Users can view their own movies" ON public.movies;
DROP POLICY IF EXISTS "Users can insert their own movies" ON public.movies;
DROP POLICY IF EXISTS "Users can update their own movies" ON public.movies;
DROP POLICY IF EXISTS "Users can delete their own movies" ON public.movies;
DROP POLICY IF EXISTS "Allow public read access to movies" ON public.movies;

-- Create user-specific policies for movies
CREATE POLICY "Users can view their own movies"
    ON public.movies
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own movies"
    ON public.movies
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own movies"
    ON public.movies
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own movies"
    ON public.movies
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add a comment to explain the migration
COMMENT ON TABLE public.profiles IS 'User profiles with preferences and metadata, auto-created on signup';
