import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXERCISES } from '../data/exercises';
import { Exercise } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { OptimizedImage } from '../components/ui/OptimizedImage';
import { useToast } from '../components/ui/Toast';

interface WorkoutSet {
  id: number;
  reps: number;
  weight: number;
  completed: boolean;
  notes?: string;
  showNotes?: boolean;
}

const DEFAULT_REST_TIME = 60; // seconds

import { useWorkoutLogger } from '../hooks/useWorkoutLogger';
import { RestTimer } from '../components/workout/RestTimer';

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
    isResting,
    setIsResting,
    sets,
    handleAddSet,
    handleRemoveSet,
    updateSet,
    handleInputChange,
    handleSelectExercise,
    DEFAULT_REST_TIME
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

                    {/* Dropdown de Sugestões */}
                    {showSuggestions && filteredExercises.length > 0 && (
                      <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-surface-darker border border-slate-200 dark:border-border-dark rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredExercises.map((exercise, index) => (
                          <div
                            key={exercise.id}
                            className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-4 group ${index === highlightedIndex ? 'bg-slate-100 dark:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                            onClick={() => handleSelectExercise(exercise)}
                          >
                            <OptimizedImage
                              src={exercise.image}
                              alt={exercise.name}
                              className="w-full h-full object-cover"
                              containerClassName="size-10 rounded-md shrink-0 bg-slate-200 dark:bg-white/10"
                            />
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-slate-900 dark:text-white font-medium truncate group-hover:text-[#16a34a] transition-colors">{exercise.name}</span>
                              <span className="text-xs text-slate-500 dark:text-text-secondary truncate">{exercise.muscle}</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-[#16a34a] text-xl opacity-0 group-hover:opacity-100 transition-all -ml-2">add_circle</span>
                          </div>
                        ))}
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

                    <div className="grid grid-cols-10 gap-2 px-2 text-xs font-bold text-slate-400 dark:text-text-secondary uppercase tracking-wider text-center mb-1">
                      <div className="col-span-1">Set</div>
                      <div className="col-span-3">Kg</div>
                      <div className="col-span-3">Reps</div>
                      <div className="col-span-3">Ações</div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {sets.map((set, index) => (
                        <React.Fragment key={set.id}>
                          <div className={`grid grid-cols-10 gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-300 p-2 rounded-xl border transition-all ${set.completed ? 'bg-green-50/50 dark:bg-green-900/10 border-[#16a34a]/30' : 'border-transparent'}`}>
                            <div className="col-span-1 flex justify-center">
                              <div className={`size-8 rounded-full font-bold text-sm flex items-center justify-center transition-colors ${set.completed ? 'bg-[#16a34a] text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'}`}>
                                {index + 1}
                              </div>
                            </div>

                            <div className="col-span-3">
                              <input
                                type="number"
                                value={set.weight}
                                disabled={set.completed}
                                onChange={(e) => updateSet(set.id, 'weight', parseFloat(e.target.value) || 0)}
                                className={`w-full border border-slate-200 dark:border-border-dark rounded-xl px-2 py-2 text-center font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a]/50 focus:border-[#16a34a] outline-none transition-all ${set.completed ? 'bg-slate-100 dark:bg-white/5 opacity-70 cursor-not-allowed' : 'bg-slate-50 dark:bg-background-dark'}`}
                              />
                            </div>

                            <div className="col-span-3">
                              <input
                                type="number"
                                value={set.reps}
                                disabled={set.completed}
                                onChange={(e) => updateSet(set.id, 'reps', parseFloat(e.target.value) || 0)}
                                className={`w-full border border-slate-200 dark:border-border-dark rounded-xl px-2 py-2 text-center font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a]/50 focus:border-[#16a34a] outline-none transition-all ${set.completed ? 'bg-slate-100 dark:bg-white/5 opacity-70 cursor-not-allowed' : 'bg-slate-50 dark:bg-background-dark'}`}
                              />
                            </div>

                            <div className="col-span-3 flex justify-center gap-1.5">
                              <button
                                onClick={() => updateSet(set.id, 'showNotes', !set.showNotes)}
                                title={set.notes ? "Editar Nota" : "Adicionar Nota"}
                                className={`size-10 rounded-xl flex items-center justify-center transition-all ${set.showNotes || set.notes
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'
                                  }`}
                              >
                                <span className={`material-symbols-outlined text-xl ${set.notes ? 'filled' : ''}`}>
                                  {set.notes ? 'description' : 'edit_note'}
                                </span>
                              </button>
                              <button
                                onClick={() => updateSet(set.id, 'completed', !set.completed)}
                                title={set.completed ? "Editar (Desmarcar)" : "Concluir Série"}
                                className={`size-10 rounded-xl flex items-center justify-center transition-all ${set.completed
                                  ? 'bg-[#16a34a] text-white shadow-lg shadow-green-600/20 hover:bg-[#15803d]'
                                  : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 hover:bg-slate-300 dark:hover:bg-white/20'
                                  }`}
                              >
                                <span className="material-symbols-outlined text-xl">
                                  {set.completed ? 'edit' : 'check'}
                                </span>
                              </button>
                              <button
                                onClick={() => handleRemoveSet(set.id)}
                                title="Remover Série"
                                className="size-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              >
                                <span className="material-symbols-outlined text-xl">delete</span>
                              </button>
                            </div>
                          </div>

                          {set.showNotes && (
                            <div className="col-span-12 -mt-2 animate-in fade-in slide-in-from-top-1">
                              <textarea
                                value={set.notes || ''}
                                onChange={(e) => updateSet(set.id, 'notes', e.target.value)}
                                placeholder="Adicione observações sobre a execução..."
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-border-dark rounded-xl p-3 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y min-h-[60px]"
                              />
                            </div>
                          )}
                        </React.Fragment>
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
                      onClick={() => {
                        addToast({
                          type: 'success',
                          title: 'Sucesso!',
                          message: 'Treino salvo com sucesso.',
                          duration: 4000
                        });
                        navigate('/workouts');
                      }}
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
              <Card noPadding>
                <div className="p-4 border-b border-slate-100 dark:border-border-dark flex justify-between items-center">
                  <h3 className="text-slate-900 dark:text-white font-bold text-lg">Últimos Registros</h3>
                  <button onClick={() => navigate('/workouts')} className="text-[#16a34a] text-sm font-medium hover:underline">Ver tudo</button>
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-4 p-4 border-b border-slate-100 dark:border-border-dark/50 hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors cursor-pointer">
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
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
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
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    setShowDeleteModal(false);
                    navigate('/workouts');
                  }}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogWorkout;