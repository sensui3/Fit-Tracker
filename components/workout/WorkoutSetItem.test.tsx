import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkoutSetItem } from './WorkoutSetItem';

describe('WorkoutSetItem Component', () => {
    const mockSet = {
        id: 1,
        reps: 10,
        weight: 60,
        completed: false,
        notes: 'Good form',
        showNotes: false
    };

    it('should render correct values', () => {
        render(
            <WorkoutSetItem
                set={mockSet}
                index={0}
                onUpdate={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        expect(screen.getByDisplayValue('60')).toBeInTheDocument();
        expect(screen.getByDisplayValue('10')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument(); // index + 1
    });

    it('should call onUpdate when weight or reps change', () => {
        const onUpdate = vi.fn();
        render(
            <WorkoutSetItem
                set={mockSet}
                index={0}
                onUpdate={onUpdate}
                onRemove={vi.fn()}
            />
        );

        const weightInput = screen.getByDisplayValue('60');
        fireEvent.change(weightInput, { target: { value: '65' } });
        expect(onUpdate).toHaveBeenCalledWith(1, 'weight', 65);

        const repsInput = screen.getByDisplayValue('10');
        fireEvent.change(repsInput, { target: { value: '12' } });
        expect(onUpdate).toHaveBeenCalledWith(1, 'reps', 12);
    });

    it('should call onUpdate for completed toggle', () => {
        const onUpdate = vi.fn();
        render(
            <WorkoutSetItem
                set={mockSet}
                index={0}
                onUpdate={onUpdate}
                onRemove={vi.fn()}
            />
        );

        const completeBtn = screen.getByTitle('Finalizar Série');
        fireEvent.click(completeBtn);
        expect(onUpdate).toHaveBeenCalledWith(1, 'completed', true);
    });

    it('should show notes when showNotes is true', () => {
        const setWithNotesShown = { ...mockSet, showNotes: true };
        render(
            <WorkoutSetItem
                set={setWithNotesShown}
                index={0}
                onUpdate={vi.fn()}
                onRemove={vi.fn()}
            />
        );

        expect(screen.getByPlaceholderText(/Adicione observações/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Good form')).toBeInTheDocument();
    });

    it('should call onRemove when delete button is clicked', () => {
        const onRemove = vi.fn();
        render(
            <WorkoutSetItem
                set={mockSet}
                index={0}
                onUpdate={vi.fn()}
                onRemove={onRemove}
            />
        );

        const deleteBtn = screen.getByText('delete');
        fireEvent.click(deleteBtn);
        expect(onRemove).toHaveBeenCalledWith(1);
    });
});
