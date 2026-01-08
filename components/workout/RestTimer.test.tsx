import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RestTimer } from './RestTimer';
import { useTimerStore } from '../../stores/useTimerStore';

// Mock useTimerStore
vi.mock('../../stores/useTimerStore', () => ({
    useTimerStore: vi.fn(),
}));

const mockUseTimerStore = vi.mocked(useTimerStore);

describe('RestTimer Component', () => {
    const mockOnClose = vi.fn();
    const mockStopTimer = vi.fn();
    const mockAdjustTime = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseTimerStore.mockReturnValue({
            timeLeft: 60,
            isActive: true,
            tick: vi.fn(),
            stopTimer: mockStopTimer,
            adjustTime: mockAdjustTime,
            initialTime: 60,
            setTimeLeft: vi.fn(),
        });
    });

    it('should show formatted time when active', () => {
        render(<RestTimer onClose={mockOnClose} />);
        expect(screen.getByText('1:00')).toBeInTheDocument();
    });

    it('should return null when not active', () => {
        mockUseTimerStore.mockReturnValue({
            isActive: false,
        } as any);
        const { container } = render(<RestTimer onClose={mockOnClose} />);
        expect(container.firstChild).toBeNull();
    });

    it('should call adjustTime when clicking +/- buttons', () => {
        render(<RestTimer onClose={mockOnClose} />);

        fireEvent.click(screen.getByTitle('+10s'));
        expect(mockAdjustTime).toHaveBeenCalledWith(10);

        fireEvent.click(screen.getByTitle('-10s'));
        expect(mockAdjustTime).toHaveBeenCalledWith(-10);
    });

    it('should call stopTimer when clicking Pular', () => {
        render(<RestTimer onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Pular'));
        expect(mockStopTimer).toHaveBeenCalled();
    });
});
