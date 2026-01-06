import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWorkoutLogger } from './useWorkoutLogger';
import { useWorkoutStore } from '../stores/useWorkoutStore';

// Mock Zustand
vi.mock('../stores/useWorkoutStore', () => ({
    useWorkoutStore: vi.fn(),
}));

describe('useWorkoutLogger Hook', () => {
    const mockSetExerciseInput = vi.fn();
    const mockAddSet = vi.fn();
    const mockSelectExercise = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useWorkoutStore as any).mockImplementation((selector: any) => selector({
            exerciseInput: '',
            setExerciseInput: mockSetExerciseInput,
            sets: [],
            addSet: mockAddSet,
            selectExercise: mockSelectExercise,
            isResting: false,
            setResting: vi.fn(),
        }));
    });

    it('should update suggestions when input changes', () => {
        const { result } = renderHook(() => useWorkoutLogger());

        act(() => {
            result.current.handleInputChange('Supino');
        });

        expect(mockSetExerciseInput).toHaveBeenCalledWith('Supino');
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
