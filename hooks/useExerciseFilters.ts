import { useState, useMemo, useCallback, useEffect } from 'react';
import { dbService } from '../services/databaseService';
import { useAuthStore } from '../stores/useAuthStore';

export interface Exercise {
    id: string;
    name: string;
    muscle_group: string;
    equipment: string;
    difficulty: string;
    image_url: string;
    description: string;
    instructions: any[];
    is_custom: boolean;
    user_id: string | null;
    created_at: string;
}

export const MUSCLE_FILTERS = ['Peitoral', 'Costas', 'Pernas', 'Bíceps', 'Ombros', 'Cardio', 'Tríceps', 'Core', 'Abdômen'];
export const DIFFICULTY_FILTERS = ['Iniciante', 'Intermediário', 'Avançado'];
export const EQUIPMENT_FILTERS = ['Barra', 'Halteres', 'Máquina', 'Polia', 'Peso do Corpo', 'Barra W'];

export const useExerciseFilters = () => {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carregar exercícios do banco de dados
    useEffect(() => {
        const loadExercises = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                setError(null);

                // Buscar exercícios padrão + exercícios customizados do usuário
                const result = await dbService.query<Exercise>`
                    SELECT id::text, name, muscle_group, equipment, difficulty, image_url, description, instructions, is_custom, user_id::text, created_at::text
                    FROM exercises
                    WHERE user_id IS NULL OR user_id = ${user.id}
                    ORDER BY is_custom DESC, name ASC
                `;

                setExercises(result);
            } catch (err) {
                console.error('Erro ao carregar exercícios:', err);
                setError('Erro ao carregar exercícios');
            } finally {
                setLoading(false);
            }
        };

        loadExercises();
    }, [user?.id]);

    const toggleFilter = useCallback((filter: string) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    }, []);

    const filteredExercises = useMemo(() => {
        if (!exercises.length) return [];

        const searchLower = searchTerm.toLowerCase();
        const activeMuscleFilters = activeFilters.filter(f => MUSCLE_FILTERS.includes(f));
        const activeDifficultyFilters = activeFilters.filter(f => DIFFICULTY_FILTERS.includes(f));
        const activeEquipmentFilters = activeFilters.filter(f => EQUIPMENT_FILTERS.includes(f));

        const hasMuscleFilter = activeMuscleFilters.length > 0;
        const hasDifficultyFilter = activeDifficultyFilters.length > 0;
        const hasEquipmentFilter = activeEquipmentFilters.length > 0;

        return exercises.filter(exercise => {
            if (searchLower && !exercise.name.toLowerCase().includes(searchLower)) {
                return false;
            }

            if (hasMuscleFilter && !activeMuscleFilters.includes(exercise.muscle_group)) {
                return false;
            }
            if (hasDifficultyFilter && !activeDifficultyFilters.includes(exercise.difficulty)) {
                return false;
            }
            if (hasEquipmentFilter && !activeEquipmentFilters.includes(exercise.equipment)) {
                return false;
            }

            return true;
        });
    }, [searchTerm, activeFilters, exercises]);

    const clearFilters = useCallback(() => {
        setSearchTerm("");
        setActiveFilters([]);
    }, []);

    // Função para adicionar exercício customizado
    const addCustomExercise = useCallback(async (exerciseData: Omit<Exercise, 'id' | 'user_id' | 'created_at' | 'is_custom'>) => {
        if (!user?.id) return;

        try {
            const result = await dbService.query<Exercise>`
                INSERT INTO exercises (name, muscle_group, equipment, difficulty, image_url, description, instructions, is_custom, user_id)
                VALUES (${exerciseData.name}, ${exerciseData.muscle_group}, ${exerciseData.equipment}, ${exerciseData.difficulty}, ${exerciseData.image_url}, ${exerciseData.description}, ${JSON.stringify(exerciseData.instructions)}, true, ${user.id})
                RETURNING id::text, name, muscle_group, equipment, difficulty, image_url, description, instructions, is_custom, user_id::text, created_at::text
            `;

            if (result[0]) {
                setExercises(prev => [result[0], ...prev]);
                return result[0];
            }
        } catch (err) {
            console.error('Erro ao adicionar exercício:', err);
            throw err;
        }
    }, [user?.id]);

    return {
        searchTerm,
        setSearchTerm,
        activeFilters,
        setActiveFilters,
        toggleFilter,
        filteredExercises,
        clearFilters,
        exercises,
        loading,
        error,
        addCustomExercise
    };
};
