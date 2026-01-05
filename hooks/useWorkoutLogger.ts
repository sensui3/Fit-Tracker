import { useState, useCallback } from 'react';
import { useWorkoutStore } from '../stores/useWorkoutStore';
import { EXERCISES } from '../data/exercises';
import { Exercise } from '../types';

export interface WorkoutSet {
    id: number;
    reps: number;
    weight: number;
    completed: boolean;
    notes?: string;
    showNotes?: boolean;
}

export const useWorkoutLogger = () => {
    const exerciseInput = useWorkoutStore(state => state.exerciseInput);
    const setExerciseInput = useWorkoutStore(state => state.setExerciseInput);
    const sets = useWorkoutStore(state => state.sets);
    const addSet = useWorkoutStore(state => state.addSet);
    const removeSet = useWorkoutStore(state => state.removeSet);
    const updateSet = useWorkoutStore(state => state.updateSet);
    const isResting = useWorkoutStore(state => state.isResting);
    const setResting = useWorkoutStore(state => state.setResting);
    const selectExercise = useWorkoutStore(state => state.selectExercise);

    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const handleInputChange = useCallback((userInput: string) => {
        setExerciseInput(userInput);
        if (userInput.length > 0) {
            const filtered = EXERCISES.filter(
                (exercise) => exercise.name.toLowerCase().includes(userInput.toLowerCase())
            ).map(e => ({
                ...e,
                muscle_group: e.muscle, // Map legacy field
                is_custom: false
            } as unknown as Exercise));
            setFilteredExercises(filtered);
            setShowSuggestions(true);
            setHighlightedIndex(-1);
        } else {
            setShowSuggestions(false);
        }
    }, [setExerciseInput]);

    const handleSelectExercise = useCallback((exercise: Exercise) => {
        selectExercise(exercise);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
    }, [selectExercise]);

    return {
        exerciseInput,
        filteredExercises,
        showSuggestions,
        setShowSuggestions,
        highlightedIndex,
        setHighlightedIndex,
        isResting,
        setIsResting: setResting,
        sets,
        handleAddSet: addSet,
        handleRemoveSet: removeSet,
        updateSet,
        handleInputChange,
        handleSelectExercise,
        DEFAULT_REST_TIME: 60
    };
};
