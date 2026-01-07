import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWorkoutLogger } from './useWorkoutLogger';
import { useWorkoutStore } from '../stores/useWorkoutStore';
import { useExerciseFilters } from './useExerciseFilters';

// Mock Zustand
vi.mock('../stores/useWorkoutStore', () => ({
    useWorkoutStore: vi.fn(),
}));

// Mock useExerciseFilters to avoid DB/Auth dependencies
vi.mock('./useExerciseFilters', () => ({
    useExerciseFilters: vi.fn(() => ({
        searchTerm: '',
        setSearchTerm: vi.fn(),
        filteredExercises: [
            { id: '1', name: 'Supino', muscle: 'Peito', muscle_group: 'Peito', image: 'img.jpg' }
        ],
        loading: false,
        error: null,
        clearFilters: vi.fn(),
        addCustomExercise: vi.fn()
    }))
}));

describe('useWorkoutLogger Hook', () => {
    const mockSetSearchTerm = vi.fn();
    const mockAddSet = vi.fn();
    const mockSelectExercise = vi.fn();
    const mockFinishWorkout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useWorkoutStore as any).mockImplementation((selector: any) => selector({
            selectedExercise: null,
            sets: [],
            addSet: mockAddSet,
            selectExercise: mockSelectExercise,
            isResting: false,
            setResting: vi.fn(),
            finishWorkout: mockFinishWorkout,
        }));

        (useExerciseFilters as any).mockReturnValue({
            searchTerm: '',
            setSearchTerm: mockSetSearchTerm,
            filteredExercises: [
                { id: '1', name: 'Supino', muscle: 'Peito', muscle_group: 'Peito', image: 'img.jpg' }
            ],
            loading: false,
            error: null,
            clearFilters: vi.fn(),
            addCustomExercise: vi.fn()
        });
    });

    it('should update suggestions when input changes', () => {
        const { result } = renderHook(() => useWorkoutLogger());

        act(() => {
            result.current.handleInputChange('Supino');
        });

        expect(mockSetSearchTerm).toHaveBeenCalledWith('Supino');
        expect(result.current.showSuggestions).toBe(true);
        expect(result.current.filteredExercises.length).toBeGreaterThan(0);
    });

    it('should select exercise and hide suggestions', () => {
        const { result } = renderHook(() => useWorkoutLogger());
        const mockExercise = { name: 'Deadlift' } as any;

        act(() => {
            result.current.handleSelectExercise(mockExercise);
        });

        expect(mockSelectExercise).toHaveBeenCalledWith(mockExercise);
        expect(result.current.showSuggestions).toBe(false);
    });

    it('should call handleAddSet', () => {
        const { result } = renderHook(() => useWorkoutLogger());

        act(() => {
            result.current.handleAddSet();
        });

        expect(mockAddSet).toHaveBeenCalled();
    });
});
