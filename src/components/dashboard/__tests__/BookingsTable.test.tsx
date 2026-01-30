import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BookingsTable } from '../BookingsTable'
import { useIsMobile } from '@/hooks/use-mobile'

// Mock hooks
vi.mock('@/hooks/use-mobile')

describe('BookingsTable', () => {
    const mockOnViewDetails = vi.fn()
    const bookings = [
        {
            _id: '1',
            client: 'John Doe',
            service: 'Cleaning',
            bookingDate: new Date().toISOString(),
            status: 'PENDING',
            location: { coordinates: [0, 0] },
            address: '123 Test St'
        },
        {
            _id: '2',
            client: 'Jane Doe',
            service: 'Plumbing',
            bookingDate: new Date().toISOString(),
            status: 'COMPLETED',
            location: { coordinates: [0, 0] },
            address: '456 Test Ave'
        }
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render empty message when no bookings', () => {
        vi.mocked(useIsMobile).mockReturnValue(false)
        render(<BookingsTable bookings={[]} emptyMessage="No bookings" onViewDetails={mockOnViewDetails} />)
        expect(screen.getByText('No bookings')).toBeInTheDocument()
    })

    it('should render table rows on desktop', () => {
        vi.mocked(useIsMobile).mockReturnValue(false)
        // @ts-ignore
        render(<BookingsTable bookings={bookings} emptyMessage="No bookings" onViewDetails={mockOnViewDetails} />)

        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Jane Doe')).toBeInTheDocument()
        expect(screen.getAllByText('View Details')).toHaveLength(2)
    })

    it('should call onViewDetails when View Details clicked on desktop', () => {
        vi.mocked(useIsMobile).mockReturnValue(false)
        // @ts-ignore
        render(<BookingsTable bookings={bookings} emptyMessage="No bookings" onViewDetails={mockOnViewDetails} />)

        const viewButtons = screen.getAllByText('View Details')
        fireEvent.click(viewButtons[0])
        expect(mockOnViewDetails).toHaveBeenCalledWith('1')
    })

    it('should render card view on mobile', () => {
        vi.mocked(useIsMobile).mockReturnValue(true)
        // @ts-ignore
        render(<BookingsTable bookings={bookings} emptyMessage="No bookings" onViewDetails={mockOnViewDetails} />)

        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getAllByText('Tap to view details')).toHaveLength(2)
    })

    it('should call onViewDetails when card clicked on mobile', () => {
        vi.mocked(useIsMobile).mockReturnValue(true)
        // @ts-ignore
        render(<BookingsTable bookings={bookings} emptyMessage="No bookings" onViewDetails={mockOnViewDetails} />)

        fireEvent.click(screen.getByText('John Doe'))
        // Logic attaches onClick to the container. Getting by Text bubbles up.
        expect(mockOnViewDetails).toHaveBeenCalledWith('1')
    })

    it('should handle missing client/service/address gracefully', () => {
        vi.mocked(useIsMobile).mockReturnValue(false)
        const incompleteBooking = [{
            _id: '3',
            client: undefined,
            service: undefined,
            bookingDate: new Date().toISOString(),
            status: 'PENDING',
            location: { coordinates: [10, 20] }
        }]
        // @ts-ignore
        render(<BookingsTable bookings={incompleteBooking} emptyMessage="No bookings" onViewDetails={mockOnViewDetails} />)

        expect(screen.getAllByText('N/A').length).toBeGreaterThan(0)
    })
})
