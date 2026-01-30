import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useLocation from '../useLocation'

describe('useLocation', () => {
    const mockGeolocation = {
        getCurrentPosition: vi.fn(),
    }

    beforeEach(() => {
        // @ts-ignore
        global.navigator.geolocation = mockGeolocation
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('should return location when successful', async () => {
        const mockPosition = {
            coords: {
                latitude: 10,
                longitude: 20,
            }
        }
        mockGeolocation.getCurrentPosition.mockImplementation((success) => {
            success(mockPosition)
        })

        const { result } = renderHook(() => useLocation())

        expect(result.current.location).toEqual({
            latitude: 10,
            longitude: 20,
        })
        expect(result.current.error).toBeNull()
    })

    it('should return error when failed', () => {
        const mockError = { code: 1, message: 'User denied Geolocation' }
        mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
            error(mockError)
        })

        const { result } = renderHook(() => useLocation())

        expect(result.current.location).toBeUndefined()
        expect(result.current.error).toEqual(mockError)
    })

    it('should return error if geolocation is not supported', () => {
        // @ts-ignore
        delete global.navigator.geolocation

        const { result } = renderHook(() => useLocation())

        expect(result.current.error).toEqual({ code: 0, message: "Geolocation is not supported by your browser" })
    })
})
