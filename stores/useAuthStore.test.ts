import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './useAuthStore';

// Mock auth-client
vi.mock('../lib/auth-client', () => ({
    signOut: vi.fn().mockResolvedValue(true)
}));

describe('useAuthStore', () => {
    beforeEach(() => {
        useAuthStore.setState({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: true
        });
    });

    it('should initial state be unauthenticated', () => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isLoading).toBe(true);
    });

    it('should set user correctly', () => {
        const user = { id: '1', email: 'test@test.com', name: 'Test User' };
        useAuthStore.getState().setUser(user as any);

        const state = useAuthStore.getState();
        expect(state.user).toEqual(user);
        expect(state.isAuthenticated).toBe(true);
        // Em useAuthStore.ts, setUser não altera isLoading automaticamente
    });

    it('should clear user on logout', async () => {
        const user = { id: '1', email: 'test@test.com', name: 'Test User' };
        useAuthStore.getState().setUser(user as any);
        await useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it('should handle loading state', () => {
        useAuthStore.getState().setLoading(true);
        expect(useAuthStore.getState().isLoading).toBe(true);

        useAuthStore.getState().setLoading(false);
        expect(useAuthStore.getState().isLoading).toBe(false);
    });
});
