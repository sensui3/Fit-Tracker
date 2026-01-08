import { useCallback } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { authService } from '../services/auth/NeonAuthService';
import { AuthCredentials, ResetPasswordData } from '../services/auth/types';
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
    const login = useCallback(async (credentials: AuthCredentials) => {
        setLoading(true);
        clearError();

        try {
            const { data, error: authError } = await authService.signIn(credentials);

            if (authError) {
                setError(authError);
                return { success: false, error: authError };
            }

            // O estado será sincronizado pelo AppInitializer ou manualmente se necessário
            // Aqui estamos apenas retornando o resultado
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
    const register = useCallback(async (credentials: AuthCredentials) => {
        setLoading(true);
        clearError();

        try {
            const { data, error: authError } = await authService.signUp(credentials);

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
            const { error: authError } = await authService.requestPasswordReset(email);
            if (authError) throw authError;

            addToast({
                type: 'success',
                title: 'E-mail enviado',
                message: 'As instruções de recuperação foram enviadas para seu e-mail.',
            });
            return { success: true };
        } catch (err: unknown) {
            const authError = err as { message: string; code?: string };
            setError({ message: authError.message || 'Erro inesperado', code: authError.code });
            return { success: false, error: authError };
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, addToast]);

    /**
     * Redefinição de senha
     */
    const resetPassword = useCallback(async (data: ResetPasswordData) => {
        setLoading(true);
        try {
            const { error: authError } = await authService.resetPassword(data);
            if (authError) throw authError;

            addToast({
                type: 'success',
                title: 'Sucesso',
                message: 'Sua senha foi redefinida com sucesso!',
            });
            return { success: true };
        } catch (err: unknown) {
            const authError = err as { message: string; code?: string };
            setError({ message: authError.message || 'Erro inesperado', code: authError.code });
            return { success: false, error: authError };
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
