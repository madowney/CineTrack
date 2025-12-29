-- Create list_type enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'list_type') THEN
        CREATE TYPE list_type AS ENUM ('watched', 'want_to_watch', 'owned', 'custom');
    END IF;
END $$;

-- Create lists table
CREATE TABLE IF NOT EXISTS public.lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    list_type list_type NOT NULL DEFAULT 'custom',
    is_system BOOLEAN DEFAULT FALSE NOT NULL,
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    cover_image_url TEXT,
    item_count INTEGER DEFAULT 0 NOT NULL
);

-- Create list_items table
CREATE TABLE IF NOT EXISTS public.list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    list_id UUID REFERENCES public.lists(id) ON DELETE CASCADE NOT NULL,
    tmdb_movie_id INTEGER NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    notes TEXT,
    owned_formats TEXT[] DEFAULT '{}',
    UNIQUE(list_id, tmdb_movie_id)
);

-- Create user_movies table for ratings and personal data
CREATE TABLE IF NOT EXISTS public.user_movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tmdb_movie_id INTEGER NOT NULL,
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),
    rating_rewatchability DECIMAL(2, 1) CHECK (rating_rewatchability >= 0 AND rating_rewatchability <= 5),
    rating_emotional DECIMAL(2, 1) CHECK (rating_emotional >= 0 AND rating_emotional <= 5),
    rating_visual DECIMAL(2, 1) CHECK (rating_visual >= 0 AND rating_visual <= 5),
    watch_count INTEGER DEFAULT 0 NOT NULL,
    first_watched_at TIMESTAMPTZ,
    last_watched_at TIMESTAMPTZ,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
    UNIQUE(user_id, tmdb_movie_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lists_user_id ON public.lists(user_id);
CREATE INDEX IF NOT EXISTS idx_lists_list_type ON public.lists(list_type);
CREATE INDEX IF NOT EXISTS idx_list_items_list_id ON public.list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_list_items_tmdb_movie_id ON public.list_items(tmdb_movie_id);
CREATE INDEX IF NOT EXISTS idx_user_movies_user_id ON public.user_movies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_movies_tmdb_movie_id ON public.user_movies(tmdb_movie_id);

-- Enable Row Level Security
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_movies ENABLE ROW LEVEL SECURITY;

-- Lists policies
CREATE POLICY "Users can view their own lists"
    ON public.lists
    FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own lists"
    ON public.lists
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists"
    ON public.lists
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own non-system lists"
    ON public.lists
    FOR DELETE
    USING (auth.uid() = user_id AND is_system = false);

-- List items policies
CREATE POLICY "Users can view items in their own lists or public lists"
    ON public.list_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.lists
            WHERE lists.id = list_items.list_id
            AND (lists.user_id = auth.uid() OR lists.is_public = true)
        )
    );

CREATE POLICY "Users can insert items to their own lists"
    ON public.list_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.lists
            WHERE lists.id = list_items.list_id
            AND lists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update items in their own lists"
    ON public.list_items
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.lists
            WHERE lists.id = list_items.list_id
            AND lists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete items from their own lists"
    ON public.list_items
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.lists
            WHERE lists.id = list_items.list_id
            AND lists.user_id = auth.uid()
        )
    );

-- User movies policies
CREATE POLICY "Users can view their own movie data"
    ON public.user_movies
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own movie data"
    ON public.user_movies
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own movie data"
    ON public.user_movies
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own movie data"
    ON public.user_movies
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add updated_at trigger to new tables
DROP TRIGGER IF EXISTS update_lists_updated_at ON public.lists;
CREATE TRIGGER update_lists_updated_at
    BEFORE UPDATE ON public.lists
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_movies_updated_at ON public.user_movies;
CREATE TRIGGER update_user_movies_updated_at
    BEFORE UPDATE ON public.user_movies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create default lists for new users
CREATE OR REPLACE FUNCTION public.create_default_lists()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    -- Create Watched list
    INSERT INTO public.lists (user_id, name, description, list_type, is_system)
    VALUES (NEW.id, 'Watched', 'Movies you have watched', 'watched', true);

    -- Create Want to Watch list
    INSERT INTO public.lists (user_id, name, description, list_type, is_system)
    VALUES (NEW.id, 'Want to Watch', 'Movies you want to watch', 'want_to_watch', true);

    -- Create Owned list
    INSERT INTO public.lists (user_id, name, description, list_type, is_system)
    VALUES (NEW.id, 'Owned', 'Movies you own', 'owned', true);

    RETURN NEW;
END;
$$;

-- Create trigger to create default lists on new profile
DROP TRIGGER IF EXISTS on_profile_created_create_lists ON public.profiles;
CREATE TRIGGER on_profile_created_create_lists
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.create_default_lists();

-- Function to update list item count
CREATE OR REPLACE FUNCTION public.update_list_item_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.lists SET item_count = item_count + 1 WHERE id = NEW.list_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.lists SET item_count = item_count - 1 WHERE id = OLD.list_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Create triggers for item count
DROP TRIGGER IF EXISTS on_list_item_insert ON public.list_items;
CREATE TRIGGER on_list_item_insert
    AFTER INSERT ON public.list_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_list_item_count();

DROP TRIGGER IF EXISTS on_list_item_delete ON public.list_items;
CREATE TRIGGER on_list_item_delete
    AFTER DELETE ON public.list_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_list_item_count();

-- Comments
COMMENT ON TABLE public.lists IS 'User movie lists including system lists (watched, want to watch, owned) and custom lists';
COMMENT ON TABLE public.list_items IS 'Items in user lists, linking movies to lists';
COMMENT ON TABLE public.user_movies IS 'User-specific movie data including ratings and watch history';
