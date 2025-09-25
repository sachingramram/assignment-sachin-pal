import { render, screen } from '@testing-library/react'
import WorkerCard from '@/app/components/WorkerCard'
import type { Worker } from '@/types/workers'

const baseWorker: Worker = {
  id: '1',
  name: 'Ravi Kumar',
  service: 'Plumber',
  pricePerDay: 1200,
  rating: 4.5,
  image: 'https://randomuser.me/api/portraits/men/32.jpg',
  location: 'Delhi',
}

describe('WorkerCard', () => {
  it('renders worker details (name, service, price, rating, location)', () => {
    render(<WorkerCard worker={baseWorker} />)

    expect(screen.getByText('Ravi Kumar')).toBeInTheDocument()
    expect(screen.getByText('Plumber')).toBeInTheDocument()
    expect(screen.getByText('₹1200')).toBeInTheDocument()
    expect(screen.getByLabelText(/Rating 4.5 out of 5/i)).toBeInTheDocument()
    expect(screen.getByText('Delhi')).toBeInTheDocument()
  })

  it('shows "★ —" when rating is missing/invalid', () => {
    const noRating: Worker = { ...baseWorker, rating: NaN }
    render(<WorkerCard worker={noRating} />)
    expect(screen.getByText('★ —')).toBeInTheDocument()
  })
})
