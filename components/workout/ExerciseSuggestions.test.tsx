import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExerciseSuggestions } from './ExerciseSuggestions';
import { Exercise } from '../../types';

// Mock OptimizedImage since we already tested it and want to focus on this component
vi.mock('../ui/OptimizedImage', () => ({
    OptimizedImage: ({ alt, _containerClassName, ...props }: { alt: string; _containerClassName?: string;[key: string]: unknown }) => <img alt={alt} {...props} />
}));

describe('ExerciseSuggestions Component', () => {
    const mockExercises: Exercise[] = [
        { id: '1', name: 'Supino', muscle: 'Peito', muscle_group: 'Peito', is_custom: false, image: 'supino.jpg', instructions: [], equipment: 'Barra', difficulty: 'Intermediário' },
        { id: '2', name: 'Agachamento', muscle: 'Pernas', muscle_group: 'Pernas', is_custom: false, image: 'agachamento.jpg', instructions: [], equipment: 'Barra', difficulty: 'Avançado' }
    ];

    it('should not render when exercises list is empty', () => {
        const rendered = render(
            <ExerciseSuggestions
                exercises={[]}
                highlightedIndex={-1}
                onSelect={vi.fn()}
            />
        );
        expect(rendered.container.firstChild).toBeNull();
    });

    it('should render suggestions list', () => {
        render(
            <ExerciseSuggestions
                exercises={mockExercises}
                highlightedIndex={-1}
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByText('Supino')).toBeInTheDocument();
        expect(screen.getByText('Agachamento')).toBeInTheDocument();
        expect(screen.getByText('Peito')).toBeInTheDocument();
    });

    it('should highlight the item with highlightedIndex', () => {
        render(
            <ExerciseSuggestions
                exercises={mockExercises}
                highlightedIndex={0}
                onSelect={vi.fn()}
            />
        );

        // Find the first item (Supino) wrapper
        // Since we don't have test-ids, we can look for parent of text
        const supinoItem = screen.getByText('Supino').closest('.group');
        expect(supinoItem).toHaveClass('bg-slate-100');

        const agachamentoItem = screen.getByText('Agachamento').closest('.group');
        expect(agachamentoItem).not.toHaveClass('bg-slate-100');
    });

    it('should call onSelect when an item is clicked', () => {
        const onSelect = vi.fn();
        render(
            <ExerciseSuggestions
                exercises={mockExercises}
                highlightedIndex={-1}
                onSelect={onSelect}
            />
        );

        const supinoItem = screen.getByText('Supino').closest('div.cursor-pointer');
        if (supinoItem) {
            fireEvent.click(supinoItem);
            expect(onSelect).toHaveBeenCalledWith(mockExercises[0]);
        } else {
            throw new Error('Supino item not found');
        }
    });
});
