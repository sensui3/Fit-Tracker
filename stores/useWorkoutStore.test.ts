import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWorkoutStore } from './useWorkoutStore';
import { useTimerStore } from './useTimerStore';

// Define o mock antes de carregar o store se possível, 
// ou use vi.mock no topo do arquivo.
const mockStartTimer = vi.fn();
vi.mock('./useTimerStore', () => ({
    useTimerStore: {
        getState: () => ({
            startTimer: mockStartTimer,
        }),
    },
}));

describe('useWorkoutStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useWorkoutStore.getState().resetLog();
    });

    it('should have initial state', () => {
        const state = useWorkoutStore.getState();
        expect(state.exerciseInput).toBe('');
        expect(state.sets).toHaveLength(3);
        expect(state.isResting).toBe(false);
    });

    it('should set exercise input with sanitization', () => {
        const { setExerciseInput } = useWorkoutStore.getState();
        setExerciseInput('<script>alert(1)</script>Bench');
        expect(useWorkoutStore.getState().exerciseInput).toBe('Bench');
    });

    it('should select an exercise', () => {
        const { selectExercise } = useWorkoutStore.getState();
        const exercise = { id: '1', name: 'Squat', muscleGroup: 'Legs', difficulty: 'Medium', equipment: 'Barbell', instructions: [] };
        selectExercise(exercise as any);
        expect(useWorkoutStore.getState().selectedExercise).toEqual(exercise);
        expect(useWorkoutStore.getState().exerciseInput).toBe('Squat');
    });

    it('should add a new set based on the last one', () => {
        const { addSet, updateSet } = useWorkoutStore.getState();
        // Update last set
        updateSet(3, 'weight', 50);
        updateSet(3, 'reps', 10);

        addSet();
        const state = useWorkoutStore.getState();
        expect(state.sets).toHaveLength(4);
        expect(state.sets[3].weight).toBe(50);
        expect(state.sets[3].reps).toBe(10);
        expect(state.sets[3].id).toBe(4);
    });

    it('should remove a set', () => {
        const { removeSet } = useWorkoutStore.getState();
        removeSet(2);
        const state = useWorkoutStore.getState();
        expect(state.sets).toHaveLength(2);
        expect(state.sets.find(s => s.id === 2)).toBeUndefined();
    });

    it('should update a set and trigger timer when completed', () => {
        const { updateSet } = useWorkoutStore.getState();

        updateSet(1, 'completed', true);

        const state = useWorkoutStore.getState();
        expect(state.sets[0].completed).toBe(true);
        expect(state.isResting).toBe(true);
        expect(mockStartTimer).toHaveBeenCalledWith(60);
    });

    it('should reset log', () => {
        const { setExerciseInput, updateSet, resetLog } = useWorkoutStore.getState();
        setExerciseInput('Deadlift');
        updateSet(1, 'completed', true);

        resetLog();

        const state = useWorkoutStore.getState();
        expect(state.exerciseInput).toBe('');
        expect(state.isResting).toBe(false);
        expect(state.sets[0].completed).toBe(false);
    });
});
