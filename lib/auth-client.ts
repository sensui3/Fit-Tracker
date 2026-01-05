import { createAuthClient } from "better-auth/react";

// Use proxy in development to avoid CORS issues
const baseURL = import.meta.env.DEV
    ? "http://localhost:3000/api/auth"
    : "https://ep-young-waterfall-adzgojue.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth";

export const authClient = createAuthClient({
    baseURL,
});

export const { signIn, signUp, useSession, signOut } = authClient;
