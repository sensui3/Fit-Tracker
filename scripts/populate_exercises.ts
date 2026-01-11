import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { EXERCISES } from '../data/exercises';

dotenv.config({ path: '.env.local' });

async function populateExercises() {
    const url = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL not found');
        return;
    }

    const sql = neon(url);

    try {
        console.log('🚀 Populando tabela exercises...');

        // Verificar se já existem exercícios
        const existingCount = await sql`SELECT COUNT(*) as count FROM exercises`;
        console.log(`📊 Exercícios existentes: ${existingCount[0].count}`);

        if (existingCount[0].count > 0) {
            console.log('⚠️  A tabela já contém exercícios. Atualizando muscle_group...');

            // Atualizar os muscle_group para corresponder aos filtros
            const updates = [
                { old: 'Peitoral Superior', new: 'Peitoral' },
                { old: 'Pernas (Quadríceps)', new: 'Pernas' },
                { old: 'Costas / Posterior', new: 'Costas' },
                { old: 'Dorsais', new: 'Costas' },
                { old: 'Quadríceps', new: 'Pernas' },
                { old: 'Bíceps / Antebraço', new: 'Bíceps' },
                { old: 'Ombros (Lateral)', new: 'Ombros' }
            ];

            for (const update of updates) {
                await sql`UPDATE exercises SET muscle_group = ${update.new} WHERE muscle_group = ${update.old}`;
                console.log(`✅ Atualizado ${update.old} -> ${update.new}`);
            }

            console.log('🎉 Atualização concluída!');
            return;
        }

        // Preparar dados para inserção
        const exercisesData = EXERCISES.map(exercise => ({
            name: exercise.name,
            muscle_group: exercise.muscle,
            equipment: exercise.equipment,
            difficulty: exercise.difficulty,
            image_url: exercise.image,
            description: exercise.description,
            instructions: exercise.instructions || [],
            is_custom: false,
            user_id: null
        }));

        // Inserir todos os exercícios em uma transação
        for (const exercise of exercisesData) {
            await sql`
                INSERT INTO exercises (name, muscle_group, equipment, difficulty, image_url, description, instructions, is_custom, user_id)
                VALUES (${exercise.name}, ${exercise.muscle_group}, ${exercise.equipment}, ${exercise.difficulty}, ${exercise.image_url}, ${exercise.description}, ${JSON.stringify(exercise.instructions)}, ${exercise.is_custom}, ${exercise.user_id})
            `;
        }

        console.log(`✅ ${exercisesData.length} exercícios inseridos com sucesso!`);

        // Verificar inserção
        const finalCount = await sql`SELECT COUNT(*) as count FROM exercises`;
        console.log(`📊 Total de exercícios na tabela: ${finalCount[0].count}`);

    } catch (error) {
        console.error('❌ Erro ao popular exercícios:', error);
        throw error;
    }
}

populateExercises()
    .then(() => {
        console.log('🎉 Processo concluído!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Processo falhou:', error);
        process.exit(1);
    });
