import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
        primary: "bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#13ec13] dark:hover:bg-[#0fd60f] text-white dark:text-black shadow-lg shadow-green-600/20",
        secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white",
        outline: "border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-[#16a34a] hover:text-[#16a34a] dark:hover:text-[#13ec13] bg-transparent",
        ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400",
        danger: "bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400"
    };

    const sizes = {
        sm: "h-9 px-3 text-xs",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "size-10 p-0"
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
        <button
            className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${widthStyle} 
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="mr-2 size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : leftIcon ? (
                <span className="mr-2">{leftIcon}</span>
            ) : null}

            {children}

            {rightIcon && !isLoading && (
                <span className="ml-2">{rightIcon}</span>
            )}
        </button>
    );
};
