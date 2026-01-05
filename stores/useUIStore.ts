import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '../types';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    message: string;
    duration?: number;
}

interface UIState {
    theme: Theme;
    sidebarOpen: boolean;
    toasts: Toast[];
    setTheme: (theme: Theme) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            theme: Theme.Dark,
            sidebarOpen: false,
            toasts: [],
            setTheme: (theme) => set({ theme }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            addToast: (toast) => {
                const id = Math.random().toString(36).substring(7);
                const newToast = { ...toast, id };
                set((state) => ({ toasts: [...state.toasts, newToast] }));
            },
            removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
        }),
        {
            name: 'ui-storage',
            partialize: (state) => ({ theme: state.theme }),
        }
    )
);
