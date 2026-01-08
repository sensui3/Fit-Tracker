import { createAuthClient } from "@neondatabase/neon-js/auth";
import { loginSchema, signUpSchema } from "./security";

// URL do Neon Auth vinda das variáveis de ambiente ou fallback
const neonAuthUrl = import.meta.env.VITE_NEON_AUTH_URL || import.meta.env.VITE_BETTER_AUTH_URL || "https://ep-young-waterfall-adzgojue.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth";

export const authClient = createAuthClient(neonAuthUrl);

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
    return await authClient.requestPasswordReset({
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
