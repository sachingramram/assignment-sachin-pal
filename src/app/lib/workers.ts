import { promises as fs } from 'fs'
import path from 'path'
import type { Worker } from '@/types/workers'

const workersPath = path.join(process.cwd(), 'workers.json')

export async function getWorkerById(id: string): Promise<Worker | undefined> {
  const file = await fs.readFile(workersPath, 'utf8')
  const data = JSON.parse(file) as Worker[]
  return data.find(w => String(w.id) === String(id))
}
