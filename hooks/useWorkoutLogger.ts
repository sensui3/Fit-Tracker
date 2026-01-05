import { useState } from 'react';
import { useWorkoutStore } from '../stores/useWorkoutStore';
import { EXERCISES, Exercise } from '../data/exercises';

export interface WorkoutSet {
    id: number;
    reps: number;
    weight: number;
    completed: boolean;
    notes?: string;
    showNotes?: boolean;
}

export const useWorkoutLogger = () => {
    const {
        exerciseInput,
        setExerciseInput,
        sets,
        addSet,
        removeSet,
        updateSet,
        isResting,
        setResting,
        selectExercise
    } = useWorkoutStore();

    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const handleInputChange = (userInput: string) => {
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
    };

    const handleSelectExercise = (exercise: Exercise) => {
        selectExercise(exercise);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
    };

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
