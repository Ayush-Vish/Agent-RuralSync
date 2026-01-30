import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BookingDashboard from '../dashboard-layout'
import { useDashboardStore } from '@/stores/booking.store'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
vi.mock('@/stores/booking.store')
vi.mock('@/components/booking', () => ({
    BookingDetailsSheet: () => <div data-testid="details-sheet">Details Sheet</div>
}))
vi.mock('@/components/dashboard', () => ({
    StatsCard: ({ title }: any) => <div data-testid="stats-card">{title}</div>,
    PerformanceCard: () => <div data-testid="perf-card">Performance</div>,
    BookingsTable: () => <div data-testid="bookings-table">Bookings Table</div>,
    DashboardHeader: ({ onRefresh }: any) => <button onClick={onRefresh}>Refresh Header</button>,
    DashboardSkeleton: () => <div>Skeleton</div>,
    ErrorState: ({ onRetry }: any) => <button onClick={onRetry}>Error Retry</button>
}))

describe('BookingDashboard', () => {
    const mockFetchData = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useDashboardStore).mockImplementation((selector) => selector({
            totalBookings: 10,
            pendingBookings: [],
            inProgressBookings: [],
            completedBookings: [],
            isLoading: false,
            error: null,
            fetchDashboardData: mockFetchData
        }))
    })

    it('should render dashboard content', () => {
        render(
            <BrowserRouter>
                <BookingDashboard />
            </BrowserRouter>
        )

        expect(mockFetchData).toHaveBeenCalled()
        expect(screen.getByTestId('perf-card')).toBeInTheDocument()
        expect(screen.getAllByTestId('stats-card')).toHaveLength(4)
        expect(screen.getByText('Refresh Header')).toBeInTheDocument()
    })

    it('should show skeleton when loading', () => {
        vi.mocked(useDashboardStore).mockImplementation((selector) => selector({
            isLoading: true,
            error: null,
            fetchDashboardData: mockFetchData
        }))

        render(
            <BrowserRouter>
                <BookingDashboard />
            </BrowserRouter>
        )
        expect(screen.getByText('Skeleton')).toBeInTheDocument()
    })

    it('should show error state', () => {
        vi.mocked(useDashboardStore).mockImplementation((selector) => selector({
            isLoading: false,
            error: 'Failed to load',
            fetchDashboardData: mockFetchData
        }))

        render(
            <BrowserRouter>
                <BookingDashboard />
            </BrowserRouter>
        )
        expect(screen.getByText('Error Retry')).toBeInTheDocument()
    })

    it('should handle refresh', async () => {
        render(
            <BrowserRouter>
                <BookingDashboard />
            </BrowserRouter>
        )

        fireEvent.click(screen.getByText('Refresh Header'))
        expect(mockFetchData).toHaveBeenCalledTimes(2) // Once on mount, once on click
    })
})
