import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getWorkerById } from '../../lib/workers'

export default async function WorkerDetail({ params }: { params: { id: string } }) {
  const worker = await getWorkerById(params.id)
  if (!worker) notFound()

  return (
    <main className="container-app py-8">
      <nav className="mb-6">
        <Link href="/" className="text-sky-300 hover:text-sky-200">← Back</Link>
      </nav>

      <section className="grid gap-6 md:grid-cols-[200px,1fr] items-start">
        <div>
          <Image
            src={worker.image}
            alt={worker.name}
            width={200}
            height={200}
            unoptimized                 // ← add this line
            className="rounded-2xl object-cover ring-1 ring-white/10"
            priority
          />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">{worker.name}</h1>
          <p className="mt-1 text-slate-300">{worker.service}</p>
          <p className="mt-2 text-lg font-semibold">₹{worker.pricePerDay}</p>

          <div className="mt-6">
            <Link
              href={`/workers/${worker.id}/contact`}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Contact me
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
