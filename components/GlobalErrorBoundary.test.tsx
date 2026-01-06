import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GlobalErrorBoundary } from './GlobalErrorBoundary';
import React from 'react';

// Componente que dá erro para testar o boundary
const ProblemChild = ({ shouldThrow = false }) => {
    if (shouldThrow) {
        throw new Error('Test Error');
    }
    return <div>Safe Content</div>;
};

describe('GlobalErrorBoundary', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Silencia erros no console durante os testes de boundary
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should render children when no error occurs', () => {
        render(
            <GlobalErrorBoundary>
                <ProblemChild shouldThrow={false} />
            </GlobalErrorBoundary>
        );
        expect(screen.getByText('Safe Content')).toBeInTheDocument();
    });

    it('should catch error and show fallback UI', () => {
        render(
            <GlobalErrorBoundary>
                <ProblemChild shouldThrow={true} />
            </GlobalErrorBoundary>
        );

        expect(screen.getByText(/Ops! Algo deu errado./i)).toBeInTheDocument();
        expect(screen.getByText('Test Error')).toBeInTheDocument();
    });

    it('should call reload when button is clicked', () => {
        render(
            <GlobalErrorBoundary>
                <ProblemChild shouldThrow={true} />
            </GlobalErrorBoundary>
        );

        const reloadBtn = screen.getByRole('button', { name: /Recarregar Aplicação/i });
        fireEvent.click(reloadBtn);

        // window.location.reload está mockado globalmente no test-setup.ts
        expect(window.location.reload).toHaveBeenCalled();
    });
});
