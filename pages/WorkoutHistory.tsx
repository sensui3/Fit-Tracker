import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { dbService } from '../services/databaseService';

const MOCK_WORKOUT_EXAMPLE = [
    {
        id: 'example-1',
        date: new Date().toISOString().split('T')[0],
        time: '10:30',
        title: 'Treino de Peito (Exemplo)',
        type: 'Musculação',
        duration: '1h 15m',
        volume: '8.400 kg',
        status: 'Concluído',
        isExample: true
    }
];

const WorkoutHistory: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuthStore();
    const [dbWorkouts, setDbWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Load workout sessions from database
    useEffect(() => {
        const loadWorkouts = async () => {
            if (!user) return;
            try {
                const workoutsData = await dbService.query`
                    SELECT
                        ws.id,
                        ws.start_time,
                        ws.end_time,
                        ws.total_volume,
                        ws.notes,
                        tp.name as plan_name,
                        tp.description as plan_description
                    FROM workout_sessions ws
                    LEFT JOIN training_plans tp ON tp.id = ws.plan_id
                    WHERE ws.user_id = ${user.id}
                    ORDER BY ws.start_time DESC
                `;

                const mappedWorkouts = workoutsData.map((workout: any) => {
                    const startTime = new Date(workout.start_time);
                    const endTime = workout.end_time ? new Date(workout.end_time) : null;
                    const duration = endTime ? Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)) : 0;

                    return {
                        id: workout.id,
                        date: startTime.toISOString().split('T')[0],
                        time: startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                        title: workout.plan_name || 'Treino Personalizado',
                        type: 'Musculação',
                        duration: duration > 0 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : 'Em andamento',
                        volume: `${workout.total_volume} kg`,
                        status: endTime ? 'Concluído' : 'Incompleto',
                        isExample: false
                    };
                });

                setDbWorkouts(mappedWorkouts);
            } catch (error) {
                console.error('Erro ao carregar treinos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadWorkouts();
    }, [user]);

    const allWorkouts = dbWorkouts.length > 0 ? dbWorkouts : MOCK_WORKOUT_EXAMPLE;

    const filteredWorkouts = allWorkouts.filter(w =>
        w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Histórico de Treinos</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base">Visualize todas as suas sessões passadas e sua evolução.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-lg">
                    <Input
                        placeholder="Buscar por treino ou tipo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<span className="material-symbols-outlined">search</span>}
                        className="h-12 shadow-sm"
                        containerClassName="flex-1"
                    />
                </div>
            </div>

            {/* History List */}
            <div className="flex flex-col gap-4">
                {filteredWorkouts.map((workout) => (
                    <Card
                        key={workout.id}
                        onClick={() => navigate('/log-workout')}
                        className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer group border-slate-200 dark:border-white/5"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${workout.type === 'Cardio' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                    workout.type === 'Musculação' ? 'bg-[#16a34a] text-white' :
                                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                    }`}>
                                    <span className="material-symbols-outlined text-2xl">
                                        {workout.type === 'Cardio' ? 'directions_run' :
                                            workout.type === 'Musculação' ? 'fitness_center' : 'self_improvement'}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#16a34a] transition-colors">
                                            {workout.title}
                                        </h3>
                                        {workout.isExample && (
                                            <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                                Exemplo
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-base">calendar_today</span>
                                            {new Date(workout.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-base">schedule</span>
                                            {workout.time}
                                        </div>
                                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 tracking-wider">
                                            {workout.type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{workout.duration}</span>
                                    <span className="text-xs font-bold text-slate-400">{workout.volume}</span>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${workout.status === 'Concluído'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                    }`}>
                                    {workout.status}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredWorkouts.length === 0 && (
                    <div className="py-20 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-white/5 mb-4">history</span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nenhum treino encontrado</h3>
                        <p className="text-slate-500">Tente ajustar sua busca ou comece um novo treino.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutHistory;
