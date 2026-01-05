import { neon } from '@neondatabase/serverless';

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
            throw error;
        }
    },

    /**
     * Atalho para buscar um único registro
     */
    async findOne<T = any>(strings: string | TemplateStringsArray, ...params: any[]): Promise<T | null> {
        const results = await this.query(strings, ...params);
        return (results[0] as T) || null;
    }
};

export default dbService;
