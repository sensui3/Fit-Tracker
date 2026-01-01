import { useState, useMemo, useCallback } from 'react';
import { EXERCISES, Exercise, MUSCLE_FILTERS, DIFFICULTY_FILTERS, EQUIPMENT_FILTERS } from '../data/exercises';

export const useExerciseFilters = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const toggleFilter = useCallback((filter: string) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    }, []);

    const filteredExercises = useMemo(() => {
        return EXERCISES.filter(exercise => {
            const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());

            const activeMuscleFilters = activeFilters.filter(f => MUSCLE_FILTERS.includes(f));
            const activeDifficultyFilters = activeFilters.filter(f => DIFFICULTY_FILTERS.includes(f));
            const activeEquipmentFilters = activeFilters.filter(f => EQUIPMENT_FILTERS.includes(f));

            const matchesMuscle = activeMuscleFilters.length === 0 || activeMuscleFilters.includes(exercise.muscle);
            const matchesDifficulty = activeDifficultyFilters.length === 0 || activeDifficultyFilters.includes(exercise.difficulty);
            const matchesEquipment = activeEquipmentFilters.length === 0 || activeEquipmentFilters.includes(exercise.equipment);

            return matchesSearch && matchesMuscle && matchesDifficulty && matchesEquipment;
        });
    }, [searchTerm, activeFilters]);

    const clearFilters = useCallback(() => {
        setSearchTerm("");
        setActiveFilters([]);
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        activeFilters,
        setActiveFilters,
        toggleFilter,
        filteredExercises,
        clearFilters
    };
};
