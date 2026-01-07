import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription } from './Card';

describe('Card Component', () => {
    it('should render children correctly', () => {
        render(<Card>Test Content</Card>);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply variant classes', () => {
        const { container } = render(<Card variant="outline">Content</Card>);
        expect(container.firstChild).toHaveClass('bg-transparent', 'border', 'border-slate-200');
    });

    it('should apply noPadding class when prop is true', () => {
        const { container } = render(<Card noPadding>Content</Card>);
        // The inner div should not have p-6 md:p-8
        // We need to look at the inner div.
        const innerDiv = container.firstChild?.firstChild;
        expect(innerDiv).not.toHaveClass('p-6');
    });

    it('should render CardHeader, CardTitle and CardDescription', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                    <CardDescription>Description</CardDescription>
                </CardHeader>
            </Card>
        );
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
    });
});
