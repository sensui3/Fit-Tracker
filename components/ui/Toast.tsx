import React, { useEffect, useState, useCallback } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { ToastMessage, useToast } from './toast-utils';

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);
    const duration = toast.duration || 3000;

    const handleClose = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
    }, [onRemove, toast.id]);

    useEffect(() => {
        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            if (remaining <= 0) {
                clearInterval(timer);
                handleClose();
            }
        }, 10);
        return () => clearInterval(timer);
    }, [duration, handleClose]);

    const iconConfig = {
        success: { icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-500/20', bar: 'bg-green-500' },
        error: { icon: 'error', color: 'text-red-500', bg: 'bg-red-500/20', bar: 'bg-red-500' },
        warning: { icon: 'warning', color: 'text-amber-500', bg: 'bg-amber-500/20', bar: 'bg-amber-500' },
        info: { icon: 'info', color: 'text-blue-500', bg: 'bg-blue-500/20', bar: 'bg-blue-500' }
    };
    const config = iconConfig[toast.type];

    return (
        <div className={`relative flex flex-col w-full max-w-sm mb-4 rounded-2xl border border-white/10 dark:border-white/5 shadow-2xl backdrop-blur-md transition-all duration-300 transform ${toast.type === 'success' ? 'bg-white/90 dark:bg-[#1c271c]/90' : toast.type === 'error' ? 'bg-white/90 dark:bg-[#271c1c]/90' : 'bg-white/90 dark:bg-slate-900/90'} ${isExiting ? 'translate-x-12 opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}`} role="alert">
            <div className="flex items-center p-4">
                <div className={`inline-flex items-center justify-center shrink-0 w-10 h-10 rounded-xl ${config.bg} ${config.color}`}>
                    <span className="material-symbols-outlined text-2xl">{config.icon}</span>
                </div>
                <div className="ml-4 text-sm font-normal flex-1">
                    {toast.title && <div className="font-black text-slate-900 dark:text-white mb-0.5">{toast.title}</div>}
                    <div className="text-slate-600 dark:text-slate-300 leading-tight font-medium">{toast.message}</div>
                </div>
                <button type="button" className="ml-auto p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all" onClick={handleClose}>
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-white/5 w-full rounded-b-2xl overflow-hidden">
                <div className={`h-full ${config.bar} transition-all duration-100 ease-linear`} style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}

export function GlobalToast() {
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
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <GlobalToast />
        </>
    );
}

export { useToast };
