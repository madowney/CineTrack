'use client'

import useSWR from 'swr'
import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import type { List, ListItem, ListType } from '@/types/database'

const supabase = createClient()

// Fetcher for SWR
async function fetchLists(userId: string): Promise<List[]> {
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('user_id', userId)
    .order('list_type', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

async function fetchListItems(listId: string): Promise<ListItem[]> {
  const { data, error } = await supabase
    .from('list_items')
    .select('*')
    .eq('list_id', listId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data || []
}

export function useLists() {
  const { user } = useAuth()

  const {
    data: lists,
    error,
    isLoading,
    mutate,
  } = useSWR(
    user ? ['lists', user.id] : null,
    () => fetchLists(user!.id),
    {
      revalidateOnFocus: false,
    }
  )

  const getListByType = useCallback(
    (type: ListType) => {
      return lists?.find((list) => list.list_type === type && list.is_system)
    },
    [lists]
  )

  const getSystemLists = useCallback(() => {
    return lists?.filter((list) => list.is_system) || []
  }, [lists])

  const getCustomLists = useCallback(() => {
    return lists?.filter((list) => !list.is_system) || []
  }, [lists])

  const createList = useCallback(
    async (name: string, description?: string): Promise<List | null> => {
      if (!user) return null

      const { data, error } = await supabase
        .from('lists')
        .insert({
          user_id: user.id,
          name,
          description,
          list_type: 'custom' as ListType,
          is_system: false,
        })
        .select()
        .single()

      if (error) throw error
      mutate()
      return data
    },
    [user, mutate]
  )

  const deleteList = useCallback(
    async (listId: string): Promise<boolean> => {
      if (!user) return false

      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', listId)
        .eq('is_system', false)

      if (error) throw error
      mutate()
      return true
    },
    [user, mutate]
  )

  const updateList = useCallback(
    async (listId: string, updates: { name?: string; description?: string }): Promise<List | null> => {
      if (!user) return null

      const { data, error } = await supabase
        .from('lists')
        .update(updates)
        .eq('id', listId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      mutate()
      return data
    },
    [user, mutate]
  )

  return {
    lists: lists || [],
    isLoading,
    error,
    getListByType,
    getSystemLists,
    getCustomLists,
    createList,
    deleteList,
    updateList,
    mutate,
  }
}

export function useListItems(listId: string | null) {
  const {
    data: items,
    error,
    isLoading,
    mutate,
  } = useSWR(
    listId ? ['list_items', listId] : null,
    () => fetchListItems(listId!),
    {
      revalidateOnFocus: false,
    }
  )

  const addItem = useCallback(
    async (tmdbMovieId: number, notes?: string): Promise<ListItem | null> => {
      if (!listId) return null

      const { data, error } = await supabase
        .from('list_items')
        .insert({
          list_id: listId,
          tmdb_movie_id: tmdbMovieId,
          notes,
        })
        .select()
        .single()

      if (error) throw error
      mutate()
      return data
    },
    [listId, mutate]
  )

  const removeItem = useCallback(
    async (tmdbMovieId: number): Promise<boolean> => {
      if (!listId) return false

      const { error } = await supabase
        .from('list_items')
        .delete()
        .eq('list_id', listId)
        .eq('tmdb_movie_id', tmdbMovieId)

      if (error) throw error
      mutate()
      return true
    },
    [listId, mutate]
  )

  const isInList = useCallback(
    (tmdbMovieId: number): boolean => {
      return items?.some((item) => item.tmdb_movie_id === tmdbMovieId) || false
    },
    [items]
  )

  return {
    items: items || [],
    isLoading,
    error,
    addItem,
    removeItem,
    isInList,
    mutate,
  }
}

// Hook to check if a movie is in any of the user's lists
export function useMovieInLists(tmdbMovieId: number | null) {
  const { user } = useAuth()

  const { data, error, isLoading, mutate } = useSWR(
    user && tmdbMovieId ? ['movie_in_lists', user.id, tmdbMovieId] : null,
    async () => {
      const { data, error } = await supabase
        .from('list_items')
        .select(`
          list_id,
          lists!inner(id, name, list_type, is_system, user_id)
        `)
        .eq('tmdb_movie_id', tmdbMovieId!)
        .eq('lists.user_id', user!.id)

      if (error) throw error
      return data || []
    },
    {
      revalidateOnFocus: false,
    }
  )

  const addToList = useCallback(
    async (listId: string): Promise<boolean> => {
      if (!tmdbMovieId) return false

      const { error } = await supabase.from('list_items').insert({
        list_id: listId,
        tmdb_movie_id: tmdbMovieId,
      })

      if (error) throw error
      mutate()
      return true
    },
    [tmdbMovieId, mutate]
  )

  const removeFromList = useCallback(
    async (listId: string): Promise<boolean> => {
      if (!tmdbMovieId) return false

      const { error } = await supabase
        .from('list_items')
        .delete()
        .eq('list_id', listId)
        .eq('tmdb_movie_id', tmdbMovieId)

      if (error) throw error
      mutate()
      return true
    },
    [tmdbMovieId, mutate]
  )

  const isInList = useCallback(
    (listId: string): boolean => {
      return data?.some((item) => item.list_id === listId) || false
    },
    [data]
  )

  return {
    listMemberships: data || [],
    isLoading,
    error,
    addToList,
    removeFromList,
    isInList,
    mutate,
  }
}
