import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatsCard } from '../StatsCard'
import { Plus } from 'lucide-react'

describe('StatsCard', () => {
    it('should render title and value', () => {
        render(
            <StatsCard
                title="Total Bookings"
                value={100}
                icon={Plus}
                gradient="blue"
            />
        )
        expect(screen.getByText('Total Bookings')).toBeInTheDocument()
        expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('should render subtitle when provided', () => {
        render(
            <StatsCard
                title="Revenue"
                value="$1000"
                subtitle="+10% from last month"
                icon={Plus}
                gradient="green"
            />
        )
        expect(screen.getByText('+10% from last month')).toBeInTheDocument()
    })

    it('should apply gradient class correctly', () => {
        const { container } = render(
            <StatsCard
                title="Test"
                value={0}
                icon={Plus}
                gradient="red"
            />
        )
        expect(container.firstChild).toHaveClass('bg-gradient-to-br from-red-500 to-red-600')
    })
})
