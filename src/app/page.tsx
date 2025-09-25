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
  loading: () => <div className="container-app pb-8 text-slate-400">Loading…</div>,
})

const Orb = dynamic(() => import('./components/Orb'), { ssr: false })

// Safe rating accessor (no `any`)
const getRating = (val: unknown, fallback: number): number =>
  typeof val === 'number' && Number.isFinite(val) ? val : fallback

export default function Page() {
  const setWorkers = useWorkersStore(s => s.setWorkers)

  // subscribe to slices to avoid unnecessary re-renders
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

  // Defer heavy filtering so typing stays smooth
  const dq = useDeferredValue(query)

  const collator = useMemo(
    () => new Intl.Collator(undefined, { sensitivity: 'base', numeric: true }),
    []
  )

  const services = useMemo(
    () => Array.from(new Set(workers.map(w => w.service))),
    [workers]
  )

  const list = useMemo(() => {
    const q = dq.trim().toLowerCase()

    const filtered = workers.filter(w => {
      const matchesQ =
        !q || (`${w.name} ${w.location ?? ''} ${w.service}`.toLowerCase().includes(q))
      const matchesS = service === 'All' || w.service === service
      const matchesP = priceMax == null || w.pricePerDay <= priceMax
      return matchesQ && matchesS && matchesP
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating_desc': {
          const diff = getRating(b.rating, -Infinity) - getRating(a.rating, -Infinity)
          return diff || collator.compare(a.name, b.name)
        }
        case 'rating_asc': {
          const diff = getRating(a.rating, Infinity) - getRating(b.rating, Infinity)
          return diff || collator.compare(a.name, b.name)
        }
        case 'price_desc': {
          const diff = b.pricePerDay - a.pricePerDay
          return diff || collator.compare(a.name, b.name)
        }
        case 'price_asc': {
          const diff = a.pricePerDay - b.pricePerDay
          return diff || collator.compare(a.name, b.name)
        }
        case 'name_desc':
          return collator.compare(b.name, a.name)
        case 'name_asc':
        default:
          return collator.compare(a.name, b.name)
      }
    })

    return sorted
  }, [workers, dq, service, priceMax, sortBy, collator])

  return (
    <>
      <Header />
      <Orb className="fixed bottom-4 right-4 z-50 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32" />


      <main className="container-app py-6">
        <h1 className="sr-only">Browse workers</h1>

        <Filters services={services} />

        {loading && <p className="py-8 text-slate-400">Loading workers…</p>}
        {error && !loading && <p className="py-8 text-red-300">{error}</p>}

        {!loading && !error && (list.length === 0 ? (
          <p className="py-8 text-slate-400">No workers match the current filters.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((w) => <WorkerCard key={String(w.id)} worker={w} />)}
          </div>
        ))}
      </main>

      <ServiceStats />

      {/* Small floating 3D orb in the corner */}
      <Orb className="fixed bottom-4 right-4 z-50 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32" />
    </>
  )
}
