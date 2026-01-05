import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkUsers() {
    const url = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL not found');
        return;
    }

    const sql = neon(url);
    try {
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        console.log('Tables in DB:', tables.map(t => t.table_name));

        const usersPlural = await sql`SELECT count(*) FROM users`;
        console.log('Count users (plural):', usersPlural[0].count);

        try {
            const usersSingular = await sql`SELECT count(*) FROM "user"`;
            console.log('Count user (singular):', usersSingular[0].count);
            const users = await sql`SELECT * FROM "user" LIMIT 5`;
            console.log('Users (singular) content:', users);
        } catch (e) {
            console.log('"user" table probably does not exist');
        }

    } catch (e) {
        console.error(e);
    }
}

checkUsers();
