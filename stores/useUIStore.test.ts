import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './useUIStore';
import { Theme } from '../types';

describe('useUIStore', () => {
    beforeEach(() => {
        // Reset manual
        useUIStore.setState({
            theme: Theme.Dark,
            sidebarOpen: true,
            toasts: []
        });
    });

    it('should toggle sidebar', () => {
        useUIStore.getState().toggleSidebar();
        expect(useUIStore.getState().sidebarOpen).toBe(false);

        useUIStore.getState().toggleSidebar();
        expect(useUIStore.getState().sidebarOpen).toBe(true);
    });

    it('should set theme', () => {
        useUIStore.getState().setTheme(Theme.Light);
        expect(useUIStore.getState().theme).toBe(Theme.Light);
    });

    it('should add and remove toasts', () => {
        useUIStore.getState().addToast({ message: 'Test', type: 'info' });
        const state = useUIStore.getState();
        expect(state.toasts).toHaveLength(1);
        expect(state.toasts[0].message).toBe('Test');

        const id = state.toasts[0].id;
        useUIStore.getState().removeToast(id);
        expect(useUIStore.getState().toasts).toHaveLength(0);
    });
});
