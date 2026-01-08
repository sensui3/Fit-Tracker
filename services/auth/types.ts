import { Session } from '../../types';

export interface AuthResponse<T = unknown> {
    data: T | null;
    error: AuthError | null;
}

export interface AuthError {
    message: string;
    code?: string;
    status?: number;
}

export interface AuthCredentials {
    email: string;
    password: string;
    name?: string;
}

export interface ResetPasswordData {
    password: string;
    token: string;
}

export interface IAuthService {
    signIn(credentials: AuthCredentials): Promise<AuthResponse<Session>>;
    signUp(credentials: AuthCredentials): Promise<AuthResponse<Session>>;
    signOut(): Promise<void>;
    requestPasswordReset(email: string): Promise<AuthResponse>;
    resetPassword(data: ResetPasswordData): Promise<AuthResponse>;
    getSession(): Promise<AuthResponse<Session>>;
}
