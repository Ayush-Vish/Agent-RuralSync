import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProfilePage from '../profile'
import { useAuthStore } from '@/stores/auth.store'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
vi.mock('@/stores/auth.store')

const mockLogout = vi.fn()

describe('ProfilePage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should show user not found if no user', () => {
        vi.mocked(useAuthStore).mockImplementation((selector) => {
            return selector({
                user: null,
                logout: mockLogout
            })
        })

        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        )

        expect(screen.getByText('User not found')).toBeInTheDocument()
    })

    it('should render user profile when user exists', () => {
        const mockUser = {
            name: 'Profile User',
            email: 'profile@example.com',
            role: 'AGENT',
            isVerified: true
        }

        vi.mocked(useAuthStore).mockImplementation((selector) => {
            return selector({
                user: mockUser,
                logout: mockLogout
            })
        })

        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        )

        expect(screen.getByRole('heading', { level: 2, name: 'Profile User' })).toBeInTheDocument()
        expect(screen.getAllByText('profile@example.com').length).toBeGreaterThan(0)
    })

    it('should handle logout', async () => {
        const mockUser = { name: 'User' }
        vi.mocked(useAuthStore).mockImplementation((selector) => {
            return selector({
                user: mockUser,
                logout: mockLogout
            })
        })

        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        )

        fireEvent.click(screen.getByText('Sign Out'))

        expect(mockLogout).toHaveBeenCalled()
    })
})
