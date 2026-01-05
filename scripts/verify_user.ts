import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const raw = (str: string): TemplateStringsArray => {
    const arr = [str];
    (arr as any).raw = [str];
    return arr as unknown as TemplateStringsArray;
};

async function verify() {
    const url = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
    const sql = neon(url!);
    try {
        console.log('Attempting to verify user...');
        const result = await sql(raw("UPDATE neon_auth.user SET \"emailVerified\" = true WHERE email = 'pedrosecundo@gmail.com'"));
        console.log('Update result:', result);

        const check = await sql(raw("SELECT email, \"emailVerified\" FROM neon_auth.user WHERE email = 'pedrosecundo@gmail.com'"));
        console.log('Current status:', check);
    } catch (e) {
        console.error('Update failed:', e);
    }
}

verify();
