export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Movie = Database['public']['Tables']['movies']['Row']
export type MovieInsert = Database['public']['Tables']['movies']['Insert']
export type MovieUpdate = Database['public']['Tables']['movies']['Update']
