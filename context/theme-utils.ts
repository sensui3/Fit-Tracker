import { useUIStore } from '../stores/useUIStore';

export const useTheme = () => {
    const { theme, setTheme } = useUIStore();
    return { theme, setTheme };
};