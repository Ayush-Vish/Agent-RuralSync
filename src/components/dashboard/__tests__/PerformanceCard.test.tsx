import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PerformanceCard } from '../PerformanceCard'

describe('PerformanceCard', () => {
    it('should render basic stats', () => {
        render(<PerformanceCard completionRate={50} activeBookings={5} completedCount={10} />)

        expect(screen.getByText('Performance Overview')).toBeInTheDocument()
        expect(screen.getByText('50%')).toBeInTheDocument()
        expect(screen.getByText('5')).toBeInTheDocument()
        expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('should display correct label for High completion rate', () => {
        render(<PerformanceCard completionRate={90} activeBookings={0} completedCount={0} />)
        expect(screen.getByText('Excellent')).toHaveClass('text-green-600')
    })

    it('should display correct label for Good completion rate', () => {
        render(<PerformanceCard completionRate={70} activeBookings={0} completedCount={0} />)
        expect(screen.getByText('Good')).toHaveClass('text-blue-600')
    })

    it('should display correct label for Average completion rate', () => {
        render(<PerformanceCard completionRate={50} activeBookings={0} completedCount={0} />)
        expect(screen.getByText('Average')).toHaveClass('text-yellow-600')
    })

    it('should display correct label for Low completion rate', () => {
        render(<PerformanceCard completionRate={30} activeBookings={0} completedCount={0} />)
        expect(screen.getByText('Needs Improvement')).toHaveClass('text-red-600')
    })
})
