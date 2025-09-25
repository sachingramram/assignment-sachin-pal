'use client'
import { useEffect, useState } from 'react'

type Stat = { service: string; count: number; avgPrice: number; minPrice: number; maxPrice: number }

export default function ServiceStats() {
  const [stats, setStats] = useState<Stat[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(d => setStats(d.data))
      .catch(() => setError('Failed to load service stats'))
  }, [])

  if (error) return <p className="mx-auto max-w-6xl px-4 text-sm text-red-300">{error}</p>
  if (!stats) return <div className="mx-auto max-w-6xl px-4 py-8 animate-pulse text-slate-400">Loading stats…</div>

  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <h2 className="mb-3 text-lg font-semibold">Service overview</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <div key={s.service} className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
            <p className="text-sm text-slate-300">{s.service}</p>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs text-slate-400">avg ₹{s.avgPrice} • min ₹{s.minPrice} • max ₹{s.maxPrice}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
