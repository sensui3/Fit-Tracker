import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
    it('should render children correctly', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should call onClick handler when clicked', () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click Me</Button>);
        fireEvent.click(screen.getByText('Click Me'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should show loading state and be disabled', () => {
        render(<Button isLoading>Click Me</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should render icons', () => {
        render(
            <Button leftIcon={<span data-testid="left-icon">L</span>}>
                Label
            </Button>
        );
        expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });
});
