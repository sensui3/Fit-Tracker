import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Exercise } from '../types';
import { useTimerStore } from './useTimerStore';
import { sanitize } from '../lib/security';

export interface WorkoutSetDraft {
    id: number;
    reps: number;
    weight: number;
    completed: boolean;
    notes?: string;
    showNotes?: boolean;
}

interface WorkoutState {
    // Active Log State
    exerciseInput: string;
    selectedExercise: Exercise | null;
    sets: WorkoutSetDraft[];

    // Timer State
    isResting: boolean;

    // Actions
    setExerciseInput: (name: string) => void;
    selectExercise: (exercise: Exercise) => void;
    addSet: () => void;
    removeSet: (id: number) => void;
    updateSet: (id: number, field: keyof WorkoutSetDraft, value: any) => void;
    setResting: (resting: boolean) => void;
    resetLog: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
    persist(
        immer((set) => ({
            exerciseInput: '',
            selectedExercise: null,
            sets: [
                { id: 1, weight: 20, reps: 12, completed: false, notes: "", showNotes: false },
                { id: 2, weight: 20, reps: 12, completed: false, notes: "", showNotes: false },
                { id: 3, weight: 20, reps: 12, completed: false, notes: "", showNotes: false },
            ],
            isResting: false,

            setExerciseInput: (name) => set((state) => {
                state.exerciseInput = sanitize(name);
            }),

            selectExercise: (exercise) => set((state) => {
                state.selectedExercise = exercise;
                state.exerciseInput = exercise.name;
            }),

            addSet: () => set((state) => {
                const lastSet = state.sets[state.sets.length - 1];
                const newId = state.sets.length > 0 ? (state.sets[state.sets.length - 1].id + 1) : 1;
                state.sets.push({
                    id: newId,
                    weight: lastSet ? lastSet.weight : 0,
                    reps: lastSet ? lastSet.reps : 12,
                    completed: false,
                    notes: "",
                    showNotes: false
                });
            }),

            removeSet: (id) => set((state) => {
                state.sets = state.sets.filter((s) => s.id !== id);
            }),

            updateSet: (id, field, value) => set((state) => {
                const setIndex = state.sets.findIndex((s) => s.id === id);
                if (setIndex !== -1) {
                    // Sanitizar notas se o campo for 'notes'
                    const sanitizedValue = (field === 'notes' && typeof value === 'string')
                        ? sanitize(value)
                        : value;

                    state.sets[setIndex][field as any] = sanitizedValue;
                    if (field === 'completed' && value === true) {
                        state.isResting = true;
                        useTimerStore.getState().startTimer(60);
                    }
                }
            }),

            setResting: (resting) => set((state) => { state.isResting = resting; }),

            resetLog: () => set((state) => {
                state.exerciseInput = '';
                state.selectedExercise = null;
                state.sets = [
                    { id: 1, weight: 20, reps: 12, completed: false, notes: "", showNotes: false },
                    { id: 2, weight: 20, reps: 12, completed: false, notes: "", showNotes: false },
                    { id: 3, weight: 20, reps: 12, completed: false, notes: "", showNotes: false },
                ];
                state.isResting = false;
            }),
        })),
        {
            name: 'workout-storage',
            partialize: (state) => ({
                exerciseInput: state.exerciseInput,
                selectedExercise: state.selectedExercise,
                sets: state.sets
            }),
        }
    )
);
