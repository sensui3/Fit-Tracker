import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useUIStore } from '../stores/useUIStore';
import { useSession } from '../lib/auth-client';
import { Theme } from '../types';
import { setLogRocketUser } from '../lib/logrocket';

/**
 * Componente responsável pela inicialização do estado global da aplicação.
 * Sincroniza autenticação, tema e outros estados críticos no carregamento inicial.
 */
export const AppInitializer = () => {
    const { setUser, setLoading } = useAuthStore();
    const { theme } = useUIStore();
    const session = useSession();

    /**
     * Sincronização de Autenticação
     * Monitora a sessão do Neon Auth e atualiza o Store global.
     */
    useEffect(() => {
        if (!session.isPending) {
            const authUser = session.data?.user;

            if (authUser) {
                // Mapeamento robusto para o tipo User do sistema
                setUser({
                    id: authUser.id,
                    email: authUser.email,
                    name: authUser.name || 'Usuário',
                    image: authUser.image || undefined,
                    plan: 'Free', // Default, pode ser expandido com lógica de assinatura
                    createdAt: new Date(authUser.createdAt).toISOString(),
                    updatedAt: new Date(authUser.updatedAt).toISOString(),
                    emailVerified: authUser.emailVerified
                });

                // Identifica usuário no LogRocket para debugging
                setLogRocketUser(authUser);
            } else {
                setUser(null);
                setLogRocketUser(null);
            }

            setLoading(false);
        }
    }, [session.data, session.isPending, setUser, setLoading]);

    /**
     * Sincronização de Tema
     * Aplica as classes CSS de tema ao elemento raiz do documento.
     */
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
