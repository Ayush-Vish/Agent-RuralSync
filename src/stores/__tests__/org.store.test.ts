import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useOrgStore } from '../org.store'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'
import { AGENT_BASE_URL } from '@/constants'

// Mock dependencies
vi.mock('@/lib/axios')
vi.mock('react-hot-toast')

describe('useOrgStore', () => {
    beforeEach(() => {
        useOrgStore.setState({ orgDetails: null, isLoading: false })
        vi.clearAllMocks()
    })

    describe('getOrgDetails', () => {
        it('should fetch and set organization details on success', async () => {
            const mockOrgDetails = { name: 'Test Org' }
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: { data: mockOrgDetails } })

            const result = await useOrgStore.getState().getOrgDetails()

            // Check final state
            expect(result).toBe(true)
            expect(useOrgStore.getState().orgDetails).toEqual(mockOrgDetails)
            expect(useOrgStore.getState().isLoading).toBe(false)

            expect(axiosInstance.get).toHaveBeenCalledWith(`${AGENT_BASE_URL}org-detail`)
        })

        it('should handle errors and reset state', async () => {
            vi.mocked(axiosInstance.get).mockRejectedValue(new Error('Network error'))

            const result = await useOrgStore.getState().getOrgDetails()

            expect(result).toBe(false)
            expect(useOrgStore.getState().orgDetails).toBeNull()
            expect(useOrgStore.getState().isLoading).toBe(false)
            expect(toast.error).toHaveBeenCalled()
        })
    })
})
