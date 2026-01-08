import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './useAuthStore';
import { User } from '../types';

// Mock NeonAuthService
vi.mock('../services/auth/NeonAuthService', () => ({
    authService: {
        signOut: vi.fn().mockResolvedValue(undefined)
    }
}));

describe('useAuthStore', () => {
    beforeEach(() => {
        useAuthStore.setState({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: true,
            error: null
        });
    });

    it('should initial state be correct', () => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set user and isAuthenticated correctly', () => {
        const user = { id: '1', email: 'test@test.com', name: 'Test User' };
        useAuthStore.getState().setUser(user as User);

        const state = useAuthStore.getState();
        expect(state.user).toEqual(user);
        expect(state.isAuthenticated).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set error correctly', () => {
        const error = { message: 'Invalid credentials', code: 'AUTH_ERROR' };
        useAuthStore.getState().setError(error);

        expect(useAuthStore.getState().error).toEqual(error);
    });

    it('should clear user and session on logout', async () => {
        useAuthStore.setState({
            user: { id: '1' } as User,
            isAuthenticated: true
        });

        await useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it('should toggle loading state', () => {
        useAuthStore.getState().setLoading(false);
        expect(useAuthStore.getState().isLoading).toBe(false);

        useAuthStore.getState().setLoading(true);
        expect(useAuthStore.getState().isLoading).toBe(true);
    });
});
