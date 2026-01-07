import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OptimizedImage } from './OptimizedImage';

describe('OptimizedImage Component', () => {
    const src = 'test-image.jpg';
    const alt = 'Test Image';

    it('should render skeleton initially', () => {
        const { container } = render(<OptimizedImage src={src} alt={alt} />);
        // Look for the pulse animation which indicates skeleton
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
        // Image should be opacity-0 initially or loading
        const img = screen.getByRole('img');
        expect(img).toHaveClass('opacity-0');
    });

    it('should reveal image when loaded', () => {
        render(<OptimizedImage src={src} alt={alt} />);
        const img = screen.getByRole('img');

        fireEvent.load(img);

        expect(img).toHaveClass('opacity-100');
        expect(screen.queryByText('broken_image')).not.toBeInTheDocument();
    });

    it('should show error state on error', () => {
        render(<OptimizedImage src={src} alt={alt} />);
        const img = screen.getByRole('img');

        fireEvent.error(img);

        expect(screen.getByText('broken_image')).toBeInTheDocument();
    });
});
