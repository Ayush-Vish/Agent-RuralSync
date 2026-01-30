import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DashboardSkeleton } from '../DashboardSkeleton'

describe('DashboardSkeleton', () => {
    it('should render without crashing', () => {
        const { container } = render(<DashboardSkeleton />)
        expect(container).toBeInTheDocument()
        // Check for skeleton classes presence
        expect(container.getElementsByClassName('animate-pulse').length).toBeGreaterThan(0)
    })
})
