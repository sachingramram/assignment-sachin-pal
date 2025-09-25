'use client'
import { useEffect, useState } from 'react'
import { useWorkersStore } from '../hooks/useWorkersStore'

type Props = { services: string[] }

export default function Filters({ services }: Props) {
  const { query, setQuery, service, setService, priceMax, setPriceMax, sortBy, setSortBy, workers } = useWorkersStore()
  const [maxCap, setMaxCap] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (workers.length) setMaxCap(Math.max(...workers.map(w => w.pricePerDay)))
  }, [workers])

  return (
    <section id="filters" className="mx-auto max-w-6xl px-4 pt-6 pb-2">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-sm text-slate-300">Search</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, location, service…"
            className="w-full rounded-xl bg-slate-800 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-300">Service</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-xl bg-slate-800 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-400"
          >
            <option>All</option>
            {services.map(s => <option key={s}>{s}</option>)}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-300">Max price / day</span>
          <input
            type="range"
            min={0}
            max={maxCap ?? 1000}
            value={priceMax ?? (maxCap ?? 1000)}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full"
            aria-valuemin={0}
            aria-valuemax={maxCap ?? 1000}
            aria-valuenow={priceMax ?? (maxCap ?? 1000)}
          />
          <span className="mt-1 block text-xs text-slate-400">
            {priceMax ? `₹${priceMax}` : 'No limit'}
          </span>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-300">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full rounded-xl bg-slate-800 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-400"
          >
            <option value="rating">Rating (high → low)</option>
            <option value="price">Price (low → high)</option>
            <option value="name">Name (A → Z)</option>
          </select>
        </label>
      </div>
    </section>
  )
}
