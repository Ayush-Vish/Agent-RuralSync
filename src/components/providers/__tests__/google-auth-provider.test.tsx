import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GoogleOAuthWrapper } from '../google-auth-provider'

// Mock GoogleOAuthProvider
vi.mock('@react-oauth/google', () => ({
    GoogleOAuthProvider: ({ children }: any) => <div data-testid="google-provider">{children}</div>
}))

describe('GoogleOAuthWrapper', () => {
    it('should render children within provider', () => {
        render(
            <GoogleOAuthWrapper>
                <div>Child Content</div>
            </GoogleOAuthWrapper>
        )

        expect(screen.getByTestId('google-provider')).toBeInTheDocument()
        expect(screen.getByText('Child Content')).toBeInTheDocument()
    })
})
