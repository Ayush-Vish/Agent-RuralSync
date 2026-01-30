import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useIsMobile } from '../use-mobile'

describe('useIsMobile', () => {
    let matchMedia: any

    beforeEach(() => {
        matchMedia = vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // Deprecated
            removeListener: vi.fn(), // Deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))
        window.matchMedia = matchMedia
        // Mock window.innerWidth
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should return false for desktop', () => {
        window.innerWidth = 1024
        const { result } = renderHook(() => useIsMobile())
        expect(result.current).toBe(false)
    })

    it('should return true for mobile', () => {
        window.innerWidth = 500
        matchMedia.mockImplementation((query) => ({
            matches: true,
            media: query,
            onchange: null,
            addListener: vi.fn(), // Deprecated
            removeListener: vi.fn(), // Deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))
        const { result } = renderHook(() => useIsMobile())
        expect(result.current).toBe(true)
    })
})
