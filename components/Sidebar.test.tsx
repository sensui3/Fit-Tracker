import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sidebar from './Sidebar';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

// Mock useAuthStore
vi.mock('../stores/useAuthStore', () => ({
    useAuthStore: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Sidebar Component', () => {
    const mockLogout = vi.fn();
    const mockUser = { name: 'João Silva', image: null };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuthStore as any).mockReturnValue({
            user: mockUser,
            logout: mockLogout,
        });
    });

    it('should render navigation links', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Painel')).toBeInTheDocument();
        expect(screen.getByText('Treinos')).toBeInTheDocument();
        expect(screen.getByText('Exercícios')).toBeInTheDocument();
    });

    it('should navigate to log-workout when clicking NOVO TREINO', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const btn = screen.getByText('NOVO TREINO');
        fireEvent.click(btn);

        expect(mockNavigate).toHaveBeenCalledWith('/log-workout');
    });

    it('should call logout when clicking exit icon', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const btn = screen.getByLabelText('Encerrar sessão');
        fireEvent.click(btn);

        expect(mockLogout).toHaveBeenCalled();
    });
});
