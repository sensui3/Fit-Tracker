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
    const sql = neon(url!);
    try {
        const users = await sql(raw("SELECT id, email, \"emailVerified\", name FROM neon_auth.user"));
        console.log('Users in neon_auth.user:', users);

        const accounts = await sql(raw("SELECT id, \"userId\", \"providerId\" FROM neon_auth.account"));
        console.log('Accounts in neon_auth.account:', accounts);
    } catch (e) {
        console.error(e);
    }
}

debug();
