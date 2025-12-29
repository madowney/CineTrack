export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// TMDB nested types for JSONB columns
export interface TMDBCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TMDBCrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system'
  defaultList?: string
  showRatings?: boolean
  [key: string]: Json | undefined
}

export type ListType = 'watched' | 'want_to_watch' | 'owned' | 'custom'

export type OwnedFormat = 'dvd' | 'bluray' | '4k' | 'digital' | 'vhs' | 'other'

export type Database = {
  public: {
    Tables: {
      movies: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          year: number | null
          genre: string | null
          rating: number | null
          watched: boolean
          notes: string | null
          poster_url: string | null
          // TMDB fields
          tmdb_id: number | null
          imdb_id: string | null
          overview: string | null
          tagline: string | null
          backdrop_url: string | null
          runtime: number | null
          release_date: string | null
          director: string | null
          cast_members: TMDBCastMember[]
          crew_members: TMDBCrewMember[]
          genres: TMDBGenre[]
          production_companies: TMDBProductionCompany[]
          vote_average: number | null
          vote_count: number | null
          popularity: number | null
          mpaa_rating: string | null
          status: string | null
          tmdb_last_fetched: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          year?: number | null
          genre?: string | null
          rating?: number | null
          watched?: boolean
          notes?: string | null
          poster_url?: string | null
          // TMDB fields
          tmdb_id?: number | null
          imdb_id?: string | null
          overview?: string | null
          tagline?: string | null
          backdrop_url?: string | null
          runtime?: number | null
          release_date?: string | null
          director?: string | null
          cast_members?: TMDBCastMember[]
          crew_members?: TMDBCrewMember[]
          genres?: TMDBGenre[]
          production_companies?: TMDBProductionCompany[]
          vote_average?: number | null
          vote_count?: number | null
          popularity?: number | null
          mpaa_rating?: string | null
          status?: string | null
          tmdb_last_fetched?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          year?: number | null
          genre?: string | null
          rating?: number | null
          watched?: boolean
          notes?: string | null
          poster_url?: string | null
          // TMDB fields
          tmdb_id?: number | null
          imdb_id?: string | null
          overview?: string | null
          tagline?: string | null
          backdrop_url?: string | null
          runtime?: number | null
          release_date?: string | null
          director?: string | null
          cast_members?: TMDBCastMember[]
          crew_members?: TMDBCrewMember[]
          genres?: TMDBGenre[]
          production_companies?: TMDBProductionCompany[]
          vote_average?: number | null
          vote_count?: number | null
          popularity?: number | null
          mpaa_rating?: string | null
          status?: string | null
          tmdb_last_fetched?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          favorite_genres: string[]
          preferences: UserPreferences
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          favorite_genres?: string[]
          preferences?: UserPreferences
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          favorite_genres?: string[]
          preferences?: UserPreferences
        }
        Relationships: []
      }
      lists: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          description: string | null
          list_type: ListType
          is_system: boolean
          is_public: boolean
          cover_image_url: string | null
          item_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          description?: string | null
          list_type?: ListType
          is_system?: boolean
          is_public?: boolean
          cover_image_url?: string | null
          item_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          description?: string | null
          list_type?: ListType
          is_system?: boolean
          is_public?: boolean
          cover_image_url?: string | null
          item_count?: number
        }
        Relationships: []
      }
      list_items: {
        Row: {
          id: string
          created_at: string
          list_id: string
          tmdb_movie_id: number
          sort_order: number
          added_at: string
          notes: string | null
          owned_formats: OwnedFormat[]
        }
        Insert: {
          id?: string
          created_at?: string
          list_id: string
          tmdb_movie_id: number
          sort_order?: number
          added_at?: string
          notes?: string | null
          owned_formats?: OwnedFormat[]
        }
        Update: {
          id?: string
          created_at?: string
          list_id?: string
          tmdb_movie_id?: number
          sort_order?: number
          added_at?: string
          notes?: string | null
          owned_formats?: OwnedFormat[]
        }
        Relationships: []
      }
      user_movies: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          tmdb_movie_id: number
          rating: number | null
          rating_rewatchability: number | null
          rating_emotional: number | null
          rating_visual: number | null
          watch_count: number
          first_watched_at: string | null
          last_watched_at: string | null
          notes: string | null
          is_favorite: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          tmdb_movie_id: number
          rating?: number | null
          rating_rewatchability?: number | null
          rating_emotional?: number | null
          rating_visual?: number | null
          watch_count?: number
          first_watched_at?: string | null
          last_watched_at?: string | null
          notes?: string | null
          is_favorite?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          tmdb_movie_id?: number
          rating?: number | null
          rating_rewatchability?: number | null
          rating_emotional?: number | null
          rating_visual?: number | null
          watch_count?: number
          first_watched_at?: string | null
          last_watched_at?: string | null
          notes?: string | null
          is_favorite?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      list_type: ListType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Movie = Database['public']['Tables']['movies']['Row']
export type MovieInsert = Database['public']['Tables']['movies']['Insert']
export type MovieUpdate = Database['public']['Tables']['movies']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type List = Database['public']['Tables']['lists']['Row']
export type ListInsert = Database['public']['Tables']['lists']['Insert']
export type ListUpdate = Database['public']['Tables']['lists']['Update']

export type ListItem = Database['public']['Tables']['list_items']['Row']
export type ListItemInsert = Database['public']['Tables']['list_items']['Insert']
export type ListItemUpdate = Database['public']['Tables']['list_items']['Update']

export type UserMovie = Database['public']['Tables']['user_movies']['Row']
export type UserMovieInsert = Database['public']['Tables']['user_movies']['Insert']
export type UserMovieUpdate = Database['public']['Tables']['user_movies']['Update']
