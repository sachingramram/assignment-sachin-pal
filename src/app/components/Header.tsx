'use client'
import { useRef, useEffect, useState, FormEvent } from 'react'
import { useWorkersStore } from '../hooks/useWorkersStore'

export default function Header() {
  // subscribe only to what we need
  const queryFromStore = useWorkersStore(s => s.query)
  const setQuery = useWorkersStore(s => s.setQuery)

  // local state = instant typing
  const [q, setQ] = useState(queryFromStore)
  const inputRef = useRef<HTMLInputElement>(null)

  // keep local input synced if query changes elsewhere (e.g., Filters)
  useEffect(() => { setQ(queryFromStore) }, [queryFromStore])

  // DEBOUNCE store updates (reduces rerenders while typing)
  useEffect(() => {
    const id = window.setTimeout(() => setQuery(q), 150) // tweak 100–200ms
    return () => clearTimeout(id)
  }, [q, setQuery])

  const onSubmit = (e: FormEvent) => e.preventDefault()

  // "/" focuses the search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight">Worker Finder</h1>

        <form onSubmit={onSubmit} className="ml-auto w-full max-w-md">
          <label htmlFor="nav-search" className="sr-only">Search workers</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
            <input
              id="nav-search"
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or service…"
              autoComplete="off"
              className="w-full rounded-xl bg-slate-800 pl-9 pr-9 py-2 text-sm outline-none ring-1 ring-white/10 placeholder-slate-400 focus:ring-2 focus:ring-blue-400"
            />
            {q && (
              <button
                type="button"
                onClick={() => { setQ(''); inputRef.current?.focus() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Clear search"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>
        </form>
      </div>
    </header>
  )
}
