import { z } from 'zod';
import DOMPurify from 'dompurify';

/**
 * Utilitário de Sanitização Centralizado
 */
export const sanitize = (text: string): string => {
    if (!text || typeof text !== 'string') return text;
    // Remove tags HTML maliciosas mantendo o texto puro
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Esquemas de Validação (Zod) - Centralizados e Fortemente Tipados
 */

// Base para campos comuns
const passwordSchema = z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .max(50, 'Senha muito longa (máx 50 caracteres)')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial');

const emailSchema = z.string()
    .email('Formato de e-mail inválido')
    .min(5, 'E-mail muito curto')
    .max(100, 'E-mail muito longo')
    .toLowerCase()
    .trim();

const nameSchema = z.string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(60, 'O nome é muito longo')
    .transform(val => sanitize(val).trim());

// Esquemas específicos
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Senha é obrigatória'),
});

export const signUpSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
    passwordConfirmation: z.string()
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
});

export const profileUpdateSchema = z.object({
    name: nameSchema.optional(),
    image: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
});

export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

export const profileSchema = profileUpdateSchema;

// Workout schema for tests
export const workoutSchema = z.object({
    exerciseName: z.string().min(1, 'Nome do exercício é obrigatório'),
    sets: z.array(z.object({
        reps: z.number().int().positive('Repetições devem ser positivas'),
        weight: z.number().positive('Peso deve ser positivo'),
    })).min(1, 'Pelo menos um set é necessário'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido'),
});

/**
 * Rate Limiting (Client-side)
 * Implementação leve para evitar spam de requisições.
 */
class RateLimiter {
    private limits = new Map<string, number>();

    check(key: string, limitMs: number = 2000): boolean {
        const now = Date.now();
        const lastCall = this.limits.get(key) || 0;

        if (now - lastCall < limitMs) {
            return false;
        }

        this.limits.set(key, now);
        return true;
    }

    reset(key: string) {
        this.limits.delete(key);
    }
}

export const limiter = new RateLimiter();
export const checkRateLimit = (key: string, limitMs?: number) => limiter.check(key, limitMs);

/**
 * Utilitário para Limpeza de Dados Sensíveis (Logging)
 */
export const scrub = (data: unknown): unknown => {
    if (!data) return data;

    if (typeof data === 'string') {
        return data
            .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]')
            .replace(/(password|senha|token|key|secret)=[^&\s]+/gi, '$1=[REDACTED]');
    }

    if (Array.isArray(data)) {
        return data.map(scrub);
    }

    if (data && typeof data === 'object') {
        const result: Record<string, unknown> = {};
        const sensitiveKeys = ['password', 'senha', 'token', 'key', 'secret', 'email', 'auth', 'cookie', 'authorization'];

        for (const [key, value] of Object.entries(data)) {
            if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
                result[key] = '[REDACTED]';
            } else {
                result[key] = scrub(value);
            }
        }
        return result;
    }

    return data;
};

/**
 * Proteção CSRF básica para requisições manuais (se necessário)
 */
export const getCsrfToken = () => {
    // Em uma aplicação real, isso viria de um cookie ou meta tag
    return (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
};

// Aliases for tests
export const scrubData = scrub;
