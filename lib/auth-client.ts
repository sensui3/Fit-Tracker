import { createAuthClient } from "better-auth/react";
import { loginSchema, signUpSchema } from "./security";

// Use current domain with /api/auth proxy - must be absolute for Better Auth
const getBaseURL = () => {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/api/auth`;
    }
    return "/api/auth";
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
});

export const { useSession, signOut } = authClient;

/**
 * Wrappers validados para funções de autenticação
 */
export const signInValidated = async (data: unknown) => {
    const validatedData = loginSchema.parse(data);
    return await authClient.signIn.email({
        email: validatedData.email,
        password: validatedData.password,
    });
};

export const signUpValidated = async (data: unknown, name: string) => {
    const validatedData = signUpSchema.parse({ ...(data as Record<string, unknown>), name });
    return await authClient.signUp.email({
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
    });
};

/**
 * Recuperação de senha
 */
export const forgotPassword = async (email: string) => {
    return await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
    });
};

export const resetPassword = async (password: string, token: string) => {
    return await authClient.resetPassword({
        newPassword: password,
        token,
    });
};
