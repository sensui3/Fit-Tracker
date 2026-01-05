import { z } from 'zod';
import DOMPurify from 'dompurify';

/**
 * Utilitário para sanitização de strings contra ataques XSS.
 */
export const sanitize = (text: string): string => {
    if (!text) return text;
    return DOMPurify.sanitize(text);
};

/**
 * Esquemas de validação robustos com Zod
 */

// Login e Registro
export const loginSchema = z.object({
    email: z.string().email('Email inválido').min(5, 'Email muito curto').max(100, 'Email muito longo'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres').max(50, 'Senha muito longa'),
});

export const signUpSchema = loginSchema.extend({
    name: z.string().min(2, 'Nome muito curto').max(50, 'Nome muito longo').transform(sanitize),
});

// Perfil do Usuário
export const profileSchema = z.object({
    name: z.string().min(2, 'Nome muito curto').max(50, 'Nome muito longo').transform(sanitize),
    image: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
});

// Exercício / Treino
export const workoutSchema = z.object({
    exerciseName: z.string().min(1, 'Nome do exercício é obrigatório').max(100).transform(sanitize),
    sets: z.array(z.object({
        reps: z.number().int().min(0).max(1000),
        weight: z.number().min(0).max(1000),
    })),
    date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

/**
 * Rate Limiting Simples (Client-side)
 * Protege contra cliques múltiplos/rápidos em botões sensíveis.
 */
const rateLimits = new Map<string, number>();

export const checkRateLimit = (key: string, limitMs: number = 2000): boolean => {
    const now = Date.now();
    const lastCall = rateLimits.get(key) || 0;

    if (now - lastCall < limitMs) {
        return false;
    }

    rateLimits.set(key, now);
    return true;
};

/**
 * Limpeza de dados sensíveis para logs e monitoramento.
 * Remove senhas, emails e chaves de API de objetos ou strings.
 */
export const scrubData = (data: any): any => {
    if (typeof data === 'string') {
        // Regex básica para emails e senhas em strings
        return data
            .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]')
            .replace(/(password|senha|token|key)=[^&\s]+/gi, '$1=[REDACTED]');
    }

    if (data && typeof data === 'object') {
        const scrubbed = Array.isArray(data) ? [...data] : { ...data };
        const sensitiveKeys = ['password', 'senha', 'token', 'key', 'secret', 'email', 'auth'];

        for (const key in scrubbed) {
            if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
                scrubbed[key] = '[REDACTED]';
            } else if (typeof scrubbed[key] === 'object') {
                scrubbed[key] = scrubData(scrubbed[key]);
            }
        }
        return scrubbed;
    }

    return data;
};
