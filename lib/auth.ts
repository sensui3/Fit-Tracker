import { betterAuth } from "better-auth";
import { dbService } from "../services/databaseService";

export const auth = betterAuth({
    database: {
        db: {
            execute: async (sql: string, params?: any[]) => {
                const rows = await dbService.query(sql, ...(params || []));
                return { rows };
            },
        },
        type: "postgres"
    },
    secret: (typeof process !== 'undefined' ? (process.env.BETTER_AUTH_SECRET || process.env.VITE_BETTER_AUTH_SECRET) : undefined) ||
        (import.meta.env ? import.meta.env.VITE_BETTER_AUTH_SECRET : undefined) ||
        "fallback-secret-for-ci", // Apenas fallback, deve ser pego do ENV
    // O baseURL é crucial para que os cookies sejam emitidos para o domínio correto.
    // Em produção (Cloudflare), isso deve ser o URL do site + /api/auth
    // Tentamos pegar de várias fontes para evitar erros no CI/CD ou em diferentes ambientes
    baseURL: (typeof process !== 'undefined' ? (process.env.BETTER_AUTH_URL || process.env.VITE_BETTER_AUTH_URL) : undefined) ||
        (import.meta.env ? import.meta.env.VITE_BETTER_AUTH_URL : undefined) ||
        "/api/auth",
    // Mapeamento para o Schema SQL que criamos (snake_case e plural)
    user: {
        modelName: "users",
        fields: {
            emailVerified: "email_verified",
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    },
    session: {
        modelName: "sessions",
        fields: {
            expiresAt: "expires_at",
            ipAddress: "ip_address",
            userAgent: "user_agent",
            userId: "user_id",
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    },
    account: {
        modelName: "accounts",
        fields: {
            accountId: "account_id",
            providerId: "provider_id",
            userId: "user_id",
            accessToken: "access_token",
            refreshToken: "refresh_token",
            idToken: "id_token",
            accessTokenExpiresAt: "access_token_expires_at",
            refreshTokenExpiresAt: "refresh_token_expires_at",
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    },
    verification: {
        modelName: "verifications",
        fields: {
            expiresAt: "expires_at",
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    },
    emailAndPassword: {
        enabled: true
    }
});
