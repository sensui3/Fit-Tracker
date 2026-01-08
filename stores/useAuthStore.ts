import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '../types';
import { authClient } from '../lib/auth-client';

interface AuthState {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: any | null;

    // Actions
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: any | null) => void;

    // Auth Operations
    logout: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: true,
            error: null,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                error: null
            }),

            setSession: (session) => set({ session }),

            setLoading: (loading) => set({ isLoading: loading }),

            setError: (error) => set({ error }),

            clearError: () => set({ error: null }),

            logout: async () => {
                set({ isLoading: true });
                try {
                    await authClient.signOut();
                } catch (error) {
                    console.error('Erro ao sair:', error);
                } finally {
                    set({
                        user: null,
                        session: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                    });

                    // Redirecionamento forçado para garantir limpeza de cache e estado
                    if (typeof window !== 'undefined') {
                        window.location.href = '/#/login';
                        window.location.reload();
                    }
                }
            },
        }),
        {
            name: 'auth-storage',
            // Apenas persistir o que é necessário
            partialize: (state) => ({
                user: state.user,
                session: state.session,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
