// src/app/types/workers.ts
export type Worker = {
  id: string
  name: string
  service: string
  pricePerDay: number
  rating: number
  image: string
  location?: string
}
