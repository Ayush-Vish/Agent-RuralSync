import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ImageUpload from '../uploadImage'

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('ImageUpload', () => {
    const mockOnChange = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render label and upload button', () => {
        render(<ImageUpload label="Profile Pic" value={[]} onChange={mockOnChange} />)
        expect(screen.getByText('Profile Pic')).toBeInTheDocument()
        expect(screen.getByText('Choose File')).toBeInTheDocument()
    })

    it('should handle file selection', async () => {
        render(<ImageUpload label="Upload" value={[]} onChange={mockOnChange} />)

        const file = new File(['hello'], 'hello.png', { type: 'image/png' })
        const input = screen.getByLabelText('Upload') // Assuming label is associated with input or we find by id
        // Actually label association might be tricky if not perfectly standard, let's find input by type file hidden or not
        // The component puts id `file-upload-${label}` on input

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

        // fireEvent.change(fileInput, { target: { files: [file] } })
        // Error: "files" property is read-only. We need user-event or defineProperty override. 
        // Or simpler standard way:
        Object.defineProperty(fileInput, 'files', { value: [file] })
        fireEvent.change(fileInput)

        expect(mockOnChange).toHaveBeenCalledWith([file])
        expect(global.URL.createObjectURL).toHaveBeenCalled()
    })

    it('should display existing files', () => {
        const file = new File([''], 'existing.png', { type: 'image/png' })
        render(<ImageUpload label="Upload" value={[file]} onChange={mockOnChange} />)

        expect(screen.getByText('existing.png')).toBeInTheDocument()
    })

    it('should remove file when clicking remove button', () => {
        const file = new File([''], 'remove-me.png', { type: 'image/png' })
        render(<ImageUpload label="Upload" value={[file]} onChange={mockOnChange} />)

        expect(screen.getByText('remove-me.png')).toBeInTheDocument()

        // Find remove button. It's inside the card, often hidden until hover, but exists in DOM.
        // It has X icon.
        // We can find by role button inside the card or just the only button that is destructive?
        // Or checking all buttons.

        // Let's use getByRole button that contains or is near text
        // Actually simpler: check for X icon or class? 
        // Component uses Lucide X.

        // We can just query selector for the button in the card
        const removeBtn = screen.getAllByRole('button')[1] // 0 is upload, 1 is remove
        fireEvent.click(removeBtn)

        expect(mockOnChange).toHaveBeenCalledWith([])
        expect(global.URL.revokeObjectURL).toHaveBeenCalled()
    })
})
