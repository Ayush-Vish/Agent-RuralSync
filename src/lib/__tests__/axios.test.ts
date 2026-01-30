import { describe, it, expect, vi } from 'vitest'
import axiosInstance from '../axios'

describe('axiosInstance', () => {
    it('should be created with withCredentials true', () => {
        expect(axiosInstance.defaults.withCredentials).toBe(true)
    })
})
