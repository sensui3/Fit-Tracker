import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '../types';
import { signOut } from '../lib/auth-client';

interface AuthState {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: true,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setSession: (session) => set({ session }),
            setLoading: (loading) => set({ isLoading: loading }),
            logout: async () => {
                try {
                    await signOut();
                } catch (error) {
                    console.error('Erro ao sair:', error);
                } finally {
                    set({ user: null, session: null, isAuthenticated: false });
                    // Redirecionamento forçado para garantir limpeza
                    window.location.href = '/#/login';
                    window.location.reload();
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, session: state.session, isAuthenticated: state.isAuthenticated }),
        }
    )
);

