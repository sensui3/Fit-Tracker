import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const raw = (str: string): TemplateStringsArray => {
    const arr = [str];
    (arr as any).raw = [str];
    return arr as unknown as TemplateStringsArray;
};

async function debug() {
    const url = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL not found');
        return;
    }

    const sql = neon(url);
    try {
        console.log('--- Checking Schemas ---');
        const schemas = await sql(raw("SELECT schema_name FROM information_schema.schemata"));
        console.log('Schemas:', schemas.map((s: any) => s.schema_name));

        console.log('\n--- Checking Tables for Auth ---');
        const tables = await sql(raw("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name IN ('users', 'user', 'sessions', 'session', 'accounts', 'account')"));
        console.table(tables);

        for (const t of tables as any[]) {
            const count = await sql(raw(`SELECT count(*) FROM "${t.table_schema}"."${t.table_name}"`));
            console.log(`Count in ${t.table_schema}.${t.table_name}:`, count[0].count);

            if (count[0].count > 0) {
                const data = await sql(raw(`SELECT * FROM "${t.table_schema}"."${t.table_name}" LIMIT 2`));
                console.log(`Sample from ${t.table_schema}.${t.table_name}:`, data);
            }
        }

    } catch (e) {
        console.error('Error debugging:', e);
    }
}

debug();
