import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function clearDemoData() {
    const url = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL not found');
        return;
    }

    const sql = neon(url);

    try {
        console.log('🧹 Limpando dados de exemplo...');

        // Limpar dados em ordem reversa das dependências
        await sql`DELETE FROM sets`;
        await sql`DELETE FROM workout_logs`;
        await sql`DELETE FROM workout_sessions`;
        await sql`DELETE FROM plan_exercises`;
        await sql`DELETE FROM training_plans`;
        await sql`DELETE FROM exercises WHERE is_custom = false`; // Só remove exercícios padrão
        await sql`DELETE FROM user_goals`;
        await sql`DELETE FROM user_metrics`;
        await sql`DELETE FROM notifications`;

        // Não limpar usuários, sessões, contas e verificações do auth
        // para manter a autenticação funcionando

        console.log('✅ Dados de exemplo removidos com sucesso!');

        // Verificar quantos registros restaram
        const remaining = await sql`
            SELECT
                (SELECT COUNT(*) FROM exercises) as exercises,
                (SELECT COUNT(*) FROM training_plans) as plans,
                (SELECT COUNT(*) FROM workout_sessions) as sessions,
                (SELECT COUNT(*) FROM user_goals) as goals,
                (SELECT COUNT(*) FROM user_metrics) as metrics,
                (SELECT COUNT(*) FROM notifications) as notifications
        `;

        console.log('📊 Registros restantes:', remaining[0]);

    } catch (error) {
        console.error('❌ Erro ao limpar dados:', error);
        throw error;
    }
}

clearDemoData()
    .then(() => {
        console.log('🎉 Limpeza concluída!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Limpeza falhou:', error);
        process.exit(1);
    });
