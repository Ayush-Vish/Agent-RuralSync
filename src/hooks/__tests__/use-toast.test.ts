import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useToast, toast } from '../use-toast'

describe('useToast', () => {
    it('should add a toast', () => {
        const { result } = renderHook(() => useToast())

        act(() => {
            result.current.toast({ title: 'Test Toast' })
        })

        expect(result.current.toasts).toHaveLength(1)
        expect(result.current.toasts[0].title).toBe('Test Toast')
    })

    it('should dismiss a toast', () => {
        const { result } = renderHook(() => useToast())

        // Add a toast
        let toastId: string
        act(() => {
            const res = result.current.toast({ title: 'Test Toast' })
            toastId = res.id
        })

        expect(result.current.toasts).toHaveLength(1)
        expect(result.current.toasts[0].open).toBe(true)

        // Dismiss it
        act(() => {
            result.current.dismiss(toastId)
        })

        expect(result.current.toasts[0].open).toBe(false)
    })

    it('should add toast via exported function', () => {
        const { result } = renderHook(() => useToast())

        act(() => {
            toast({ title: 'External Toast' })
        })

        expect(result.current.toasts[0].title).toBe('External Toast')
    })
})
