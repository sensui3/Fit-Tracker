import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from './useSettingsStore';

describe('useSettingsStore', () => {
    beforeEach(() => {
        useSettingsStore.setState({
            language: 'pt-BR',
            notificationsEnabled: true,
            soundEnabled: true
        });
    });

    it('should set language', () => {
        useSettingsStore.getState().setLanguage('en-US');
        expect(useSettingsStore.getState().language).toBe('en-US');
    });

    it('should toggle notifications', () => {
        useSettingsStore.getState().toggleNotifications();
        expect(useSettingsStore.getState().notificationsEnabled).toBe(false);

        useSettingsStore.getState().toggleNotifications();
        expect(useSettingsStore.getState().notificationsEnabled).toBe(true);
    });

    it('should toggle sound', () => {
        useSettingsStore.getState().toggleSound();
        expect(useSettingsStore.getState().soundEnabled).toBe(false);
    });
});
