import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Carrega as variáveis do .env.local
dotenv.config({ path: '.env.local' });

async function testConnection() {
    const url = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

    if (!url) {
        console.error('❌ Erro: DATABASE_URL não encontrada no .env.local');
        return;
    }

    console.log('⏳ Testando conexão com o Neon...');

    try {
        const sql = neon(url);
        const result = await sql`SELECT version(), now();`;

        console.log('✅ Conexão estabelecida com sucesso!');
        console.log('📦 Versão do Postgres:', result[0].version);
        console.log('🕒 Hora no servidor:', result[0].now);

        // Teste extra: verificar se as tabelas do schema foram criadas
        const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'exercises', 'workout_sessions');
    `;

        if (tables.length > 0) {
            console.log('📂 Tabelas encontradas:', tables.map(t => t.table_name).join(', '));
        } else {
            console.log('⚠️ Nenhuma tabela do Fit-Tracker encontrada. Verifique se executou o schema.sql');
        }

    } catch (error) {
        console.error('❌ Falha na conexão:');
        console.error(error);
    }
}

testConnection();
