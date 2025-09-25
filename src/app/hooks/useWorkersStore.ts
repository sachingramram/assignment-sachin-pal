'use client'
import { create } from 'zustand'
import type { Worker } from '@/types/workers'

export type SortKey = 'price' | 'rating' | 'name'

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
  filtered: () => Worker[]
}

export const useWorkersStore = create<State & Actions>((set, get) => ({
  workers: [],
  query: '',
  service: 'All',
  priceMax: undefined,
  sortBy: 'rating',
  setWorkers: (w) => set({ workers: w }),
  setQuery: (q) => set({ query: q }),
  setService: (s) => set({ service: s }),
  setPriceMax: (p) => set({ priceMax: p }),
  setSortBy: (k) => set({ sortBy: k }),
  filtered: () => {
    const { workers, query, service, priceMax, sortBy } = get()
    const q = query.trim().toLowerCase()
    const list = workers.filter(w => {
      const matchesQ = !q || `${w.name} ${w.location ?? ''} ${w.service}`.toLowerCase().includes(q)
      const matchesS = service === 'All' || w.service === service
      const matchesP = priceMax == null || w.pricePerDay <= priceMax
      return matchesQ && matchesS && matchesP
    })
    const sorter: Record<SortKey, (a: Worker, b: Worker) => number> = {
      rating: (a, b) => b.rating - a.rating,
      price: (a, b) => a.pricePerDay - b.pricePerDay,
      name: (a, b) => a.name.localeCompare(b.name),
    }
    return list.sort(sorter[sortBy])
  },
}))
