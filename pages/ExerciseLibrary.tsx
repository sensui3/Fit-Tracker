import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MUSCLE_FILTERS, DIFFICULTY_FILTERS, EQUIPMENT_FILTERS } from '../data/exercises';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useExerciseStore } from '../stores/useExerciseStore';
import { useExerciseFilters } from '../hooks/useExerciseFilters';
import { ExerciseCard } from '../components/exercise/ExerciseCard';
import { SuggestExerciseModal } from '../components/exercise/SuggestExerciseModal';
import { GranularErrorBoundary } from '../components/GranularErrorBoundary';

const ExerciseLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useExerciseStore();

  const {
    searchTerm,
    setSearchTerm,
    activeFilters,
    toggleFilter,
    filteredExercises,
    clearFilters,
    loading,
    error,
    addCustomExercise
  } = useExerciseFilters();

  const [isModalOpen, setIsModalOpen] = useState(false);

  /* Handlers para as cards de exercício */
  const handleToggleFavorite = useCallback((id: string) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  const handleNavigate = useCallback((id: string) => {
    navigate(`/exercise/${id}`);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Page Heading & Search */}
      <GranularErrorBoundary name="ExerciseLibraryHeader">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between shrink-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Biblioteca de Exercícios
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-base max-w-xl truncate">
              Explore {filteredExercises.length} exercícios em nosso catálogo completo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto overflow-hidden">
            <div className="relative w-full sm:w-64 md:w-80 group">
              <Input
                placeholder="Buscar exercício..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<span className="material-symbols-outlined">search</span>}
                className="h-12 shadow-sm border-slate-200 dark:border-white/10"
              />
            </div>
            <Button
              leftIcon={<span className="material-symbols-outlined">add</span>}
              className="w-full sm:w-auto shrink-0 shadow-lg"
              onClick={() => setIsModalOpen(true)}
            >
              Sugerir Novo
            </Button>
          </div>
        </div>
      </GranularErrorBoundary>

      {/* Search and Filters Bar */}
      <GranularErrorBoundary name="ExerciseLibraryFilters">
        <div className="mb-6 space-y-4 shrink-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between -mx-4 md:mx-0">
            <div className="flex gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar items-center px-4 md:px-0">
              <div className="flex gap-2 shrink-0 pr-4 md:pr-0">
                {MUSCLE_FILTERS.map(muscle => (
                  <button
                    key={muscle}
                    onClick={() => toggleFilter(muscle)}
                    className={`shrink-0 inline-flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-inset transition-all
                        ${activeFilters.includes(muscle)
                        ? 'bg-[#16a34a] text-white ring-[#16a34a]'
                        : 'bg-white dark:bg-surface-dark text-slate-700 dark:text-white ring-slate-200 dark:ring-border-dark hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0"></div>

              <div className="flex gap-2 shrink-0">
                {DIFFICULTY_FILTERS.map(level => (
                  <button
                    key={level}
                    onClick={() => toggleFilter(level)}
                    className={`shrink-0 inline-flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-inset transition-all
                        ${activeFilters.includes(level)
                        ? 'bg-blue-600 text-white ring-blue-600'
                        : 'bg-white dark:bg-surface-dark text-slate-700 dark:text-white ring-slate-200 dark:ring-border-dark hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0"></div>

              <div className="flex gap-2 shrink-0">
                {EQUIPMENT_FILTERS.map(equip => (
                  <button
                    key={equip}
                    onClick={() => toggleFilter(equip)}
                    className={`shrink-0 inline-flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-inset transition-all
                        ${activeFilters.includes(equip)
                        ? 'bg-purple-600 text-white ring-purple-600'
                        : 'bg-white dark:bg-surface-dark text-slate-700 dark:text-white ring-slate-200 dark:ring-border-dark hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                  >
                    {equip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mr-1">Ativos:</span>
              {activeFilters.map(filter => {
                const isDifficulty = DIFFICULTY_FILTERS.includes(filter);
                const isEquipment = EQUIPMENT_FILTERS.includes(filter);

                let badgeClass = 'bg-[#16a34a]/10 text-[#16a34a] dark:text-[#13ec13] ring-[#16a34a]/20';
                if (isDifficulty) badgeClass = 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-700/20';
                else if (isEquipment) badgeClass = 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 ring-purple-700/20';

                return (
                  <span key={filter} className={`inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase ring-1 ring-inset ${badgeClass}`}>
                    {filter}
                    <button onClick={() => toggleFilter(filter)} className="p-0.5 hover:bg-black/5 rounded-full transition-colors">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                Limpar tudo
              </Button>
            </div>
          )}
        </div>
      </GranularErrorBoundary>

      {/* Main Content */}
      <div className="flex-1 min-h-0 -mx-4 md:mx-0">
        <GranularErrorBoundary name="ExerciseLibraryList">
          {error ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <div className="size-16 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                <span className="material-symbols-outlined text-3xl">error</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Erro ao carregar exercícios</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2">{error}</p>
              <Button onClick={() => window.location.reload()} variant="primary" className="mt-6">
                Tentar novamente
              </Button>
            </div>
          ) : loading ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16a34a]"></div>
            </div>
          ) : filteredExercises.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-0">
              {filteredExercises.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isFavorite={isFavorite(exercise.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={() => handleNavigate(exercise.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-20 bg-slate-100 dark:bg-surface-dark rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-slate-400">search_off</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nenhum exercício encontrado</h3>
              <p className="text-slate-500 dark:text-text-secondary mt-2">Tente buscar por outro termo ou limpe os filtros.</p>
              <button
                onClick={clearFilters}
                className="mt-6 text-[#16a34a] font-bold hover:underline"
              >
                Limpar busca
              </button>
            </div>
          )}
        </GranularErrorBoundary>
      </div>

      <SuggestExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuggest={addCustomExercise}
      />
    </div>
  );
};

export default ExerciseLibrary;
