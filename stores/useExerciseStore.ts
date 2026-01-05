import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExerciseStore {
    favoriteIds: string[];
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
}

export const useExerciseStore = create<ExerciseStore>()(
    persist(
        (set, get) => ({
            favoriteIds: [],
            toggleFavorite: (id) => set((state) => ({
                favoriteIds: state.favoriteIds.includes(id)
                    ? state.favoriteIds.filter(fid => fid !== id)
                    : [...state.favoriteIds, id]
            })),
            isFavorite: (id) => get().favoriteIds.includes(id),
        }),
        {
            name: 'exercise-storage',
        }
    )
);
