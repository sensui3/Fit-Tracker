import { useCallback } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { authClient } from '../lib/auth-client';
import { useToast } from '../components/ui/Toast';

/**
 * Hook customizado para gerenciamento centralizado de autenticação.
 * Segue o princípio de responsabilidade única e fornece uma API limpa para os componentes.
 */
export const useAuth = () => {
    const {
        user,
        session,
        isAuthenticated,
        isLoading,
        error,
        setLoading,
        setError,
        clearError,
        logout: storeLogout
    } = useAuthStore();

    const { addToast } = useToast();

    /**
     * Login de usuário
     */
    const login = useCallback(async (credentials: { email: string; password: string }) => {
        setLoading(true);
        clearError();

        try {
            const { data, error: authError } = await authClient.signIn.email({
                email: credentials.email,
                password: credentials.password,
            });

            if (authError) {
                setError(authError);
                return { success: false, error: authError };
            }

            return { success: true, data };
        } catch {
            const genericError = { message: 'Erro inesperado no login', code: 'INTERNAL_ERROR' };
            setError(genericError);
            return { success: false, error: genericError };
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, clearError]);

    /**
     * Cadastro de usuário
     */
    const register = useCallback(async (credentials: { email: string; password: string; name?: string }) => {
        setLoading(true);
        clearError();

        try {
            const { data, error: authError } = await authClient.signUp.email({
                email: credentials.email,
                password: credentials.password,
                name: credentials.name || credentials.email.split('@')[0],
            });

            if (authError) {
                setError(authError);
                return { success: false, error: authError };
            }

            addToast({
                type: 'success',
                title: 'Conta criada!',
                message: 'Verifique seu e-mail para confirmar a conta.',
                duration: 5000
            });

            return { success: true, data };
        } catch {
            const genericError = { message: 'Erro inesperado no cadastro', code: 'INTERNAL_ERROR' };
            setError(genericError);
            return { success: false, error: genericError };
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, clearError, addToast]);

    /**
     * Recuperação de senha
     */
    const forgotPassword = useCallback(async (email: string) => {
        setLoading(true);
        try {
            // @ts-expect-error - forgetPassword exist at runtime
            const { error: authError } = await (authClient as any).forgetPassword({
                email,
                redirectTo: `${window.location.origin}/#/reset-password`,
            });
            if (authError) throw authError;

            addToast({
                type: 'success',
                title: 'E-mail enviado',
                message: 'As instruções de recuperação foram enviadas para seu e-mail.',
            });
            return { success: true };
        } catch (err: any) {
            setError({ message: err.message || 'Erro inesperado', code: err.code });
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, addToast]);

    /**
     * Redefinição de senha
     */
    const resetPassword = useCallback(async (data: { newPassword: string; token: string }) => {
        setLoading(true);
        try {
            // @ts-expect-error - resetPassword exist at runtime
            const { error: authError } = await (authClient as any).resetPassword({
                newPassword: data.newPassword,
                token: data.token
            });
            if (authError) throw authError;

            addToast({
                type: 'success',
                title: 'Sucesso',
                message: 'Sua senha foi redefinida com sucesso!',
            });
            return { success: true };
        } catch (err: any) {
            setError({ message: err.message || 'Erro inesperado', code: err.code });
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, addToast]);

    return {
        user,
        session,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout: storeLogout,
        forgotPassword,
        resetPassword,
        clearError
    };
};
