import { neon } from '@neondatabase/serverless';
import { logDomainError } from '../lib/logrocket';

/**
 * Serviço de conexão com o banco de dados Neon.
 * Utiliza o driver serverless otimizado para Cloudflare Workers/Pages.
 */

let sqlInstance: any = null;

const getSql = () => {
    if (sqlInstance) return sqlInstance;

    // Tenta pegar de várias fontes conforme o ambiente (Node, Vite, Cloudflare)
    const connectionString =
        (typeof process !== 'undefined' ? process.env.DATABASE_URL : undefined) ||
        (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.DATABASE_URL) ||
        (import.meta.env ? import.meta.env.VITE_DATABASE_URL : undefined) ||
        '';

    if (!connectionString) {
        if (typeof window === 'undefined') {
            console.error('❌ DATABASE_URL não encontrada. Certifique-se de configurar o arquivo .env.local');
        }
        throw new Error('No database connection string provided');
    }

    sqlInstance = neon(connectionString, { disableWarningInBrowsers: true });
    return sqlInstance;
};

export const dbService = {
    /**
     * Executa uma query SQL simples
     */
    /**
     * DataService para Neon
     */
    async query<T = any>(strings: string | TemplateStringsArray, ...params: any[]): Promise<T[]> {
        const sql = getSql();
        try {
            let result;
            if (typeof strings === 'string') {
                // Adaptação para driver mais recente que exige TemplateStringsArray
                const raw = [strings];
                (raw as any).raw = [strings];
                result = await sql(raw as unknown as TemplateStringsArray, ...params);
            } else {
                result = await sql(strings, ...params);
            }
            return result as unknown as T[];
        } catch (error) {
            console.error('Database Query Error:', error);
            logDomainError(error as Error, 'database_query', {
                query: typeof strings === 'string' ? strings : strings.join('?'),
                params
            });
            throw error;
        }
    },

    /**
     * Atalho para buscar um único registro
     */
    async findOne<T = any>(strings: string | TemplateStringsArray, ...params: any[]): Promise<T | null> {
        const results = await this.query(strings, ...params);
        return (results[0] as T) || null;
    },

    /**
     * Dashboard: Obtém estatísticas consolidadas do usuário (Otimizado)
     * Utiliza índices para cálculo rápido de totais
     */
    async getDashboardStats(userId: string) {
        // Query unificada e simplificada com agregações diretas
        const result = await this.query`
            SELECT 
                COUNT(ws.id) as total_workouts,
                COALESCE(SUM(ws.total_volume), 0) as total_volume,
                COALESCE(AVG(EXTRACT(EPOCH FROM (ws.end_time - ws.start_time))), 0) as avg_duration
            FROM workout_sessions ws
            WHERE ws.user_id = ${userId}
            AND ws.end_time IS NOT NULL
        `;
        return result[0];
    },

    /**
     * Dashboard: Obtém histórico recente com paginação
     * Substitui carregar tudo de uma vez
     */
    async getRecentWorkouts(userId: string, limit = 5, offset = 0) {
        return this.query`
          SELECT
            ws.id,
            ws.start_time,
            ws.end_time,
            ws.total_volume,
            tp.name as plan_name,
            COUNT(wl.id) as exercises_count,
            EXTRACT(EPOCH FROM (ws.end_time - ws.start_time))/60 as duration_minutes
          FROM workout_sessions ws
          LEFT JOIN training_plans tp ON ws.plan_id = tp.id
          LEFT JOIN workout_logs wl ON wl.session_id = ws.id
          WHERE ws.user_id = ${userId}
          AND ws.end_time IS NOT NULL
          GROUP BY ws.id, ws.start_time, ws.end_time, ws.total_volume, tp.name
          ORDER BY ws.start_time DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
    },

    /**
     * Dashboard: Obtém recordes pessoais (Top 3)
     */
    async getPersonalRecords(userId: string) {
        return this.query`
          SELECT
            e.name,
            MAX(s.weight) as max_weight
          FROM sets s
          JOIN workout_logs wl ON s.log_id = wl.id
          JOIN exercises e ON wl.exercise_id = e.id
          JOIN workout_sessions ws ON wl.session_id = ws.id
          WHERE ws.user_id = ${userId}
          GROUP BY e.name
          ORDER BY max_weight DESC
          LIMIT 3
        `;
    }
};

export default dbService;
