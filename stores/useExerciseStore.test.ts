import { describe, it, expect, beforeEach } from 'vitest';
import { useExerciseStore } from './useExerciseStore';

describe('useExerciseStore', () => {
    beforeEach(() => {
        useExerciseStore.setState({ favoriteIds: [] });
    });

    it('should toggle favorite status', () => {
        const id = 'ex-1';

        // Add to favorites
        useExerciseStore.getState().toggleFavorite(id);
        expect(useExerciseStore.getState().favoriteIds).toContain(id);
        expect(useExerciseStore.getState().isFavorite(id)).toBe(true);

        // Remove from favorites
        useExerciseStore.getState().toggleFavorite(id);
        expect(useExerciseStore.getState().favoriteIds).not.toContain(id);
        expect(useExerciseStore.getState().isFavorite(id)).toBe(false);
    });

    it('should handle multiple favorites', () => {
        useExerciseStore.getState().toggleFavorite('1');
        useExerciseStore.getState().toggleFavorite('2');

        expect(useExerciseStore.getState().favoriteIds).toHaveLength(2);
        expect(useExerciseStore.getState().favoriteIds).toEqual(['1', '2']);
    });
});
