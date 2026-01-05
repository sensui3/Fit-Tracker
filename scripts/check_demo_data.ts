import { dbService } from '../services/databaseService.js';

async function checkDemoData() {
    console.log('🔍 Verificando dados de demonstração...\n');

    try {
        const userCount = await dbService.query`SELECT COUNT(*) as total FROM users`;
        console.log('👤 Usuários:', userCount[0].total);

        const goalsCount = await dbService.query`SELECT COUNT(*) as total FROM user_goals`;
        console.log('🎯 Metas:', goalsCount[0].total);

        const plansCount = await dbService.query`SELECT COUNT(*) as total FROM training_plans`;
        console.log('📋 Planos:', plansCount[0].total);

        const exercisesCount = await dbService.query`SELECT COUNT(*) as total FROM exercises`;
        console.log('💪 Exercícios:', exercisesCount[0].total);

        const sessionsCount = await dbService.query`SELECT COUNT(*) as total FROM workout_sessions`;
        console.log('🏋️ Sessões:', sessionsCount[0].total);

        const metricsCount = await dbService.query`SELECT COUNT(*) as total FROM user_metrics`;
        console.log('📏 Métricas:', metricsCount[0].total);

        const notificationsCount = await dbService.query`SELECT COUNT(*) as total FROM notifications`;
        console.log('🔔 Notificações:', notificationsCount[0].total);

        // Mostrar alguns detalhes dos dados
        if (userCount[0].total > 0) {
            const users = await dbService.query`SELECT name, email FROM users LIMIT 5`;
            console.log('\n📋 Usuários exemplo:');
            users.forEach(user => console.log(`   - ${user.name} (${user.email})`));
        }

        if (goalsCount[0].total > 0) {
            const goals = await dbService.query`SELECT type, target_value, current_value FROM user_goals LIMIT 5`;
            console.log('\n🎯 Metas exemplo:');
            goals.forEach(goal => console.log(`   - ${goal.type}: ${goal.current_value} → ${goal.target_value}`));
        }

        if (plansCount[0].total > 0) {
            const plans = await dbService.query`SELECT name, description FROM training_plans LIMIT 5`;
            console.log('\n📋 Planos exemplo:');
            plans.forEach(plan => console.log(`   - ${plan.name}: ${plan.description}`));
        }

    } catch (error) {
        console.error('❌ Erro ao verificar dados:', error);
        process.exit(1);
    }
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    checkDemoData();
}
