import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input Component', () => {
    it('should render label correctly', () => {
        render(<Input label="Username" />);
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should show error message', () => {
        render(<Input error="Required field" />);
        expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('should call onChange handler', () => {
        const onChange = vi.fn();
        render(<Input onChange={onChange} placeholder="test" />);
        const input = screen.getByPlaceholderText('test');
        fireEvent.change(input, { target: { value: 'hello' } });
        expect(onChange).toHaveBeenCalled();
    });

    it('should render icons', () => {
        render(
            <Input
                leftIcon={<span data-testid="left">L</span>}
                rightIcon={<span data-testid="right">R</span>}
            />
        );
        expect(screen.getByTestId('left')).toBeInTheDocument();
        expect(screen.getByTestId('right')).toBeInTheDocument();
    });

    it('should apply disabled styles', () => {
        render(<Input disabled />);
        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
        expect(input.className).toContain('cursor-not-allowed');
    });
});
