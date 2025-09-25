'use client'
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Worker Finder</h1>
        <nav className="text-sm text-slate-300">
          <a className="hover:text-white focus:outline-none focus:ring" href="#filters">Filters</a>
        </nav>
      </div>
    </header>
  )
}
