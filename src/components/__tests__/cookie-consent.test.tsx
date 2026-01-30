import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CookieConsent from '../cookie-consent'
import Cookies from 'js-cookie'

// Mock Cookies
vi.mock('js-cookie', () => ({
    default: {
        get: vi.fn(),
        set: vi.fn()
    }
}))

describe('CookieConsent', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render if no consent cookie exists', () => {
        vi.mocked(Cookies.get).mockReturnValue(undefined)
        render(<CookieConsent />)
        expect(screen.getByText('Cookie Consent')).toBeInTheDocument()
    })

    it('should not render if consent cookie exists', () => {
        vi.mocked(Cookies.get).mockReturnValue('true')
        render(<CookieConsent />)
        expect(screen.queryByText('Cookie Consent')).not.toBeInTheDocument()
    })

    it('should set cookie and close on Accept', () => {
        vi.mocked(Cookies.get).mockReturnValue(undefined)
        render(<CookieConsent />)

        fireEvent.click(screen.getByText('Accept'))

        expect(Cookies.set).toHaveBeenCalledWith('cookieConsent', 'true', expect.any(Object))
    })

    it('should set cookie and close on Decline', () => {
        vi.mocked(Cookies.get).mockReturnValue(undefined)
        render(<CookieConsent />)

        fireEvent.click(screen.getByText('Decline'))

        expect(Cookies.set).toHaveBeenCalledWith('cookieConsent', 'false', expect.any(Object))
    })
})
