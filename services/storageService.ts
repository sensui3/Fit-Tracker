/**
 * Service to handle local storage persistence with type safety and error handling.
 * This prepares the app for offline-first capabilities and better state management.
 */

export enum StorageKey {
    USER_PREFERENCES = 'fit_tracker_user_prefs',
    WORKOUT_DRAFT = 'fit_tracker_workout_draft',
    AUTH_TOKEN = 'fit_tracker_auth_token',
}

class StorageService {
    /**
     * Saves data to localStorage
     */
    setItem<T>(key: StorageKey, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Retrieves data from localStorage
     */
    getItem<T>(key: StorageKey): T | null {
        try {
            const value = localStorage.getItem(key);
            if (!value) return null;
            return JSON.parse(value) as T;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    /**
     * Removes data from localStorage
     */
    removeItem(key: StorageKey): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    /**
     * Clears all storage keys managed by this service
     */
    clearAll(): void {
        Object.values(StorageKey).forEach(key => {
            this.removeItem(key as StorageKey);
        });
    }
}

export const storageService = new StorageService();
