import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDashboardStore } from '../booking.store'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'
import { AGENT_BASE_URL } from '@/constants'

// Mock dependencies
vi.mock('@/lib/axios')
vi.mock('react-hot-toast')

describe('useDashboardStore', () => {
    beforeEach(() => {
        useDashboardStore.setState({
            totalBookings: 0,
            pendingBookings: [],
            inProgressBookings: [],
            completedBookings: [],
            currentBooking: null,
            isLoading: false,
            isBookingLoading: false,
            error: null,
        })
        vi.clearAllMocks()
    })

    describe('fetchDashboardData', () => {
        it('should fetch and set dashboard data successfully', async () => {
            const mockData = {
                stats: { total: 10 },
                bookings: {
                    pending: [{ id: '1' }],
                    inProgress: [{ id: '2' }],
                    completed: [{ id: '3' }]
                }
            }
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: mockData } })

            await useDashboardStore.getState().fetchDashboardData()

            expect(useDashboardStore.getState().totalBookings).toBe(10)
            expect(useDashboardStore.getState().pendingBookings).toEqual([{ id: '1' }])
            expect(useDashboardStore.getState().inProgressBookings).toEqual([{ id: '2' }])
            expect(useDashboardStore.getState().completedBookings).toEqual([{ id: '3' }])
            expect(useDashboardStore.getState().isLoading).toBe(false)
            expect(axiosInstance.get).toHaveBeenCalledWith(AGENT_BASE_URL + "dashboard")
        })

        it('should handle errors', async () => {
            vi.mocked(axiosInstance.get).mockRejectedValue(new Error('Failed'))

            await useDashboardStore.getState().fetchDashboardData()

            expect(useDashboardStore.getState().isLoading).toBe(false)
            expect(useDashboardStore.getState().error).toBeTruthy()
            expect(toast.error).toHaveBeenCalled()
        })
    })

    describe('fetchBooking', () => {
        it('should fetch specific booking successfully', async () => {
            const mockBooking = { _id: '123', status: 'PENDING' }
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: { booking: mockBooking } })

            await useDashboardStore.getState().fetchBooking('123')

            expect(useDashboardStore.getState().currentBooking).toEqual(mockBooking)
            expect(useDashboardStore.getState().isBookingLoading).toBe(false)
            expect(axiosInstance.get).toHaveBeenCalledWith(AGENT_BASE_URL + "get/123")
        })
    })

    describe('updateBookingStatus', () => {
        it('should update booking status and refresh data', async () => {
            const mockBooking = { _id: '123', status: 'COMPLETED' }
            // Setup initial state
            useDashboardStore.setState({ currentBooking: { _id: '123', status: 'PENDING' } as any })

            vi.mocked(axiosInstance.patch).mockResolvedValue({ data: { booking: mockBooking } })
            // Mock fetchDashboardData internal call implicitly by mocking axios get for dashboard
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: { stats: {}, bookings: {} } } })

            await useDashboardStore.getState().updateBookingStatus('123', 'COMPLETED')

            expect(useDashboardStore.getState().currentBooking).toEqual(mockBooking)
            expect(toast.success).toHaveBeenCalled()
            expect(axiosInstance.patch).toHaveBeenCalledWith(`${AGENT_BASE_URL}bookings/123/status`, { status: 'COMPLETED' })
        })
    })

    describe('addExtraTask', () => {
        it('should add extra task successfully', async () => {
            const mockBooking = { _id: '123', extraTasks: [{ description: 'Test', extraPrice: '10' }] }
            vi.mocked(axiosInstance.post).mockResolvedValue({ data: { booking: mockBooking } })

            await useDashboardStore.getState().addExtraTask('123', { description: 'Test', extraPrice: '10' })

            expect(useDashboardStore.getState().currentBooking).toEqual(mockBooking)
            expect(toast.success).toHaveBeenCalled()
            expect(axiosInstance.post).toHaveBeenCalledWith(`${AGENT_BASE_URL}bookings/123/extra-tasks`, { description: 'Test', extraPrice: '10' })
        })
    })
})
