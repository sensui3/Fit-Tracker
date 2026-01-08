import { createAuthClient } from "@neondatabase/neon-js/auth/react";

/**
 * Neon Auth Client Configuration
 * This is the low-level client that interacts with the Neon Auth / Better Auth service.
 */

// We prioritize the proxy URL for better security and to avoid CORS issues in production.
const neonAuthUrl = import.meta.env.VITE_NEON_AUTH_URL || "https://ep-young-waterfall-adzgojue.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth";

export const authClient = createAuthClient(neonAuthUrl);

/**
 * Re-exporting only essential hooks.
 * All authentication actions (signIn, signUp, etc.) should be performed through the NeonAuthService.
 */
export const { useSession } = authClient;
