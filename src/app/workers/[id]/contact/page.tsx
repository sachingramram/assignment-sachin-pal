import Link from 'next/link'

export default function ContactWorker() {
  return (
    <main className="container-app py-8">
      <nav className="mb-6">
        <Link href="/" className="text-sky-300 hover:text-sky-200">← Back to list</Link>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Contact worker</h1>
       

      <div className="space-y-3">
        <a
          href="#"
          className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Send message
        </a>
         
      </div>
    </main>
  )
}
