import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from the root (two levels up from scripts/)
const envPath = path.resolve(__dirname, '..', '.env.local');

console.log('Loading env from:', envPath);

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    dotenv.config();
}

const connectionString = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error('No DATABASE_URL found!');
    process.exit(1);
}

const sql = neon(connectionString);

async function run() {
    console.log('Running migration to add profile columns...');
    try {
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE`;
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT`;
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT`;
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS goal TEXT`;
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS activity_level TEXT`;
        console.log('Migration successful! Columns added.');
    } catch (e) {
        console.error('Migration failed:', e);
    }
}

run();
