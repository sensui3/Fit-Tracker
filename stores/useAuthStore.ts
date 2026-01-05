import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '../types';

interface AuthState {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
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
            logout: () => set({ user: null, session: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, session: state.session, isAuthenticated: state.isAuthenticated }),
        }
    )
);
