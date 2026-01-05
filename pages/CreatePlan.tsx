import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/databaseService';
import { ExerciseSelectorModal } from '../components/exercise/ExerciseSelectorModal';
import { Exercise } from '../types';
import { useToast } from '../components/ui/Toast';

const CreatePlan: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dbPlan, setDbPlan] = useState<any>(null);
  const [dbExercises, setDbExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExampleMode, setIsExampleMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const MOCK_PLAN = {
    id: 'example-plan',
    name: 'Plano de Exemplo (Hipertrofia)',
    description: 'Este é um modelo de exemplo para demonstração.',
    exercises: [
      {
        exercise_id: 'ex-1',
        name: 'Supino Reto',
        muscle: 'Peito',
        equipment: 'Barra',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        target_sets: 4,
        target_reps: '8-12',
        target_weight: 80,
        order: 1
      }
    ]
  };

  // Load example plan from database
  useEffect(() => {
    const loadPlanData = async () => {
      if (!user) return;
      try {
        // Load the example plan
        const planResult = await dbService.query`
          SELECT id, name, description FROM training_plans
          WHERE user_id = ${user.id} AND name = 'Plano de Força - Peito e Tríceps'
          LIMIT 1
        `;

        if (planResult && planResult[0]) {
          setDbPlan(planResult[0]);

          // Load plan exercises with exercise details
          const exercisesResult = await dbService.query`
            SELECT
              pe.id,
              pe.exercise_id,
              pe.target_sets,
              pe.target_reps,
              pe.target_weight,
              pe."order",
              e.name,
              e.muscle_group as muscle,
              e.equipment,
              e.image_url as image
            FROM plan_exercises pe
            JOIN exercises e ON e.id = pe.exercise_id
            WHERE pe.plan_id = ${planResult[0].id}
            ORDER BY pe."order"
          `;

          setDbExercises(exercisesResult);
        } else {
          // Fallback to mock if plan not found
          setDbPlan(MOCK_PLAN);
          setDbExercises(MOCK_PLAN.exercises);
          setIsExampleMode(true);
        }
      } catch (error) {
        console.error('Erro ao carregar plano:', error);
        setDbPlan(MOCK_PLAN);
        setDbExercises(MOCK_PLAN.exercises);
        setIsExampleMode(true);
      } finally {
        setLoading(false);
      }
    };

    loadPlanData();
  }, [user]);

  const handleAddExercise = (exercise: Exercise) => {
    const newExercise = {
      exercise_id: exercise.id,
      name: exercise.name,
      muscle: exercise.muscle_group || (exercise as any).muscle,
      equipment: exercise.equipment,
      image: exercise.image_url || exercise.image,
      target_sets: 3,
      target_reps: '12',
      target_weight: 0,
      order: dbExercises.length + 1
    };
    setDbExercises([...dbExercises, newExercise]);
    addToast({
      type: 'success',
      message: `${exercise.name} adicionado ao plano.`
    });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setDbExercises(prev => prev.filter(ex => ex.exercise_id !== exerciseId));
  };

  const handleUpdateExercise = (exerciseId: string, field: string, value: any) => {
    setDbExercises(prev => prev.map(ex =>
      ex.exercise_id === exerciseId ? { ...ex, [field]: value } : ex
    ));
  };

  const totalVolume = useMemo(() => {
    return dbExercises.reduce((acc, ex) => acc + (ex.target_sets * (Number(ex.target_weight) || 0) * 10), 0);
  }, [dbExercises]);

  return (
    <div className="flex-1 w-full flex justify-center py-8 px-4 lg:px-8">
      <div className="flex flex-col w-full max-w-[1024px] gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Criar Novo Plano</h1>
            {isExampleMode && (
              <span className="text-sm font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full">
                Modo Exemplo
              </span>
            )}
          </div>
          <p className="text-slate-500 dark:text-text-secondaryDark text-base font-normal">Monte seu treino personalizado selecionando exercícios e definindo as metas.</p>
        </div>

        {/* Plan Details Inputs */}
        <div className="bg-white dark:bg-surface-darker border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-slate-700 dark:text-white text-sm font-semibold">Nome do Plano</span>
              <input className="w-full rounded-lg bg-slate-50 dark:bg-[#1c271c] border border-slate-300 dark:border-[#3b543b] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5a6b5a] px-4 py-3 focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none transition-all" placeholder="Ex: Treino A - Hipertrofia Peito" type="text" defaultValue="Treino de Força - Membros Superiores" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-slate-700 dark:text-white text-sm font-semibold">Foco Muscular (Opcional)</span>
              <select className="w-full rounded-lg bg-slate-50 dark:bg-[#1c271c] border border-slate-300 dark:border-[#3b543b] text-slate-900 dark:text-white px-4 py-3 focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none appearance-none cursor-pointer transition-all">
                <option>Peito e Tríceps</option>
                <option>Costas e Bíceps</option>
                <option>Pernas Completo</option>
                <option>Ombros</option>
                <option>Full Body</option>
              </select>
            </label>
          </div>
        </div>

        {/* Exercises Builder Area */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-900 dark:text-white text-xl font-bold">Exercícios do Plano</h3>
            <span className="text-slate-500 dark:text-text-secondaryDark text-sm">{dbExercises.length} exercícios adicionados</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-border-light dark:border-[#3b543b] bg-white dark:bg-surface-darker">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-slate-50 dark:bg-[#1c271c] px-6 py-3 border-b border-border-light dark:border-[#3b543b] text-sm font-medium text-slate-500 dark:text-text-secondaryDark">
              <div className="col-span-1">Ordem</div>
              <div className="col-span-4">Exercício</div>
              <div className="col-span-2 text-center">Séries</div>
              <div className="col-span-2 text-center">Reps</div>
              <div className="col-span-2 text-center">Carga (kg)</div>
              <div className="col-span-1 text-right">Ações</div>
            </div>
            {/* Exercises Rows */}
            <div className="divide-y divide-border-light dark:divide-border-dark">
              {dbExercises.map((exercise, index) => (
                <div key={exercise.exercise_id} className="group flex flex-col md:grid md:grid-cols-12 gap-4 p-4 md:px-6 md:py-4 items-center hover:bg-slate-50 dark:hover:bg-[#162016] transition-colors">
                  <div className="flex w-full md:hidden justify-between items-center mb-2">
                    <span className="text-sm text-[#16a34a] font-bold">#{index + 1}</span>
                    <button
                      onClick={() => handleRemoveExercise(exercise.exercise_id)}
                      className="text-red-500 p-1"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                  <div className="col-span-1 hidden md:flex items-center text-slate-400 dark:text-text-secondaryDark">
                    <span className="material-symbols-outlined cursor-grab hover:text-slate-900 dark:hover:text-white">drag_indicator</span>
                  </div>
                  <div className="col-span-4 w-full flex items-center gap-3">
                    <img
                      src={exercise.image}
                      className="size-10 rounded object-cover hidden sm:block bg-slate-200 dark:bg-[#283928]"
                      alt={exercise.name}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-slate-900 dark:text-white font-medium text-base truncate">{exercise.name}</p>
                        {isExampleMode && (
                          <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                            Exemplo
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 dark:text-text-secondaryDark text-xs">{exercise.muscle} • {exercise.equipment}</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6 w-full grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="md:hidden text-xs text-slate-500 dark:text-text-secondaryDark">Séries</label>
                      <input
                        className="w-full bg-slate-50 dark:bg-[#1c271c] border border-slate-300 dark:border-[#3b543b] rounded p-2 text-center text-slate-900 dark:text-white focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none"
                        type="number"
                        value={exercise.target_sets}
                        onChange={(e) => handleUpdateExercise(exercise.exercise_id, 'target_sets', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="md:hidden text-xs text-slate-500 dark:text-text-secondaryDark">Reps</label>
                      <input
                        className="w-full bg-slate-50 dark:bg-[#1c271c] border border-slate-300 dark:border-[#3b543b] rounded p-2 text-center text-slate-900 dark:text-white focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none"
                        type="text"
                        value={exercise.target_reps}
                        onChange={(e) => handleUpdateExercise(exercise.exercise_id, 'target_reps', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="md:hidden text-xs text-slate-500 dark:text-text-secondaryDark">Carga</label>
                      <input
                        className="w-full bg-slate-50 dark:bg-[#1c271c] border border-slate-300 dark:border-[#3b543b] rounded p-2 text-center text-slate-900 dark:text-white focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none"
                        type="number"
                        value={exercise.target_weight}
                        onChange={(e) => handleUpdateExercise(exercise.exercise_id, 'target_weight', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 hidden md:flex justify-end">
                    <button
                      onClick={() => handleRemoveExercise(exercise.exercise_id)}
                      className="text-slate-400 dark:text-text-secondaryDark hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#3b543b] text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white hover:border-[#16a34a] dark:hover:border-[#13ec13] hover:bg-slate-50 dark:hover:bg-[#1c271c] transition-all group"
          >
            <span className="material-symbols-outlined group-hover:text-[#16a34a] transition-colors">add_circle</span>
            <span className="font-bold">Adicionar Exercício</span>
          </button>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white dark:bg-[#1c271c] border border-border-light dark:border-transparent rounded-lg p-4 flex flex-col shadow-sm">
            <span className="text-slate-500 dark:text-text-secondaryDark text-xs uppercase tracking-wider font-semibold">Volume Estimado</span>
            <span className="text-slate-900 dark:text-white text-lg font-bold">{totalVolume.toLocaleString()} kg</span>
          </div>
          {/* ... other stats */}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={() => navigate('/workouts')} className="px-6 py-3 rounded-lg text-slate-900 dark:text-white font-bold bg-slate-200 dark:bg-[#1c271c] hover:opacity-90 transition-colors">Cancelar</button>
          <button onClick={() => navigate('/workouts')} className="px-6 py-3 rounded-lg text-white dark:text-black font-bold bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#13ec13] dark:hover:bg-[#0fd60f] shadow-lg shadow-green-600/20 dark:shadow-green-500/20 transition-all">Salvar Plano</button>
        </div>
      </div>

      <ExerciseSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddExercise}
      />
    </div>
  );
};

export default CreatePlan;
