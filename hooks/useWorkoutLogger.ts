import { useState, useCallback } from 'react';
import { useWorkoutStore } from '../stores/useWorkoutStore';
import { useExerciseFilters, Exercise } from './useExerciseFilters';

export const useWorkoutLogger = () => {
    const {
        searchTerm,
        setSearchTerm,
        filteredExercises,
        loading
    } = useExerciseFilters();

    const selectedExercise = useWorkoutStore(state => state.selectedExercise);
    const sets = useWorkoutStore(state => state.sets);
    const isResting = useWorkoutStore(state => state.isResting);
    const addSet = useWorkoutStore(state => state.addSet);
    const removeSet = useWorkoutStore(state => state.removeSet);
    const updateSet = useWorkoutStore(state => state.updateSet);
    const setResting = useWorkoutStore(state => state.setResting);
    const selectExercise = useWorkoutStore(state => state.selectExercise);
    const finishWorkout = useWorkoutStore(state => state.finishWorkout);

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const handleInputChange = useCallback((userInput: string) => {
        setSearchTerm(userInput);
        setShowSuggestions(userInput.length > 0);
        setHighlightedIndex(-1);
    }, [setSearchTerm]);

    const handleSelectExercise = useCallback((exercise: Exercise | null) => {
        if (exercise) {
            setSearchTerm(exercise.name);
        } else {
            setSearchTerm('');
        }
        selectExercise(exercise as any);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
    }, [selectExercise, setSearchTerm]);

    return {
        exerciseInput: searchTerm,
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
        finishWorkout,
        selectedExercise,
        loadingExercises: loading,
        DEFAULT_REST_TIME: 60
    };
};
