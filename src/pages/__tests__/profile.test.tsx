import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProfilePage from '../profile'
import { useAuthStore } from '@/stores/auth.store'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
vi.mock('@/stores/auth.store')

const mockLogout = vi.fn()

// Helper to create a full AuthState mock with minimal overrides
const mockAuthStore = (overrides: Record<string, any>) => {
    vi.mocked(useAuthStore).mockImplementation((selector: any) => {
        return selector({
            isLoggedIn: false,
            user: null,
            setAuth: vi.fn(),
            initialise: vi.fn(),
            login: vi.fn(),
            googleLogin: vi.fn(),
            register: vi.fn(),
            logout: mockLogout,
            ...overrides,
        } as any)
    })
}

describe('ProfilePage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should show user not found if no user', () => {
        mockAuthStore({ user: null })

        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        )

        expect(screen.getByText('User not found')).toBeInTheDocument()
    })

    it('should render user profile when user exists', () => {
        const mockUser = {
            _id: 'user-1',
            name: 'Profile User',
            email: 'profile@example.com',
            role: 'AGENT' as const,
            isVerified: true,
            createdAt: new Date().toISOString(),
        }

        mockAuthStore({ user: mockUser })

        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        )

        expect(screen.getByRole('heading', { level: 2, name: 'Profile User' })).toBeInTheDocument()
        expect(screen.getAllByText('profile@example.com').length).toBeGreaterThan(0)
    })

    it('should handle logout', async () => {
        const mockUser = {
            _id: 'user-2',
            name: 'User',
            email: 'user@example.com',
            role: 'AGENT' as const,
            createdAt: new Date().toISOString(),
        }

        mockAuthStore({ user: mockUser })

        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        )

        fireEvent.click(screen.getByText('Sign Out'))

        expect(mockLogout).toHaveBeenCalled()
    })
})
