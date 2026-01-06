import React, { useEffect, useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
}

// Hook wrapper
export const useToast = () => {
    const { addToast, removeToast } = useUIStore();
    return { addToast, removeToast };
};

// UI Component for individual toast
const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onRemove(toast.id);
        }, 300); // Animation duration
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
    }, [toast.duration]);

    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    const colors = {
        success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800',
        error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-800',
        warning: 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-100 dark:border-yellow-800',
        info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800'
    };

    return (
        <div
            className={`relative flex items-center w-full max-w-sm p-4 mb-3 rounded-xl border shadow-lg transition-all duration-300 ease-in-out transform
        ${colors[toast.type]}
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
            role="alert"
        >
            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg">
                <span className="material-symbols-outlined text-xl">
                    {icons[toast.type]}
                </span>
            </div>
            <div className="ml-3 text-sm font-normal flex-1">
                {toast.title && <div className="font-bold mb-0.5">{toast.title}</div>}
                <div className="text-sm leading-tight opacity-90">{toast.message}</div>
            </div>
            <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8 opacity-50 hover:opacity-100 transition-opacity"
                onClick={handleClose}
                aria-label="Close"
            >
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>
    );
};

// Global Toast Container
export const GlobalToast: React.FC = () => {
    const { toasts, removeToast } = useUIStore();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end w-full max-w-sm pointer-events-none">
            <div className="pointer-events-auto w-full">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast as ToastMessage} onRemove={removeToast} />
                ))}
            </div>
        </div>
    );
};

// Deprecated Provider for compatibility (optional)
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            {children}
            <GlobalToast />
        </>
    );
};
