import { dbService } from '../services/databaseService.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function populateDemoData() {
    console.log('🎭 Populando dados de demonstração...');

    try {
        // 1. Criar usuário exemplo
        console.log('👤 Criando usuário exemplo...');
        const userResult = await dbService.query`
      INSERT INTO users (id, name, email, email_verified, plan, created_at, updated_at)
      VALUES ('demo-user-id', 'Usuário Exemplo', 'exemplo@fittracker.com', true, 'Premium', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `;

        console.log('✅ Usuário exemplo criado:', userResult);

        // 2. Criar metas exemplo
        console.log('🎯 Criando metas exemplo...');
        const goals = [
            {
                user_id: 'demo-user-id',
                type: 'weight',
                target_value: 75.0,
                current_value: 78.5,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
                is_completed: false
            },
            {
                user_id: 'demo-user-id',
                type: 'workout_frequency',
                target_value: 5.0, // 5x por semana
                current_value: 4.0,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
                is_completed: false
            },
            {
                user_id: 'demo-user-id',
                type: 'lift_max',
                target_value: 100.0, // Supino 100kg
                current_value: 92.0,
                deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 dias
                is_completed: false
            }
        ];

        for (const goal of goals) {
            await dbService.query`
        INSERT INTO user_goals (user_id, type, target_value, current_value, deadline, is_completed, created_at)
        VALUES (${goal.user_id}, ${goal.type}, ${goal.target_value}, ${goal.current_value}, ${goal.deadline}, ${goal.is_completed}, NOW())
        ON CONFLICT DO NOTHING
      `;
        }
        console.log('✅ Metas exemplo criadas');

        // 3. Criar plano de treino exemplo
        console.log('📋 Criando plano de treino exemplo...');
        const planResult = await dbService.query`
      INSERT INTO training_plans (user_id, name, description, is_active, created_at)
      VALUES ('demo-user-id', 'Plano de Força - Peito e Tríceps', 'Treino focado no desenvolvimento da força do peitoral e tríceps', true, NOW())
      ON CONFLICT DO NOTHING
      RETURNING id
    `;

        let planId = planResult[0]?.id;
        if (!planId) {
            // Se já existe, buscar o ID
            const existingPlan = await dbService.query`
        SELECT id FROM training_plans WHERE user_id = 'demo-user-id' AND name = 'Plano de Força - Peito e Tríceps' LIMIT 1
      `;
            planId = existingPlan[0]?.id;
        }

        if (planId) {
            console.log('✅ Plano criado/encontrado:', planId);

            // Buscar exercícios para adicionar ao plano
            const exercises = await dbService.query`
        SELECT id, name FROM exercises WHERE name IN ('Supino Reto (Barra)', 'Supino Inclinado (Halteres)', 'Crucifixo na Máquina', 'Tríceps Corda')
      `;

            console.log('📝 Adicionando exercícios ao plano...');
            const planExercises = [
                { exercise_id: exercises.find(e => e.name === 'Supino Reto (Barra)')?.id, order: 1, sets: 4, reps: '8-12', weight: 70 },
                { exercise_id: exercises.find(e => e.name === 'Supino Inclinado (Halteres)')?.id, order: 2, sets: 3, reps: '10-12', weight: 25 },
                { exercise_id: exercises.find(e => e.name === 'Crucifixo na Máquina')?.id, order: 3, sets: 3, reps: '12-15', weight: 50 },
                { exercise_id: exercises.find(e => e.name === 'Tríceps Corda')?.id, order: 4, sets: 3, reps: '10-12', weight: 30 }
            ];

            for (const planEx of planExercises) {
                if (planEx.exercise_id) {
                    await dbService.query`
            INSERT INTO plan_exercises (plan_id, exercise_id, target_sets, target_reps, target_weight, "order", created_at)
            VALUES (${planId}, ${planEx.exercise_id}, ${planEx.sets}, ${planEx.reps}, ${planEx.weight}, ${planEx.order}, NOW())
            ON CONFLICT DO NOTHING
          `;
                }
            }
            console.log('✅ Exercícios adicionados ao plano');
        }

        // 4. Criar sessões de treino exemplo
        console.log('🏋️ Criando sessões de treino exemplo...');
        const sessions = [
            {
                user_id: 'demo-user-id',
                plan_id: planId,
                start_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
                end_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000).toISOString(), // 75 minutos depois
                total_volume: 2450.0,
                notes: 'Treino intenso, foco na execução correta'
            },
            {
                user_id: 'demo-user-id',
                plan_id: planId,
                start_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
                end_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 68 * 60 * 1000).toISOString(),
                total_volume: 2200.0,
                notes: 'Bom treino, mas senti fadiga no tríceps'
            }
        ];

        for (const session of sessions) {
            const sessionResult = await dbService.query`
        INSERT INTO workout_sessions (user_id, plan_id, start_time, end_time, total_volume, notes)
        VALUES (${session.user_id}, ${session.plan_id}, ${session.start_time}, ${session.end_time}, ${session.total_volume}, ${session.notes})
        ON CONFLICT DO NOTHING
        RETURNING id
      `;

            if (sessionResult[0]?.id) {
                console.log('✅ Sessão criada:', sessionResult[0].id);
            }
        }

        // 5. Criar métricas corporais exemplo
        console.log('📏 Criando métricas corporais exemplo...');
        const metrics = [
            {
                user_id: 'demo-user-id',
                weight: 78.5,
                height: 175.0,
                body_fat: 15.5,
                chest: 95.0,
                waist: 82.0,
                biceps_left: 32.0,
                biceps_right: 31.5,
                recorded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias atrás
            },
            {
                user_id: 'demo-user-id',
                weight: 78.2,
                height: 175.0,
                body_fat: 15.3,
                chest: 95.5,
                waist: 81.5,
                biceps_left: 32.2,
                biceps_right: 31.8,
                recorded_at: new Date().toISOString() // Hoje
            }
        ];

        for (const metric of metrics) {
            await dbService.query`
        INSERT INTO user_metrics (user_id, weight, height, body_fat, chest, waist, biceps_left, biceps_right, recorded_at)
        VALUES (${metric.user_id}, ${metric.weight}, ${metric.height}, ${metric.body_fat}, ${metric.chest}, ${metric.waist}, ${metric.biceps_left}, ${metric.biceps_right}, ${metric.recorded_at})
        ON CONFLICT DO NOTHING
      `;
        }
        console.log('✅ Métricas corporais criadas');

        // 6. Criar notificações exemplo
        console.log('🔔 Criando notificações exemplo...');
        const notifications = [
            {
                user_id: 'demo-user-id',
                title: 'Meta de Peso Próxima!',
                message: 'Você está a apenas 2kg da sua meta de 75kg. Continue assim!',
                read: false,
                type: 'goal_achieved'
            },
            {
                user_id: 'demo-user-id',
                title: 'Lembrete de Treino',
                message: 'Não esqueça do seu treino de peito e tríceps hoje!',
                read: true,
                type: 'workout_reminder'
            }
        ];

        for (const notification of notifications) {
            await dbService.query`
        INSERT INTO notifications (user_id, title, message, read, type, created_at)
        VALUES (${notification.user_id}, ${notification.title}, ${notification.message}, ${notification.read}, ${notification.type}, NOW())
        ON CONFLICT DO NOTHING
      `;
        }
        console.log('✅ Notificações criadas');

        console.log('🎉 Dados de demonstração populados com sucesso!');
        console.log('📊 Resumo:');
        console.log('   - 1 usuário exemplo');
        console.log('   - 3 metas');
        console.log('   - 1 plano de treino');
        console.log('   - 4 exercícios no plano');
        console.log('   - 2 sessões de treino');
        console.log('   - 2 registros de métricas');
        console.log('   - 2 notificações');

    } catch (error) {
        console.error('❌ Erro ao popular dados de demonstração:', error);
        process.exit(1);
    }
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    populateDemoData();
}
