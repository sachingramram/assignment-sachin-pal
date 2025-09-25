'use client'
import { useEffect, useState, type ChangeEvent } from 'react'
import { useWorkersStore, type SortKey } from '../hooks/useWorkersStore'

type Props = { services: string[] }

export default function Filters({ services }: Props) {
  const { query, setQuery, service, setService, priceMax, setPriceMax, sortBy, setSortBy, workers } = useWorkersStore()
  const [maxCap, setMaxCap] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (workers.length) setMaxCap(Math.max(...workers.map(w => w.pricePerDay)))
  }, [workers])

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as SortKey
    setSortBy(v)
  }

  return (
    <section id="filters" className="mx-auto max-w-6xl px-4 pt-6 pb-2">
      {/* ...other controls... */}
      <label className="block">
        <span className="mb-1 block text-sm text-slate-300">Sort by</span>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="w-full rounded-xl bg-slate-800 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-400"
        >
          <option value="rating">Rating (high → low)</option>
          <option value="price">Price (low → high)</option>
          <option value="name">Name (A → Z)</option>
        </select>
      </label>
    </section>
  )
}
