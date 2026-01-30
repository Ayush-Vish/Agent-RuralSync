import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RegisterPage from '../register'
import { useAuthStore } from '@/stores/auth.store'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
vi.mock('@/stores/auth.store')
vi.mock('@react-oauth/google', () => ({
    useGoogleLogin: () => vi.fn()
}))

const mockRegister = vi.fn()
const mockGoogleLogin = vi.fn()

describe('RegisterPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useAuthStore).mockImplementation((selector) => {
            return selector({
                register: mockRegister,
                googleLogin: mockGoogleLogin
            })
        })
    })

    it('should render register form', () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        )

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /^Sign Up$/i })).toBeInTheDocument()
    })

    it('should handle form submission', async () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        )

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New User' } })
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@example.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })

        mockRegister.mockResolvedValue(true)

        fireEvent.click(screen.getByRole('button', { name: /^Sign Up$/i })) // The button text might be "Sign Up" inside the button

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                name: 'New User',
                email: 'new@example.com',
                password: 'password123'
            })
        })
    })
})
