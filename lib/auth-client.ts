import { createAuthClient } from "better-auth/react";
import { loginSchema, signUpSchema } from "./security";

// Use Neon Auth service URL
const baseURL = import.meta.env.VITE_BETTER_AUTH_URL;

export const authClient = createAuthClient({
    baseURL,
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
