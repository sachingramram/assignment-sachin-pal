'use client'

import { useEffect, useMemo, useState, useDeferredValue } from 'react'
import dynamic from 'next/dynamic'
import Header from './components/Header'
import Filters from './components/Filters'
import WorkerCard from './components/WorkerCard'
import { useWorkersStore } from './hooks/useWorkersStore'
import type { Worker } from '@/types/workers'

const ServiceStats = dynamic(() => import('./components/ServiceStats'), {
  ssr: false,
  loading: () => <div className="mx-auto max-w-6xl px-4 pb-8 text-slate-400">Loading…</div>,
})

export default function Page() {
  const setWorkers  = useWorkersStore(s => s.setWorkers)

  // subscribe to slices (not the whole store)
  const workers  = useWorkersStore(s => s.workers)
  const query    = useWorkersStore(s => s.query)
  const service  = useWorkersStore(s => s.service)
  const priceMax = useWorkersStore(s => s.priceMax)
  const sortBy   = useWorkersStore(s => s.sortBy)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/workers', { cache: 'no-store' })
        if (!res.ok) throw new Error(`GET /api/workers ${res.status}`)
        const json: { data: Worker[] } = await res.json()
        if (!ignore) setWorkers(json.data ?? [])
      } catch (e) {
        console.error(e)
        if (!ignore) setError('Failed to load workers')
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [setWorkers])

  // DEFERRED query: compute heavy filtering against a lagged value
  const dq = useDeferredValue(query) // lets typing stay smooth

  const services = useMemo(
    () => Array.from(new Set(workers.map(w => w.service))),
    [workers]
  )

  const list = useMemo(() => {
    const q = dq.trim().toLowerCase()
    const filtered = workers.filter(w => {
      const matchesQ = !q || (`${w.name} ${w.location ?? ''} ${w.service}`.toLowerCase().includes(q))
      const matchesS = service === 'All' || w.service === service
      const matchesP = priceMax == null || w.pricePerDay <= priceMax
      return matchesQ && matchesS && matchesP
    })

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0)
      if (sortBy === 'price')  return a.pricePerDay - b.pricePerDay
      return a.name.localeCompare(b.name)
    })
    return sorted
  }, [workers, dq, service, priceMax, sortBy])

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="sr-only">Browse workers</h1>

        <Filters services={services} />

        {loading && <p className="py-8 text-slate-400">Loading workers…</p>}
        {error && !loading && <p className="py-8 text-red-300">{error}</p>}

        {!loading && !error && (list.length === 0 ? (
          <p className="py-8 text-slate-400">No workers match the current filters.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map(w => <WorkerCard key={String(w.id)} worker={w} />)}
          </div>
        ))}
      </main>

      <ServiceStats />
    </>
  )
}
