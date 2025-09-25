'use client'
import { useRef, useEffect, FormEvent } from 'react'
import { useWorkersStore } from '../hooks/useWorkersStore'

export default function Header() {
  const { query, setQuery } = useWorkersStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const onSubmit = (e: FormEvent) => e.preventDefault()

  // Quick shortcut: press "/" to focus the search
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

        {/* NAV SEARCH */}
        <form onSubmit={onSubmit} className="ml-auto w-full max-w-md">
          <label htmlFor="nav-search" className="sr-only">Search workers</label>
          <div className="relative">
            {/* search icon */}
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>

            <input
              id="nav-search"
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or service…"
              autoComplete="off"
              className="w-full rounded-xl bg-slate-800 pl-9 pr-9 py-2 text-sm outline-none ring-1 ring-white/10
                         placeholder-slate-400 focus:ring-2 focus:ring-blue-400"
              aria-describedby="nav-search-help"
            />

            {/* clear button */}
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-slate-300
                           hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Clear search"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>
          <p id="nav-search-help" className="sr-only">
            Type a worker name or service. Press slash to focus.
          </p>
        </form>
      </div>
    </header>
  )
}
