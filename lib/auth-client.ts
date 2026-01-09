import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client Configuration
 * This interacts with our self-hosted Better Auth instance running on Cloudflare Functions.
 */
export const authClient = createAuthClient({
    baseURL: import.meta.env.MODE === 'production'
        ? '/api/auth'
        : (import.meta.env.VITE_BETTER_AUTH_URL || window.location.origin)
});

/**
 * Exporting essential hooks and the client
 */
export const { useSession, signIn, signUp, signOut, getSession } = authClient;
