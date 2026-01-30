import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from '../login'
import { useAuthStore } from '@/stores/auth.store'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
vi.mock('@/stores/auth.store')
vi.mock('@react-oauth/google', () => ({
    useGoogleLogin: () => vi.fn()
}))

const mockLogin = vi.fn()
const mockGoogleLogin = vi.fn()

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useAuthStore).mockImplementation((selector) => {
            return selector({
                login: mockLogin,
                googleLogin: mockGoogleLogin
            })
        })
    })

    it('should render login form', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        )

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
    })

    it('should handle form submission', async () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        )

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } })
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } })

        mockLogin.mockResolvedValue(true)

        fireEvent.click(screen.getByRole('button', { name: /Login/i }))

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password'
            })
        })
    })
})
