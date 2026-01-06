import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService, StorageKey } from './storageService';

describe('storageService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should set and get item correctly', () => {
        const data = { theme: 'dark' };
        storageService.setItem(StorageKey.USER_PREFERENCES, data);

        const result = storageService.getItem(StorageKey.USER_PREFERENCES);
        expect(result).toEqual(data);
    });

    it('should return null if item does not exist', () => {
        const result = storageService.getItem(StorageKey.AUTH_TOKEN);
        expect(result).toBeNull();
    });

    it('should remove item', () => {
        storageService.setItem(StorageKey.AUTH_TOKEN, 'my-token');
        storageService.removeItem(StorageKey.AUTH_TOKEN);

        expect(storageService.getItem(StorageKey.AUTH_TOKEN)).toBeNull();
    });

    it('should clear all managed keys', () => {
        storageService.setItem(StorageKey.AUTH_TOKEN, 'token');
        storageService.setItem(StorageKey.USER_PREFERENCES, { p: 1 });

        storageService.clearAll();

        expect(storageService.getItem(StorageKey.AUTH_TOKEN)).toBeNull();
        expect(storageService.getItem(StorageKey.USER_PREFERENCES)).toBeNull();
    });

    it('should handle JSON parse error', () => {
        localStorage.setItem(StorageKey.USER_PREFERENCES, 'invalid-json');

        const result = storageService.getItem(StorageKey.USER_PREFERENCES);
        expect(result).toBeNull();
    });
});
