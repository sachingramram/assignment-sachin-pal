'use client'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import type { Worker } from '@/types/workers'

type Props = { worker: Worker }

function WorkerCard({ worker }: Props) {
  return (
    <Link
      href={`/workers/${worker.id}`}
      className="block rounded-2xl border border-white/10 bg-slate-800/60 p-4 transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label={`${worker.name}, ${worker.service}`}
    >
      <div className="flex items-center gap-4">
        <Image
  src={worker.image}
  alt={worker.name}
  width={72}
  height={72}
  unoptimized                // ← add this line
  className="rounded-full object-cover ring-1 ring-white/10"
/>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-medium">{worker.name}</h3>
          <p className="text-sm text-slate-300">{worker.service}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-base font-semibold">₹{worker.pricePerDay}</p>
        </div>
      </div>
    </Link>
  )
}

export default memo(WorkerCard)
