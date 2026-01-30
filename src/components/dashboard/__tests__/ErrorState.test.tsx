import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorState } from '../ErrorState'

describe('ErrorState', () => {
    it('should render message', () => {
        render(<ErrorState message="Fatal Error" onRetry={vi.fn()} />)
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        expect(screen.getByText('Fatal Error')).toBeInTheDocument()
    })

    it('should call onRetry when button clicked', () => {
        const mockRetry = vi.fn()
        render(<ErrorState message="Error" onRetry={mockRetry} />)

        fireEvent.click(screen.getByText('Try Again'))
        expect(mockRetry).toHaveBeenCalled()
    })
})
