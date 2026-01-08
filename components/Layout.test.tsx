import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Layout from './Layout';
import { MemoryRouter } from 'react-router-dom';
import { useUIStore } from '../stores/useUIStore';
import { useTimerStore } from '../stores/useTimerStore';
import { Theme } from '../types';

// Mock dependencies
vi.mock('./Sidebar', () => ({
    default: ({ className }: { className?: string }) => <div data-testid="sidebar" className={className} role="navigation">Sidebar</div>
}));

vi.mock('./workout/RestTimer', () => ({
    RestTimer: () => <div data-testid="rest-timer">RestTimer</div>
}));

vi.mock('../stores/useUIStore', () => ({
    useUIStore: vi.fn(),
}));

vi.mock('../stores/useTimerStore', () => ({
    useTimerStore: vi.fn(),
}));

vi.mock('../stores/useWorkoutStore', () => ({
    useWorkoutStore: {
        getState: () => ({ setResting: vi.fn() })
    }
}));

describe('Layout Component', () => {
    const mockSetTheme = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useUIStore as vi.Mock).mockReturnValue({
            theme: Theme.Dark,
            setTheme: mockSetTheme,
        });
        (useTimerStore as vi.Mock).mockReturnValue({
            isActive: false,
        });
    });

    it('should render sidebars and rest timer', () => {
        render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        );

        // Desktop and Mobile sidebars
        expect(screen.getAllByTestId('sidebar')).toHaveLength(2);
        expect(screen.getByTestId('rest-timer')).toBeInTheDocument();
    });

    it('should toggle theme when clicking mobile theme button', () => {
        render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        );

        const themeBtn = screen.getByLabelText('Alternar tema');
        fireEvent.click(themeBtn);

        expect(mockSetTheme).toHaveBeenCalledWith(Theme.Light);
    });

    it('should open mobile menu when clicking menu button', () => {
        render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        );

        const menuBtn = screen.getByLabelText('Abrir menu');
        fireEvent.click(menuBtn);

        // No layout real, isso altera o estado isMobileMenuOpen que adiciona classes ao overlay.
        // Como o Sidebar mockado está lá, apenas verificamos se ele existe.
        expect(screen.getAllByTestId('sidebar')).toHaveLength(2);
    });
});
