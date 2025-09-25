useEffect(() => {
  let ignore = false
  ;(async () => {
    try {
      const res = await fetch('/api/workers', { cache: 'no-store' })
      if (!res.ok) throw new Error(`Failed /api/workers: ${res.status}`)
      const data: { data: Worker[] } = await res.json()
      if (!ignore) setWorkers(data.data)
    } catch (err) {
      console.error(err) // won't crash UI now
      if (!ignore) setWorkers([]) // or keep previous
    }
  })()
  return () => { ignore = true }
}, [setWorkers])
