import { createAuthClient } from "better-auth/react";
import { loginSchema } from "./security";

// Use proxy in development to avoid CORS issues
const baseURL = import.meta.env.DEV
    ? "http://localhost:3000/api/auth"
    : "https://ep-young-waterfall-adzgojue.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth";

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
    const validatedData = loginSchema.parse(data);
    return await authClient.signUp.email({
        email: validatedData.email,
        password: validatedData.password,
        name: name,
    });
};

