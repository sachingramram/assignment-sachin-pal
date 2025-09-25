import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

type Worker = {
  id: string | number
  name: string
  service: string
  pricePerDay: number
  rating?: number
  image: string
  location?: string
}

type Stat = { service: string; count: number; avgPrice: number; minPrice: number; maxPrice: number }

const workersPath = path.join(process.cwd(), 'workers.json')

export async function GET() {
  try {
    const file = await fs.readFile(workersPath, 'utf8')
    const workers = JSON.parse(file) as Worker[]

    // group prices by service
    const buckets = new Map<string, number[]>()
    for (const w of workers) {
      if (!w?.service || typeof w.pricePerDay !== 'number') continue
      if (!buckets.has(w.service)) buckets.set(w.service, [])
      buckets.get(w.service)!.push(w.pricePerDay)
    }

    const stats: Stat[] = Array.from(buckets.entries()).map(([service, prices]) => {
      const count = prices.length
      const sum = prices.reduce((a, b) => a + b, 0)
      const avgPrice = Math.round(sum / Math.max(1, count))
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      return { service, count, avgPrice, minPrice, maxPrice }
    }).sort((a, b) => a.service.localeCompare(b.service, undefined, { sensitivity: 'base' }))

    return NextResponse.json(
      { data: stats },
      { headers: { 'Cache-Control': 'no-store' } } // avoid caching in dev
    )
  } catch (e) {
    console.error('/api/services failed:', e)
    return NextResponse.json({ error: 'Failed to compute service stats' }, { status: 500 })
  }
}
