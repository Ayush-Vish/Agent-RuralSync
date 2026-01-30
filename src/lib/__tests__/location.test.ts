import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getLocation } from '../location'

describe('getLocation', () => {
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

    it('should resolve with coordinates when successful', async () => {
        const mockPosition = {
            coords: {
                latitude: 10,
                longitude: 20,
            }
        }
        mockGeolocation.getCurrentPosition.mockImplementation((success) => {
            success(mockPosition)
        })

        const result = await getLocation()
        expect(result).toEqual({
            latitude: 10,
            longitude: 20,
        })
    })

    it('should reject with error when failed', async () => {
        const mockError = { code: 1, message: 'User denied Geolocation' }
        mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
            error(mockError)
        })

        await expect(getLocation()).rejects.toEqual(mockError)
    })

    it('should reject if geolocation is not supported', async () => {
        // @ts-ignore
        delete global.navigator.geolocation

        await expect(getLocation()).rejects.toEqual({
            code: 0,
            message: "Geolocation is not supported by your browser",
        })
    })
})
