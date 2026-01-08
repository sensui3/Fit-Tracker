import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useUIStore } from '../stores/useUIStore';
import { useSession } from '../lib/auth-client';
import { useAtom } from 'jotai';
import { Theme } from '../types';
import { setLogRocketUser } from '../lib/logrocket';

export const AppInitializer = () => {
    const { setUser, setLoading } = useAuthStore();
    const { theme } = useUIStore();
    const [session] = useAtom(useSession);

    // Sync Auth
    useEffect(() => {
        // useSession returns data and isPending
        if (!session.isPending) {
            const authUser = session.data?.user;
            if (authUser) {
                setUser({
                    ...authUser,
                    plan: 'Free', // Default plan
                    createdAt: new Date(authUser.createdAt).toISOString(),
                    updatedAt: new Date(authUser.updatedAt).toISOString(),
                } as any);
                setLogRocketUser(authUser);
            } else {
                setUser(null);
                setLogRocketUser(null);
            }
            setLoading(false);
        }
    }, [session.data, session.isPending, setUser, setLoading]);

    // Sync Theme
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === Theme.System) {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    return null;
};
