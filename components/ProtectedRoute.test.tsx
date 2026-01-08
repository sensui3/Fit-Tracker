import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

/// <reference types="vitest" />
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock useAuth hook
vi.mock('../hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show loading spinner when loading', () => {
        (useAuth as any).mockReturnValue({
            isLoading: true,
            isAuthenticated: false,
        });

        const { container } = render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div data-testid="protected-content">Protected</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to login when not authenticated', () => {
        (useAuth as any).mockReturnValue({
            isLoading: false,
            isAuthenticated: false,
        });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <div data-testid="protected-content">Protected</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('login-page')).toBeInTheDocument();
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should render children when authenticated', () => {
        (useAuth as any).mockReturnValue({
            isLoading: false,
            isAuthenticated: true,
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div data-testid="protected-content">Protected</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
});
