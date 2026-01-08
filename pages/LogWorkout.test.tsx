import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LogWorkout from './LogWorkout';
import { useWorkoutLogger } from '../hooks/useWorkoutLogger';
import { MemoryRouter } from 'react-router-dom';

// Mock do Hook
vi.mock('../hooks/useWorkoutLogger', () => ({
    useWorkoutLogger: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock do Toast
vi.mock('../components/ui/Toast', () => ({
    useToast: () => ({ addToast: vi.fn() }),
}));

// Mock useAuthStore
vi.mock('../stores/useAuthStore', () => ({
    useAuthStore: vi.fn(() => ({
        user: { id: 'user-123', name: 'Test User' },
        isAuthenticated: true
    }))
}));

// Mock dbService
vi.mock('../services/databaseService', () => ({
    dbService: {
        query: vi.fn(() => Promise.resolve([]))
    }
}));

describe('LogWorkout Page', () => {
    const mockLogger = {
        exerciseInput: '',
        filteredExercises: [{ id: '1', name: 'Supino' }, { id: '2', name: 'Agachamento' }],
        showSuggestions: false,
        setShowSuggestions: vi.fn(),
        highlightedIndex: -1,
        setHighlightedIndex: vi.fn(),
        sets: [{ id: 1, weight: 20, reps: 12, completed: false }],
        handleAddSet: vi.fn(),
        handleRemoveSet: vi.fn(),
        updateSet: vi.fn(),
        handleInputChange: vi.fn(),
        handleSelectExercise: vi.fn(),
        finishWorkout: vi.fn(),
        selectedExercise: null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useWorkoutLogger as any).mockReturnValue(mockLogger);
    });

    it('should render correctly', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <LogWorkout />
                </MemoryRouter>
            );
        });

        expect(screen.getByText(/Novo Registro/i)).toBeInTheDocument();
    });

    it('should handle keyboard navigation in suggestions', async () => {
        const setHighlightedIndex = vi.fn();
        const setShowSuggestions = vi.fn();
        const handleSelectExercise = vi.fn();

        (useWorkoutLogger as any).mockReturnValue({
            ...mockLogger,
            showSuggestions: true,
            setHighlightedIndex,
            setShowSuggestions,
            handleSelectExercise
        });

        await act(async () => {
            render(
                <MemoryRouter>
                    <LogWorkout />
                </MemoryRouter>
            );
        });

        const input = screen.getByPlaceholderText(/Supino Reto, Agachamento.../i);

        fireEvent.keyDown(input, { key: 'ArrowDown' });
        expect(setHighlightedIndex).toHaveBeenCalled();

        fireEvent.keyDown(input, { key: 'ArrowUp' });
        expect(setHighlightedIndex).toHaveBeenCalled();

        fireEvent.keyDown(input, { key: 'Escape' });
        expect(setShowSuggestions).toHaveBeenCalledWith(false);
    });

    it('should select suggestion on Enter', async () => {
        const handleSelectExercise = vi.fn();
        (useWorkoutLogger as any).mockReturnValue({
            ...mockLogger,
            showSuggestions: true,
            highlightedIndex: 0,
            handleSelectExercise
        });

        await act(async () => {
            render(
                <MemoryRouter>
                    <LogWorkout />
                </MemoryRouter>
            );
        });

        const input = screen.getByPlaceholderText(/Supino Reto, Agachamento.../i);
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(handleSelectExercise).toHaveBeenCalledWith(mockLogger.filteredExercises[0]);
    });

    it('should confirm deletion', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <LogWorkout />
                </MemoryRouter>
            );
        });

        // Open modal
        fireEvent.click(screen.getByText('Excluir'));

        // Confirm - There are now two "Excluir" buttons, so we grab the second one (in the modal)
        const deleteButtons = screen.getAllByRole('button', { name: "Excluir" });
        const confirmBtn = deleteButtons[1];
        fireEvent.click(confirmBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/workouts');
    });

    it('should save workout', async () => {
        const finishWorkout = vi.fn(() => Promise.resolve());
        (useWorkoutLogger as any).mockReturnValue({
            ...mockLogger,
            selectedExercise: { id: '1', name: 'Supino' },
            finishWorkout
        });

        await act(async () => {
            render(
                <MemoryRouter>
                    <LogWorkout />
                </MemoryRouter>
            );
        });

        const saveBtn = screen.getByText('Salvar Registro');
        fireEvent.click(saveBtn);

        await vi.waitFor(() => {
            expect(finishWorkout).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/workouts');
        });
    });
});
