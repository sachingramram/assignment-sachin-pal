import { render, screen, fireEvent } from '@testing-library/react'
import Filters from '@/app/components/Filters'

// Keep this in sync with your store
type SortKey =
  | 'rating_desc' | 'rating_asc'
  | 'price_asc'   | 'price_desc'
  | 'name_asc'    | 'name_desc'

// --- Mock the store BEFORE the component imports are evaluated (Jest hoists this) ---
jest.mock('@/app/hooks/useWorkersStore', () => {
  // Define typed setter mocks that we can assert on
  const setQuery   = jest.fn<void, [string]>()
  const setService = jest.fn<void, [string]>()
  const setPriceMax= jest.fn<void, [number?]>()
  const setSortBy  = jest.fn<void, [SortKey]>()

  // Inline a tiny workers list (don’t pull from outer scope)
  const state = {
    workers: [
      { id: '1', name: 'A', service: 'Plumber',     pricePerDay: 1000, rating: 4, image: '', location: 'Delhi' },
      { id: '2', name: 'B', service: 'Electrician', pricePerDay: 1500, rating: 5, image: '', location: 'Pune'  },
    ],
    query: '',
    service: 'All',
    priceMax: undefined as number | undefined,
    sortBy: 'name_asc' as SortKey,
    setQuery,
    setService,
    setPriceMax,
    setSortBy,
  }

  // Zustand-like selector signature
  const useWorkersStore = <T,>(selector: (s: typeof state) => T): T => selector(state)

  // Expose the mocks so tests can assert on them
  return { useWorkersStore, __storeMocks: { setQuery, setService, setPriceMax, setSortBy } }
})

/** Pull the exposed mocks from the mocked module */
import * as Store from '@/app/hooks/useWorkersStore'

describe('Filters', () => {
  beforeEach(() => {
    const m = (Store as unknown as { __storeMocks: Record<string, jest.Mock> }).__storeMocks
    m.setQuery.mockClear()
    m.setService.mockClear()
    m.setPriceMax.mockClear()
    m.setSortBy.mockClear()
  })

  it('renders inputs and service options', () => {
    render(<Filters services={['Plumber', 'Electrician']} />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Plumber')).toBeInTheDocument()
    expect(screen.getByText('Electrician')).toBeInTheDocument()
    expect(screen.getByLabelText(/Sort by/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Name, location, or service/i)).toBeInTheDocument()
  })

  it('updates query when typing', () => {
    render(<Filters services={['Plumber']} />)
    const input = screen.getByPlaceholderText(/Name, location, or service/i)
    fireEvent.change(input, { target: { value: 'rav' } })
    const m = (Store as unknown as { __storeMocks: Record<string, jest.Mock> }).__storeMocks
    expect(m.setQuery).toHaveBeenCalledWith('rav')
  })

  it('changes sort value', () => {
    render(<Filters services={['Plumber']} />)
    const select = screen.getByLabelText(/Sort by/i)
    fireEvent.change(select, { target: { value: 'price_desc' } })
    const m = (Store as unknown as { __storeMocks: Record<string, jest.Mock> }).__storeMocks
    expect(m.setSortBy).toHaveBeenCalledWith('price_desc')
  })

  it('changes service value', () => {
    render(<Filters services={['Plumber', 'Electrician']} />)
    const select = screen.getByLabelText(/Service/i)
    fireEvent.change(select, { target: { value: 'Plumber' } })
    const m = (Store as unknown as { __storeMocks: Record<string, jest.Mock> }).__storeMocks
    expect(m.setService).toHaveBeenCalledWith('Plumber')
  })

  it('changes price slider', () => {
    render(<Filters services={['Plumber']} />)
    const slider = screen.getByLabelText(/Max price \/ day/i)
    fireEvent.change(slider, { target: { value: '1200' } })
    const m = (Store as unknown as { __storeMocks: Record<string, jest.Mock> }).__storeMocks
    expect(m.setPriceMax).toHaveBeenCalledWith(1200)
  })
})
