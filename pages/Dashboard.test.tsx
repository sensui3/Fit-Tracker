import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import { dbService } from '../services/databaseService';
import { useAuthStore } from '../stores/useAuthStore';
import { Theme } from '../types';

// Mock dependências
vi.mock('../services/databaseService', () => ({
    dbService: {
        query: vi.fn(),
    }
}));

vi.mock('../stores/useAuthStore', () => ({
    useAuthStore: vi.fn(),
}));

vi.mock('../stores/useUIStore', () => ({
    useUIStore: () => ({
        theme: Theme.Dark,
        setTheme: vi.fn(),
    }),
}));

// Mock do componente de gráfico lento
vi.mock('../components/dashboard/WorkoutVolumeChart', () => ({
    default: () => <div data-testid="mock-chart">Chart</div>
}));

describe('Dashboard Page', () => {
    const mockUser = { id: 'user-1', name: 'Pedro Secundo' };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuthStore as any).mockReturnValue({
            user: mockUser,
            isAuthenticated: true,
        });

        // Mock default responses for queries
        (dbService.query as any).mockImplementation(async (strings: any) => {
            const queryStr = Array.isArray(strings) ? strings[0] : strings;
            if (queryStr.includes('COUNT(DISTINCT ws.id)')) {
                return [{ total_workouts: '10', total_volume: '5000', avg_session_time: '45' }];
            }
            if (queryStr.includes('ws.start_time')) {
                return [{
                    id: 1,
                    start_time: new Date().toISOString(),
                    end_time: new Date().toISOString(),
                    total_volume: 100,
                    plan_name: 'Treino A',
                    duration_minutes: 30,
                    icon: 'fitness_center',
                    color: 'orange',
                    tag: 'Planejado'
                }];
            }
            if (queryStr.includes('MAX(s.weight)')) {
                return [{ name: 'Supino', max_weight: 80 }];
            }
            return [];
        });
    });

    it('should render welcome message with user name', async () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Bem-vindo de volta, Pedro!/i)).toBeInTheDocument();
        });
    });

    it('should display stats from database', async () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            // Busca por texto que contenha o número 10
            expect(screen.getAllByText(/10/).length).toBeGreaterThanOrEqual(1);
            // Busca por 5000 com possível separador de milhar
            expect(screen.getByText(/5.*000/)).toBeInTheDocument();
        });
    });

    it('should render recent sessions', async () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Treino A')).toBeInTheDocument();
        });
    });
});
