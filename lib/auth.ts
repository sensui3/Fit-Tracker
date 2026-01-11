import { betterAuth } from "better-auth";
import { dbService, getSql } from "../services/databaseService";

export const getAuth = (env?: any, request?: Request) => {
    // No Cloudflare, as variáveis estão em env. No Node/Vite, em process.env ou import.meta.env
    let betterAuthUrl = env?.BETTER_AUTH_URL || env?.VITE_BETTER_AUTH_URL ||
        process.env.BETTER_AUTH_URL || process.env.VITE_BETTER_AUTH_URL ||
        (import.meta.env ? import.meta.env.VITE_BETTER_AUTH_URL : undefined);

    // Se estivermos na Cloudflare e tivermos o request, podemos descobrir o baseURL dinamicamente
    // Isso evita erros de 405 por conflito de domínios (Staging vs Prod)
    if (!betterAuthUrl && request) {
        const url = new URL(request.url);
        betterAuthUrl = `${url.origin}/api/auth`;
    }

    // Fallback final
    if (!betterAuthUrl) betterAuthUrl = "/api/auth";

    const secret = env?.BETTER_AUTH_SECRET || env?.VITE_BETTER_AUTH_SECRET ||
        process.env.BETTER_AUTH_SECRET || process.env.VITE_BETTER_AUTH_SECRET ||
        (import.meta.env ? import.meta.env.VITE_BETTER_AUTH_SECRET : undefined) ||
        "fallback-secret-for-ci";

    return betterAuth({
        database: {
            db: {
                execute: async (sql: string, params?: any[]) => {
                    // Garantimos que o dbService use o env correto
                    // Como não podemos passar o env diretamente para o query sem mudar a assinatura,
                    // vamos pré-inicializar o SQL instance
                    getSql(env);
                    const rows = await dbService.query(sql, ...(params || []));
                    return { rows };
                },
            },
            type: "postgres"
        },
        secret: secret,
        baseURL: betterAuthUrl,
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
};

export const auth = getAuth();
