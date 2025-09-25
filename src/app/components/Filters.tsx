'use client'
import { useEffect, useState, type ChangeEvent } from 'react'
import { useWorkersStore, type SortKey } from '../hooks/useWorkersStore'

type Props = { services: string[] }

export default function Filters({ services }: Props) {
  const workers   = useWorkersStore(s => s.workers)
  const query     = useWorkersStore(s => s.query)
  const setQuery  = useWorkersStore(s => s.setQuery)
  const service   = useWorkersStore(s => s.service)
  const setService= useWorkersStore(s => s.setService)
  const priceMax  = useWorkersStore(s => s.priceMax)
  const setPriceMax = useWorkersStore(s => s.setPriceMax)
  const sortBy    = useWorkersStore(s => s.sortBy)
  const setSortBy = useWorkersStore(s => s.setSortBy)

  const [maxCap, setMaxCap] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (workers.length) setMaxCap(Math.max(...workers.map(w => w.pricePerDay)))
  }, [workers])

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortKey)
  }

  return (
    <section id="filters" className="container-app pt-6 pb-2">
      {/* On mobile: single column; tablet: 2 cols; desktop: 4 cols */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {/* Search */}
        <label className="block">
          <span className="mb-1 block text-sm text-slate-300">Search</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, location, or service…"
            autoComplete="off"
            className="w-full rounded-xl bg-slate-800 px-3 py-2.5 min-h-[44px] text-base sm:text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-400"
          />
        </label>

        {/* Service */}
        <label className="block">
          <span className="mb-1 block text-sm text-slate-300">Service</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-xl bg-slate-800 px-3 py-2.5 min-h-[44px] text-base sm:text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-400"
          >
            <option>All</option>
            {services.map((s, i) => (
              <option key={`${s}-${i}`}>{s}</option>
            ))}
          </select>
        </label>

        {/* Max price */}
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

        {/* Sort */}
        <label className="block">
          <span className="mb-1 block text-sm text-slate-300">Sort by</span>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="w-full rounded-xl bg-slate-800 px-3 py-2.5 min-h-[44px] text-base sm:text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-400"
          >
            <optgroup label="Price">
              <option value="price_asc">Low → High</option>
              <option value="price_desc">High → Low</option>
            </optgroup>
            <optgroup label="Name">
              <option value="name_asc">A → Z</option>
              <option value="name_desc">Z → A</option>
            </optgroup>
          </select>
        </label>
      </div>
    </section>
  )
}
