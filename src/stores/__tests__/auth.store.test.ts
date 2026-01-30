import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '../auth.store'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'
import { AUTH_BASE_URL } from '@/constants'

// Mock dependencies
vi.mock('@/lib/axios')
vi.mock('react-hot-toast')

describe('useAuthStore', () => {
    beforeEach(() => {
        useAuthStore.setState({ isLoggedIn: false, user: null })
        vi.clearAllMocks()
    })

    describe('initialise', () => {
        it('should set isLoggedIn to true and user data on success', async () => {
            const mockUser = { id: '1', name: 'Test User' }
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockUser })

            const result = await useAuthStore.getState().initialise()

            expect(result).toBe(true)
            expect(useAuthStore.getState().isLoggedIn).toBe(true)
            expect(useAuthStore.getState().user).toEqual(mockUser)
            expect(axiosInstance.get).toHaveBeenCalledWith(AUTH_BASE_URL + 'user-detail/agent', {
                withCredentials: true,
            })
        })

        it('should set isLoggedIn to false and null user on failure', async () => {
            vi.mocked(axiosInstance.get).mockResolvedValue({ data: null })

            const result = await useAuthStore.getState().initialise()

            expect(result).toBe(false)
            expect(useAuthStore.getState().isLoggedIn).toBe(false)
            expect(useAuthStore.getState().user).toBeNull()
            expect(toast.error).toHaveBeenCalled()
        })

        it('should handle errors gracefully', async () => {
            vi.mocked(axiosInstance.get).mockRejectedValue(new Error('Network Error'))

            const result = await useAuthStore.getState().initialise()

            expect(result).toBe(false)
            expect(useAuthStore.getState().isLoggedIn).toBe(false)
            expect(useAuthStore.getState().user).toBeNull()
            expect(toast.error).toHaveBeenCalled()
        })
    })

    describe('login', () => {
        it('should login successfully', async () => {
            const mockUser = { id: '1', name: 'Test User' }
            vi.mocked(axiosInstance.post).mockResolvedValue({ data: { user: mockUser } })

            const loginData = { email: 'test@example.com', password: 'password' }
            const result = await useAuthStore.getState().login(loginData)

            expect(result).toBe(true)
            expect(useAuthStore.getState().isLoggedIn).toBe(true)
            expect(useAuthStore.getState().user).toEqual(mockUser)
            expect(axiosInstance.post).toHaveBeenCalledWith(AUTH_BASE_URL + 'login', {
                ...loginData,
                role: 'AGENT',
            }, { withCredentials: true })
            expect(toast.success).toHaveBeenCalled()
        })

        it('should handle login failure', async () => {
            vi.mocked(axiosInstance.post).mockResolvedValue({ data: null })

            const loginData = { email: 'test@example.com', password: 'password' }
            const result = await useAuthStore.getState().login(loginData)

            expect(result).toBe(false)
            expect(useAuthStore.getState().isLoggedIn).toBe(false)
            expect(toast.error).toHaveBeenCalled()
        })
    })

    describe('googleLogin', () => {
        it('should google login successfully and set user if returned', async () => {
            const mockUser = { id: '1', name: 'Test User' }
            vi.mocked(axiosInstance.post).mockResolvedValue({ data: { success: true, user: mockUser } })

            const result = await useAuthStore.getState().googleLogin('token')

            expect(result).toBe(true)
            expect(useAuthStore.getState().isLoggedIn).toBe(true)
            expect(useAuthStore.getState().user).toEqual(mockUser)
            expect(toast.success).toHaveBeenCalled()
        })
    })

    describe('register', () => {
        it('should register successfully', async () => {
            vi.mocked(axiosInstance.post).mockResolvedValue({ data: { success: true } })

            const registerData = { email: 'test@example.com', password: 'password' }
            const result = await useAuthStore.getState().register(registerData)

            expect(result).toBe(true)
            expect(axiosInstance.post).toHaveBeenCalledWith(AUTH_BASE_URL + 'register', {
                ...registerData,
                role: 'AGENT',
            }, { withCredentials: true })
            expect(toast.success).toHaveBeenCalled()
        })
    })

    describe('logout', () => {
        it('should logout successfully', async () => {
            vi.mocked(axiosInstance.post).mockResolvedValue({ data: {} })

            await useAuthStore.getState().logout()

            expect(useAuthStore.getState().isLoggedIn).toBe(false)
            expect(useAuthStore.getState().user).toBeNull()
            expect(axiosInstance.post).toHaveBeenCalledWith(AUTH_BASE_URL + 'logout', {}, { withCredentials: true })
            expect(toast.success).toHaveBeenCalled()
        })
    })
})
