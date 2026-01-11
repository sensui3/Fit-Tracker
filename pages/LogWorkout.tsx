import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { OptimizedImage } from '../components/ui/OptimizedImage';
import { useToast } from '../components/ui/Toast';
import { useWorkoutLogger } from '../hooks/useWorkoutLogger';
import { WorkoutSetItem } from '../components/workout/WorkoutSetItem';
import { ExerciseSuggestions } from '../components/workout/ExerciseSuggestions';
import { useAuthStore } from '../stores/useAuthStore';
import { dbService } from '../services/databaseService';
import { GranularErrorBoundary } from '../components/GranularErrorBoundary';

const LogWorkout: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const {
    exerciseInput,
    filteredExercises,
    showSuggestions,
    setShowSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    sets,
    handleAddSet,
    handleRemoveSet,
    updateSet,
    handleInputChange,
    handleSelectExercise,
    finishWorkout,
    selectedExercise
  } = useWorkoutLogger();

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSuggestions]);

  const onSave = useCallback(async () => {
    if (!user?.id) return;
    if (!selectedExercise) {
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Selecione um exercício primeiro.',
        duration: 3000
      });
      return;
    }

    try {
      setIsSaving(true);
      await finishWorkout(user.id);

      addToast({
        type: 'success',
        title: 'Sucesso!',
        message: 'Treino salvo com sucesso.',
        duration: 4000
      });
      navigate('/workouts');
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao salvar',
        message: 'Não foi possível salvar seu treino. Tente novamente.',
        duration: 5000
      });
    } finally {
      setIsSaving(false);
    }
  }, [addToast, navigate, finishWorkout, user?.id, selectedExercise]);

  return (
    <>
      <div className="flex-1 flex justify-center py-8 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-6xl gap-8">
          <GranularErrorBoundary name="LogWorkoutHeader">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#16a34a] text-sm font-medium uppercase tracking-wider">
                  <span className="material-symbols-outlined text-lg">edit_calendar</span>
                  <span>Sessão Atual</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  Novo Registro
                </h1>
                <p className="text-slate-500 dark:text-text-secondary text-lg max-w-xl">
                  Detalhe seu desempenho. A consistência é a chave para o progresso.
                </p>
              </div>
            </div>
          </GranularErrorBoundary>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <GranularErrorBoundary name="LogWorkoutForm">
                <Card>
                  <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                    {/* Exercise Input com Autocomplete */}
                    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
                      {!selectedExercise ? (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                          <Input
                            label="Exercício"
                            placeholder="Ex: Supino Reto, Agachamento..."
                            value={exerciseInput}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (!showSuggestions || filteredExercises.length === 0) return;
                              if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setHighlightedIndex(prev => (prev < filteredExercises.length - 1 ? prev + 1 : 0));
                              } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredExercises.length - 1));
                              } else if (e.key === 'Enter') {
                                e.preventDefault();
                                if (highlightedIndex >= 0) {
                                  handleSelectExercise(filteredExercises[highlightedIndex]);
                                }
                              } else if (e.key === 'Escape') {
                                setShowSuggestions(false);
                              }
                            }}
                            onFocus={() => {
                              if (exerciseInput) setShowSuggestions(true);
                            }}
                            leftIcon={<span className="material-symbols-outlined">search</span>}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 animate-in zoom-in-95 duration-300">
                          <label className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">Exercício Selecionado</label>
                          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-border-dark group transition-all hover:border-[#16a34a]/50">
                            <OptimizedImage
                              src={selectedExercise.image_url || selectedExercise.image}
                              alt={selectedExercise.name}
                              className="w-full h-full object-cover"
                              containerClassName="size-16 rounded-xl shrink-0 bg-slate-200 dark:bg-white/10 shadow-sm"
                            />
                            <div className="flex flex-col flex-1">
                              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{selectedExercise.name}</h3>
                              <p className="text-sm text-slate-500 dark:text-text-secondary font-medium">{selectedExercise.muscle_group || selectedExercise.muscle}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSelectExercise(null as any)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2"
                              title="Trocar exercício"
                            >
                              <span className="material-symbols-outlined">sync</span>
                            </Button>
                          </div>
                        </div>
                      )}

                      {showSuggestions && !selectedExercise && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                          <ExerciseSuggestions
                            exercises={filteredExercises}
                            highlightedIndex={highlightedIndex}
                            onSelect={handleSelectExercise}
                          />
                        </div>
                      )}
                    </div>

                    {/* Sets List (Dynamic) */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">Séries</label>
                        <span className="text-xs font-bold text-slate-500 dark:text-text-secondary bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">
                          Total: {sets.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-3 px-2 text-[10px] font-black text-slate-400 dark:text-text-secondary uppercase tracking-widest mb-3">
                        <div className="col-span-2 text-center">Set</div>
                        <div className="col-span-3 text-center">Carga (kg)</div>
                        <div className="col-span-3 text-center">Reps</div>
                        <div className="col-span-4 text-center">Status</div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {sets.map((set, index) => (
                          <WorkoutSetItem
                            key={set.id}
                            set={set}
                            index={index}
                            onUpdate={updateSet}
                            onRemove={handleRemoveSet}
                          />
                        ))}
                      </div>

                      <button
                        onClick={handleAddSet}
                        className="w-full mt-2 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-border-dark text-slate-500 dark:text-text-secondary hover:text-[#16a34a] hover:border-[#16a34a] hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 group"
                      >
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add</span>
                        Adicionar Série
                      </button>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-border-dark mt-2">
                      <Button
                        onClick={onSave}
                        isLoading={isSaving}
                        disabled={isSaving}
                        leftIcon={!isSaving && <span className="material-symbols-outlined">check</span>}
                      >
                        Salvar Registro
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowDeleteModal(true)}
                        className="ml-auto text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Excluir
                      </Button>
                    </div>
                  </form>
                </Card>
              </GranularErrorBoundary>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <GranularErrorBoundary name="LogWorkoutRecentLogs">
                <LastLogs navigate={navigate} />
              </GranularErrorBoundary>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal onClose={() => setShowDeleteModal(false)} onConfirm={() => {
          setShowDeleteModal(false);
          navigate('/workouts');
        }} />
      )}
    </>
  );
};

// Sub-componentes memoizados para evitar re-render da página inteira
const LastLogs = memo(({ navigate }: { navigate: any }) => {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentSessions = async () => {
      if (!user?.id) return;
      try {
        const result = await dbService.query`
          SELECT 
            ws.id,
            e.name as exercise_name,
            e.image_url,
            e.image,
            ws.total_volume,
            ws.end_time,
            COUNT(s.id) as sets_count
          FROM workout_sessions ws
          JOIN workout_logs wl ON wl.session_id = ws.id
          JOIN exercises e ON wl.exercise_id = e.id
          JOIN sets s ON s.log_id = wl.id
          WHERE ws.user_id = ${user.id}
          GROUP BY ws.id, e.name, e.image_url, e.image, ws.total_volume, ws.end_time
          ORDER BY ws.end_time DESC
          LIMIT 5
        `;
        setSessions(result);
      } catch (error) {
        console.error('Erro ao buscar treinos recentes:', error);
      }
    };

    fetchRecentSessions();
  }, [user?.id]);

  return (
    <Card noPadding>
      <div className="p-4 border-b border-slate-100 dark:border-border-dark flex justify-between items-center">
        <h3 className="text-slate-900 dark:text-white font-bold text-lg">Últimos Registros</h3>
        <button onClick={() => navigate('/workouts')} className="text-[#16a34a] text-sm font-medium hover:underline">Ver tudo</button>
      </div>
      <div className="flex flex-col">
        {sessions.length > 0 ? sessions.map((session) => (
          <div
            key={session.id}
            className="flex gap-4 p-4 border-b border-slate-100 dark:border-border-dark/50 hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors cursor-pointer group"
            onClick={() => navigate('/workouts')}
          >
            <OptimizedImage
              src={session.image_url || session.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200'}
              alt={session.exercise_name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              containerClassName="size-14 rounded-xl shrink-0 bg-slate-200 dark:bg-white/10"
            />
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <h4 className="text-slate-900 dark:text-white font-bold leading-tight truncate">{session.exercise_name}</h4>
              <p className="text-slate-500 dark:text-text-secondary text-sm font-medium">
                {session.sets_count} séries • {session.total_volume}kg
              </p>
            </div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-text-secondary pt-1">
              {new Date(session.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 italic text-sm">
            Nenhum registro recente
          </div>
        )}
      </div>
    </Card>
  );
});

const DeleteModal = memo(({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
    <div className="relative w-full max-w-sm bg-white dark:bg-surface-dark rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined text-2xl">delete</span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Excluir Registro?</h3>
          <p className="text-sm text-slate-500 dark:text-text-secondary">
            Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  </div>
));

export default LogWorkout;