'use client'
import Image from 'next/image'
import { memo } from 'react'
import type { Worker } from '@/types/workers'

type Props = { worker: Worker }

function WorkerCard({ worker }: Props) {
  const showRating =
    typeof worker.rating === 'number' && Number.isFinite(worker.rating)

  return (
    <article
      className="group rounded-2xl border border-white/10 bg-slate-800/60 p-4 transition hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-400"
      tabIndex={0}
      aria-label={worker.name + ', ' + worker.service}
    >
      <div className="flex items-center gap-4">
        <Image
          src={worker.image}
          alt={worker.name}
          width={72}
          height={72}
          loading="lazy"
          className="rounded-full object-cover ring-1 ring-white/10"
        />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-medium">{worker.name}</h3>
          <p className="text-sm text-slate-300">{worker.service}</p>
          <p className="text-sm text-slate-400">{worker.location ?? '—'}</p>
        </div>

        <div className="ml-auto text-right">
          <p className="text-base font-semibold">₹{worker.pricePerDay}</p>

          {showRating ? (
            <p
              className="text-xs text-amber-300"
              aria-label={'Rating ' + worker.rating + ' out of 5'}
            >
              {'★ '}{Number(worker.rating).toFixed(1)}
            </p>
          ) : (
            <p className="text-xs text-slate-400">{'★ —'}</p>
          )}
        </div>
      </div>
    </article>
  )
}

export default memo(WorkerCard)
