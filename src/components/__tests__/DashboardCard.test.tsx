import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DashboardCard from '../DashboardCard'

describe('DashboardCard', () => {
    it('should render title and value', () => {
        render(<DashboardCard title="Total Sales" value={500} />)
        expect(screen.getByText('Total Sales')).toBeInTheDocument()
        expect(screen.getByText('500')).toBeInTheDocument()
    })
})
