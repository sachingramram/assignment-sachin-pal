'use client'
import { useEffect, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Header from './components/Header'
import Filters from './components/Filters'
import WorkerCard from './components/WorkerCard'
import { useWorkersStore } from './hooks/useWorkersStore'
import type { Worker } from './types/workers'

const ServiceStats = dynamic(() => import('./components/ServiceStats'), {
  ssr: false,
  loading: () => <div className="mx-auto max-w-6xl px-4 pb-8 text-slate-400">Loading…</div>,
})

export default function Page() {
  const { setWorkers, filtered, workers } = useWorkersStore()

  useEffect(() => {
    let ignore = false
    ;(async () => {
      const res = await fetch('/api/workers', { cache: 'no-store' })
      const data: { data: Worker[] } = await res.json()
      if (!ignore) setWorkers(data.data)
    })()
    return () => { ignore = true }
  }, [setWorkers])

  const services = useMemo(() => Array.from(new Set(workers.map(w => w.service))), [workers])
  const list = filtered()

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="sr-only">Browse workers</h1>
        <Filters services={services} />
        {list.length === 0 ? (
          <p className="py-8 text-slate-400">No workers match the current filters.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map(w => <WorkerCard key={w.id} worker={w} />)}
          </div>
        )}
      </main>

      <Suspense fallback={<div className="mx-auto max-w-6xl px-4 pb-8 text-slate-400">Loading…</div>}>
        <ServiceStats />
      </Suspense>
    </>
  )
}
