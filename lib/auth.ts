// Este arquivo não é mais usado pois migramos para Neon Auth (serviço gerenciado)
// Todas as funcionalidades de autenticação são tratadas pelo serviço Neon Auth:
// https://ep-young-waterfall-adzgojue.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth

// Código anterior comentado para referência:
/*
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
*/
