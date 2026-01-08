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