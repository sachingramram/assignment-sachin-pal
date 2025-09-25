'use client'
import { create } from 'zustand'
import type { Worker } from '@/types/workers'

export type SortKey =
  | 'rating_desc' | 'rating_asc'
  | 'price_asc'   | 'price_desc'
  | 'name_asc'    | 'name_desc'

type State = {
  workers: Worker[]
  query: string
  service: string | 'All'
  priceMax?: number
  sortBy: SortKey
}

type Actions = {
  setWorkers: (w: Worker[]) => void
  setQuery: (q: string) => void
  setService: (s: State['service']) => void
  setPriceMax: (p?: number) => void
  setSortBy: (k: SortKey) => void
}

export const useWorkersStore = create<State & Actions>((set) => ({
  workers: [],
  query: '',
  service: 'All',
  priceMax: undefined,
  sortBy: 'rating_desc',          // default: High → Low by rating
  setWorkers: (w) => set({ workers: w }),
  setQuery: (q) => set({ query: q }),
  setService: (s) => set({ service: s }),
  setPriceMax: (p) => set({ priceMax: p }),
  setSortBy: (k) => set({ sortBy: k }),
}))
