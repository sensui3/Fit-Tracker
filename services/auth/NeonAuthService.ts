import { authClient } from '../../lib/auth-client';
import {
    IAuthService,
    AuthCredentials,
    AuthResponse,
    ResetPasswordData,
    AuthError
} from './types';
import { Session } from '../../types';
import { loginSchema, signUpSchema } from '../../lib/security';

export class NeonAuthService implements IAuthService {
    private static instance: NeonAuthService;

    private constructor() { }

    public static getInstance(): NeonAuthService {
        if (!NeonAuthService.instance) {
            NeonAuthService.instance = new NeonAuthService();
        }
        return NeonAuthService.instance;
    }

    private handleError(error: unknown): AuthError {
        console.error('NeonAuthService Error:', error);

        const err = error as { name?: string; message?: string; issues?: any[]; code?: string; status?: number };

        if (err.name === 'ZodError') {
            return {
                message: err.issues?.[0]?.message || 'Dados de entrada inválidos',
                code: 'VALIDATION_ERROR'
            };
        }

        return {
            message: err.message || 'Ocorreu um erro inesperado na autenticação',
            code: err.code || 'UNKNOWN_ERROR',
            status: err.status
        };
    }

    async signIn(credentials: AuthCredentials): Promise<AuthResponse<Session>> {
        try {
            // Validação fail-fast
            loginSchema.parse(credentials);

            const { data, error } = await authClient.signIn.email({
                email: credentials.email,
                password: credentials.password,
            });

            if (error) throw error;

            return { data: data as unknown as Session, error: null };
        } catch (error) {
            return { data: null, error: this.handleError(error) };
        }
    }

    async signUp(credentials: AuthCredentials): Promise<AuthResponse<Session>> {
        try {
            // Validação fail-fast
            signUpSchema.parse({
                ...credentials,
                passwordConfirmation: credentials.password // Assumindo que a confirmação já foi feita no UI ou passando a mesma
            });

            const { data, error } = await authClient.signUp.email({
                email: credentials.email,
                password: credentials.password,
                name: credentials.name || '',
            });

            if (error) throw error;

            return { data: data as unknown as Session, error: null };
        } catch (error) {
            return { data: null, error: this.handleError(error) };
        }
    }

    async signOut(): Promise<void> {
        try {
            await authClient.signOut();
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    async requestPasswordReset(email: string): Promise<AuthResponse> {
        try {
            const { data, error } = await authClient.requestPasswordReset({
                email,
                redirectTo: "/reset-password",
            });

            if (error) throw error;

            return { data, error: null };
        } catch (error) {
            return { data: null, error: this.handleError(error) };
        }
    }

    async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
        try {
            const { data: responseData, error } = await authClient.resetPassword({
                newPassword: data.password,
                token: data.token,
            });

            if (error) throw error;

            return { data: responseData, error: null };
        } catch (error) {
            return { data: null, error: this.handleError(error) };
        }
    }

    async getSession(): Promise<AuthResponse<Session>> {
        try {
            // authClient.getSession() pode ser assíncrono dependendo da implementação
            // Mas com @neondatabase/neon-js/auth/react geralmente usamos o hook no componente.
            // Para o serviço, tentaremos obter a sessão atual se disponível.
            const session = await authClient.getSession();
            return { data: session?.data as unknown as Session, error: null };
        } catch (error) {
            return { data: null, error: this.handleError(error) };
        }
    }
}

export const authService = NeonAuthService.getInstance();
