import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SidebarMenuComponent from '../sidebar-menu'
import { useOrgStore } from '@/stores/org.store'
import { SidebarProvider } from '@/components/ui/sidebar'

// Mock store
vi.mock('@/stores/org.store')

describe('SidebarMenuComponent', () => {
    const mockOnSectionChange = vi.fn()

    const renderWithProvider = (component: React.ReactNode) => {
        return render(
            <SidebarProvider>
                {component}
            </SidebarProvider>
        )
    }

    beforeEach(() => {
        vi.clearAllMocks()
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(), // deprecated
                removeListener: vi.fn(), // deprecated
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        })
    })

    it('should render organization name when details exist', () => {
        vi.mocked(useOrgStore).mockImplementation((selector) => selector({
            orgDetails: { name: 'Acme Corp' } as any,
            isLoading: false,
            setOrgDetails: vi.fn(),
            getOrgDetails: vi.fn()
        }))

        renderWithProvider(<SidebarMenuComponent onSectionChange={mockOnSectionChange} />)
        expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    })

    it('should render default title when no org details', () => {
        vi.mocked(useOrgStore).mockImplementation((selector) => selector({
            orgDetails: null,
            isLoading: false,
            setOrgDetails: vi.fn(),
            getOrgDetails: vi.fn()
        }))

        renderWithProvider(<SidebarMenuComponent onSectionChange={mockOnSectionChange} />)
        expect(screen.getByText('Service Provider Dashboard')).toBeInTheDocument()
    })

    it('should call onSectionChange when menu items clicked', () => {
        vi.mocked(useOrgStore).mockImplementation((selector) => selector({
            orgDetails: null,
            isLoading: false,
            setOrgDetails: vi.fn(),
            getOrgDetails: vi.fn()
        }))

        renderWithProvider(<SidebarMenuComponent onSectionChange={mockOnSectionChange} />)

        fireEvent.click(screen.getByText('Organization Details'))
        expect(mockOnSectionChange).toHaveBeenCalledWith('org-details')

        fireEvent.click(screen.getByText('Services'))
        expect(mockOnSectionChange).toHaveBeenCalledWith('services')

        fireEvent.click(screen.getByText('Agents'))
        expect(mockOnSectionChange).toHaveBeenCalledWith('agents')
    })
})
