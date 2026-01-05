import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    language: string;
    notificationsEnabled: boolean;
    soundEnabled: boolean;
    setLanguage: (lang: string) => void;
    toggleNotifications: () => void;
    toggleSound: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            language: 'pt-BR',
            notificationsEnabled: true,
            soundEnabled: true,
            setLanguage: (language) => set({ language }),
            toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
            toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
        }),
        {
            name: 'settings-storage',
        }
    )
);
