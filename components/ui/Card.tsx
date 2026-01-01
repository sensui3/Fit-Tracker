import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outline' | 'ghost';
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    noPadding = false,
    ...props
}) => {
    const variants = {
        default: "bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm",
        outline: "bg-transparent border border-slate-200 dark:border-border-dark",
        ghost: "bg-slate-50 dark:bg-white/5 border-transparent"
    };

    return (
        <div
            className={`rounded-2xl overflow-hidden ${variants[variant]} ${className}`}
            {...props}
        >
            <div className={noPadding ? '' : 'p-6 md:p-8'}>
                {children}
            </div>
        </div>
    );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
    <div className={`flex flex-col gap-1 mb-6 ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
    <h3 className={`text-xl font-bold text-slate-900 dark:text-white ${className}`} {...props}>
        {children}
    </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
    <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`} {...props}>
        {children}
    </p>
);
