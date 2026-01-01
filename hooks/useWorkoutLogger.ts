import { useState, useEffect, useCallback } from 'react';
import { EXERCISES, Exercise } from '../data/exercises';

export interface WorkoutSet {
    id: number;
    reps: number;
    weight: number;
    completed: boolean;
    notes?: string;
    showNotes?: boolean;
}

const DEFAULT_REST_TIME = 60;

export const useWorkoutLogger = () => {
    const [exerciseInput, setExerciseInput] = useState('');
    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isResting, setIsResting] = useState(false);
    const [sets, setSets] = useState<WorkoutSet[]>([
        { id: 1, weight: 20, reps: 12, completed: false, notes: "", showNotes: false },
        { id: 2, weight: 20, reps: 12, completed: false, notes: "", showNotes: false },
        { id: 3, weight: 20, reps: 12, completed: false, notes: "", showNotes: false },
    ]);

    const handleAddSet = useCallback(() => {
        setSets(prev => {
            const lastSet = prev[prev.length - 1];
            const newId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 1;
            return [
                ...prev,
                {
                    id: newId,
                    weight: lastSet ? lastSet.weight : 0,
                    reps: lastSet ? lastSet.reps : 12,
                    completed: false,
                    notes: "",
                    showNotes: false
                }
            ];
        });
    }, []);

    const handleRemoveSet = useCallback((id: number) => {
        setSets(prev => prev.filter(s => s.id !== id));
    }, []);

    const updateSet = useCallback((id: number, field: keyof WorkoutSet, value: number | boolean | string) => {
        setSets(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

        if (field === 'completed' && value === true) {
            setIsResting(true);
        }
    }, []);

    const handleInputChange = (userInput: string) => {
        setExerciseInput(userInput);
        if (userInput.length > 0) {
            const filtered = EXERCISES.filter(
                (exercise) => exercise.name.toLowerCase().includes(userInput.toLowerCase())
            );
            setFilteredExercises(filtered);
            setShowSuggestions(true);
            setHighlightedIndex(-1);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectExercise = (exercise: Exercise) => {
        setExerciseInput(exercise.name);
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
        setIsResting,
        sets,
        handleAddSet,
        handleRemoveSet,
        updateSet,
        handleInputChange,
        handleSelectExercise,
        DEFAULT_REST_TIME
    };
};
