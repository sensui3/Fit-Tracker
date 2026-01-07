import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GlobalToast } from './Toast';
import { useUIStore } from '../../stores/useUIStore';

// Mock store
vi.mock('../../stores/useUIStore', () => ({
    useUIStore: vi.fn(),
}));

describe('Toast Component', () => {
    const mockRemoveToast = vi.fn();
    const mockToasts = [
        { id: '1', type: 'success', title: 'Success', message: 'Operation successful', duration: 3000 },
        { id: '2', type: 'error', message: 'Error occurred', duration: 5000 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useUIStore as any).mockReturnValue({
            toasts: mockToasts,
            removeToast: mockRemoveToast,
            addToast: vi.fn(),
        });
    });

    it('should render toasts', () => {
        render(<GlobalToast />);
        expect(screen.getByText('Operation successful')).toBeInTheDocument();
        expect(screen.getByText('Error occurred')).toBeInTheDocument();
    });

    it('should call removeToast after duration', () => {
        vi.useFakeTimers();
        render(<GlobalToast />);

        act(() => {
            vi.runAllTimers();
        });

        expect(mockRemoveToast).toHaveBeenCalledWith('1');
        vi.useRealTimers();
    });

    it('should call removeToast when close button is clicked', () => {
        vi.useFakeTimers();
        render(<GlobalToast />);
        // Find close button for first toast
        const closeButtons = screen.getAllByRole('button', { name: /Close/i });
        const firstCloseBtn = closeButtons[0];

        fireEvent.click(firstCloseBtn);

        // Wait for animation
        act(() => {
            vi.runAllTimers();
        });

        expect(mockRemoveToast).toHaveBeenCalledWith('1');
        vi.useRealTimers();
    });
});
