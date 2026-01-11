import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client Configuration
 * This interacts with our self-hosted Better Auth instance running on Cloudflare Functions.
 */
export const authClient = createAuthClient({
    // Usamos window.location.origin para garantir que o baseURL seja uma URL absoluta válida.
    // Isso mantém as requisições dentro do nosso domínio/proxy, escondendo o Neon Auth.
    baseURL: `${window.location.origin}/api/auth`
});

/**
 * Exporting essential hooks and the client
 */
export const { useSession, signIn, signUp, signOut, getSession } = authClient;
