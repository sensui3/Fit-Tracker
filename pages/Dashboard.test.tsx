import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import { dbService } from '../services/databaseService';
import { useAuthStore } from '../stores/useAuthStore';
import { Theme } from '../types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependências
vi.mock('../services/databaseService', () => ({
    dbService: {
        query: vi.fn(),
        getDashboardStats: vi.fn(),
        getRecentWorkouts: vi.fn(),
        getPersonalRecords: vi.fn(),
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
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    const renderWithProviders = (ui: React.ReactElement) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    {ui}
                </MemoryRouter>
            </QueryClientProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuthStore as any).mockReturnValue({
            user: mockUser,
            isAuthenticated: true,
        });

        // Mock optimized methods
        (dbService.getDashboardStats as any).mockResolvedValue({
            total_workouts: '10',
            total_volume: '5000',
            avg_duration: '2700' // 45 minutes in seconds
        });

        (dbService.getRecentWorkouts as any).mockResolvedValue([{
            id: 'session-1',
            start_time: new Date().toISOString(),
            end_time: new Date().toISOString(),
            total_volume: 100,
            plan_name: 'Treino A',
            duration_minutes: '30',
        }]);

        (dbService.getPersonalRecords as any).mockResolvedValue([{
            name: 'Supino',
            max_weight: 80
        }]);
    });

    it('should render welcome message with user name', async () => {
        renderWithProviders(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/Bem-vindo de volta, Pedro!/i)).toBeInTheDocument();
        });
    });

    it('should display stats from database', async () => {
        renderWithProviders(<Dashboard />);

        await waitFor(() => {
            // "10" for total workouts
            expect(screen.getByText('10')).toBeInTheDocument();
            // "5.000 kg" or "5,000 kg" depending on locale, but "5000" should be there
            expect(screen.getAllByText(/5.*000/)[0]).toBeInTheDocument();
        });
    });

    it('should render recent sessions', async () => {
        renderWithProviders(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Treino A')).toBeInTheDocument();
        });
    });
});
