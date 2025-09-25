import { render, screen } from '@testing-library/react'
import WorkerCard from '@/app/components/WorkerCard'
import type { Worker } from '@/types/workers'

const worker: Worker = {
  id: '1',
  name: 'Ravi Kumar',
  service: 'Plumber',
  pricePerDay: 1200,
  rating: 4.5, // not displayed by the card now, but required by type
  image: 'https://randomuser.me/api/portraits/men/32.jpg',
  location: 'Delhi', // not asserted anymore
}

describe('WorkerCard (minimal view)', () => {
  it('renders image, name, service, price and links to detail page', () => {
    render(<WorkerCard worker={worker} />)

    // name & service
    expect(screen.getByText('Ravi Kumar')).toBeInTheDocument()
    expect(screen.getByText('Plumber')).toBeInTheDocument()

    // price (allow possible spacing)
    expect(screen.getByText(/₹\s*1200/)).toBeInTheDocument()

    // image alt
    expect(screen.getByAltText('Ravi Kumar')).toBeInTheDocument()

    // link to /workers/1 (aria-label is "Ravi Kumar, Plumber")
    const link = screen.getByRole('link', { name: /Ravi Kumar, Plumber/i })
    expect(link).toHaveAttribute('href', '/workers/1')
  })
})
