import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const MOCK_WORKOUTS = [
    { id: 1, date: '2026-01-01', time: '10:30', title: 'Treino de Peito (Foco Força)', type: 'Musculação', duration: '1h 15m', volume: '8.400 kg', status: 'Concluído' },
    { id: 2, date: '2025-12-31', time: '09:00', title: 'Cardio HIIT + Abdominais', type: 'Cardio', duration: '50m', volume: '420 kcal', status: 'Concluído' },
    { id: 3, date: '2025-12-30', time: '18:15', title: 'Costas e Bíceps', type: 'Musculação', duration: '1h 20m', volume: '7.200 kg', status: 'Concluído' },
    { id: 4, date: '2025-12-28', time: '16:00', title: 'Ombros e Trapézio', type: 'Musculação', duration: '1h 10m', volume: '5.100 kg', status: 'Incompleto' },
    { id: 5, date: '2025-12-25', time: '07:30', title: 'Inferiores Completo', type: 'Musculação', duration: '1h 45m', volume: '15.600 kg', status: 'Concluído' },
    { id: 6, date: '2025-12-23', time: '08:00', title: 'Mobilidade e Flexibilidade', type: 'Flexibilidade', duration: '30m', volume: '50 kcal', status: 'Concluído' },
];

const WorkoutHistory: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredWorkouts = MOCK_WORKOUTS.filter(w =>
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
                        className="flex-1"
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
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#16a34a] transition-colors">
                                        {workout.title}
                                    </h3>
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
