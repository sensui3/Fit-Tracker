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

const LogWorkout: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const onSave = useCallback(() => {
    addToast({
      type: 'success',
      title: 'Sucesso!',
      message: 'Treino salvo com sucesso.',
      duration: 4000
    });
    navigate('/workouts');
  }, [addToast, navigate]);

  return (
    <>
      <div className="flex-1 flex justify-center py-8 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-6xl gap-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Card>
                <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                  {/* Exercise Input com Autocomplete */}
                  <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
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

                    {/* Dropdown de Sugestões Memoizado */}
                    {showSuggestions && (
                      <ExerciseSuggestions
                        exercises={filteredExercises}
                        highlightedIndex={highlightedIndex}
                        onSelect={handleSelectExercise}
                      />
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
                      leftIcon={<span className="material-symbols-outlined">check</span>}
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
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <LastLogs navigate={navigate} />
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
const LastLogs = memo(({ navigate }: { navigate: any }) => (
  <Card noPadding>
    <div className="p-4 border-b border-slate-100 dark:border-border-dark flex justify-between items-center">
      <h3 className="text-slate-900 dark:text-white font-bold text-lg">Últimos Registros</h3>
      <button onClick={() => navigate('/workouts')} className="text-[#16a34a] text-sm font-medium hover:underline">Ver tudo</button>
    </div>
    <div className="flex flex-col">
      <div className="flex gap-4 p-4 border-b border-slate-100 dark:border-border-dark/50 hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors cursor-pointer" onClick={() => navigate('/workouts')}>
        <OptimizedImage
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw"
          alt="Supino Reto"
          className="w-full h-full object-cover"
          containerClassName="size-14 rounded-lg shrink-0"
        />
        <div className="flex flex-col justify-center flex-1">
          <h4 className="text-slate-900 dark:text-white font-semibold leading-tight">Supino Reto</h4>
          <p className="text-slate-500 dark:text-text-secondary text-sm">4 séries • 80kg</p>
        </div>
        <div className="text-xs font-medium text-slate-400 dark:text-text-secondary pt-1">
          10:42
        </div>
      </div>
    </div>
  </Card>
));

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