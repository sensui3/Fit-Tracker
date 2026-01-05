import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    const url = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

    if (!url) {
        console.error('❌ Erro: DATABASE_URL não encontrada no .env.local');
        console.error('Certifique-se de que o arquivo .env.local existe e contém a chave DATABASE_URL.');
        process.exit(1);
    }

    console.log('⏳ Conectando ao Neon para migração...');
    const sql = neon(url);

    try {
        const schemaPath = path.resolve(__dirname, '../schema.sql');
        console.log(`📂 Lendo arquivo de schema: ${schemaPath}`);

        if (!fs.existsSync(schemaPath)) {
            console.error('❌ Arquivo schema.sql não encontrado!');
            process.exit(1);
        }

        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('🚀 Executando SQL (pode levar alguns segundos)...');

        // Helper to construct a TemplateStringsArray
        const raw = (str: string): TemplateStringsArray => {
            const arr = [str];
            (arr as any).raw = [str];
            return arr as unknown as TemplateStringsArray;
        };

        // Split schema into statements and execute sequentially
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`📜 Encontrados ${statements.length} comandos SQL.`);

        for (const statement of statements) {
            // console.log('Executando:', statement.substring(0, 50) + '...');
            await sql(raw(statement));
        }

        console.log('✅ Migração concluída com sucesso!');
        console.log('📊 Tabelas de Usuários, Exercícios, Treinos e Metas configuradas.');

    } catch (error) {
        console.error('❌ Falha na migração:', error);
        process.exit(1);
    }
}

runMigration();
