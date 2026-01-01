import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    leftIcon,
    rightIcon,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`}>
            {label && (
                <label className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">
                    {label}
                </label>
            )}

            <div className="relative group">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#16a34a] transition-colors">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    className={`
            w-full bg-slate-50 dark:bg-background-dark 
            border border-slate-200 dark:border-border-dark 
            rounded-xl 
            text-slate-900 dark:text-white 
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:ring-2 focus:ring-[#16a34a]/50 focus:border-[#16a34a] 
            transition-all font-medium outline-none
            ${leftIcon ? 'pl-12' : 'pl-4'}
            ${rightIcon ? 'pr-12' : 'pr-4'}
            ${props.disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}
            ${className}
          `}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <span className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
                    {error}
                </span>
            )}
        </div>
    );
});

Input.displayName = "Input";
