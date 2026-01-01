import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXERCISES, MUSCLE_FILTERS, DIFFICULTY_FILTERS, EQUIPMENT_FILTERS } from '../data/exercises';

const ExerciseLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Toggle filter
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredExercises = EXERCISES.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Group filters by category
    const activeMuscleFilters = activeFilters.filter(f => MUSCLE_FILTERS.includes(f));
    const activeDifficultyFilters = activeFilters.filter(f => DIFFICULTY_FILTERS.includes(f));
    const activeEquipmentFilters = activeFilters.filter(f => EQUIPMENT_FILTERS.includes(f));

    // Logic: (Match ANY active muscle OR true if no muscle filters) 
    // AND (Match ANY active difficulty OR true if no difficulty filters)
    // AND (Match ANY active equipment OR true if no equipment filters)
    const matchesMuscle = activeMuscleFilters.length === 0 || activeMuscleFilters.includes(exercise.muscle);
    const matchesDifficulty = activeDifficultyFilters.length === 0 || activeDifficultyFilters.includes(exercise.difficulty);
    const matchesEquipment = activeEquipmentFilters.length === 0 || activeEquipmentFilters.includes(exercise.equipment);

    return matchesSearch && matchesMuscle && matchesDifficulty && matchesEquipment;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col h-full">
      {/* Page Heading & Intro */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Biblioteca de Exercícios
          </h1>
          <p className="mt-2 text-slate-500 dark:text-text-secondary text-lg max-w-2xl">
            Explore nosso catálogo completo. Filtre por grupo muscular, equipamento ou nível de dificuldade para encontrar o exercício perfeito para seu treino.
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-5 py-3 text-sm font-bold text-white dark:text-slate-900 hover:opacity-90 transition-opacity shadow-lg">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Sugerir Novo
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="sticky top-0 z-10 -mx-4 mb-6 bg-background-light/95 dark:bg-background-dark/95 px-4 py-4 backdrop-blur-sm md:mx-0 md:rounded-xl md:px-0 md:bg-transparent md:backdrop-blur-none">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="material-symbols-outlined text-slate-400">search</span>
            </div>
            <input
              className="block w-full rounded-xl border-0 bg-white dark:bg-surface-dark py-3.5 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 ring-1 ring-inset ring-slate-200 dark:ring-border-dark focus:ring-2 focus:ring-inset focus:ring-[#16a34a] sm:text-sm sm:leading-6 shadow-sm transition-shadow"
              placeholder="Buscar exercício por nome..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar items-center">
            {/* Muscle Filters */}
            {MUSCLE_FILTERS.map(muscle => (
              <button
                key={muscle}
                onClick={() => toggleFilter(muscle)}
                className={`shrink-0 inline-flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-inset transition-all
                    ${activeFilters.includes(muscle)
                    ? 'bg-[#16a34a] text-white ring-[#16a34a]'
                    : 'bg-white dark:bg-surface-dark text-slate-700 dark:text-white ring-slate-200 dark:ring-border-dark hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
              >
                {muscle}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-2 shrink-0"></div>

            {/* Difficulty Filters */}
            {DIFFICULTY_FILTERS.map(level => (
              <button
                key={level}
                onClick={() => toggleFilter(level)}
                className={`shrink-0 inline-flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-inset transition-all
                    ${activeFilters.includes(level)
                    ? 'bg-blue-600 text-white ring-blue-600'
                    : 'bg-white dark:bg-surface-dark text-slate-700 dark:text-white ring-slate-200 dark:ring-border-dark hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
              >
                {level}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-2 shrink-0"></div>

            {/* Equipment Filters */}
            {EQUIPMENT_FILTERS.map(equip => (
              <button
                key={equip}
                onClick={() => toggleFilter(equip)}
                className={`shrink-0 inline-flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-inset transition-all
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

        {/* Active Filters (Tags) */}
        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mr-2">Filtros:</span>
            {activeFilters.map(filter => {
              const isDifficulty = DIFFICULTY_FILTERS.includes(filter);
              const isEquipment = EQUIPMENT_FILTERS.includes(filter);

              let badgeClass = 'bg-[#16a34a]/10 text-[#16a34a] dark:text-[#13ec13] ring-[#16a34a]/20'; // Default Muscle
              if (isDifficulty) {
                badgeClass = 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-700/20';
              } else if (isEquipment) {
                badgeClass = 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 ring-purple-700/20';
              }

              const hoverClass = isDifficulty ? 'hover:bg-blue-600/20' : isEquipment ? 'hover:bg-purple-600/20' : 'hover:bg-[#16a34a]/20';

              return (
                <span key={filter} className={`inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${badgeClass}`}>
                  {filter}
                  <button
                    onClick={() => toggleFilter(filter)}
                    className={`group relative -mr-1 h-3.5 w-3.5 rounded-sm ${hoverClass}`}
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              );
            })}
            <button
              onClick={() => setActiveFilters([])}
              className="ml-2 text-xs font-medium text-slate-500 hover:text-[#16a34a] dark:text-slate-400 dark:hover:text-[#13ec13] underline decoration-dashed underline-offset-4"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-10">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => navigate(`/exercise/${exercise.id}`)}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:border-[#16a34a] dark:hover:border-[#16a34a] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-black/40 relative">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="inline-flex items-center rounded-md bg-white/90 dark:bg-black/60 px-2 py-1 text-xs font-bold text-slate-900 dark:text-white shadow-sm backdrop-blur-md">
                  {exercise.muscle}
                </span>
              </div>
              <img
                src={exercise.image}
                alt={exercise.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {exercise.name}
                </h3>
                <button className="text-slate-400 hover:text-[#16a34a] transition-colors">
                  <span className="material-symbols-outlined">bookmark_border</span>
                </button>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-text-secondary">
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">
                  <span className="material-symbols-outlined text-[14px]">fitness_center</span>
                  {exercise.equipment}
                </span>
                <span className={`flex items-center gap-1 px-2 py-1 rounded ${exercise.difficulty === 'Iniciante' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : exercise.difficulty === 'Intermediário' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                  <span className="material-symbols-outlined text-[14px]">equalizer</span>
                  {exercise.difficulty}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                {exercise.description}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center text-sm font-bold text-[#16a34a]">
                Ver Detalhes
                <span className="material-symbols-outlined ml-1 text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-20 bg-slate-100 dark:bg-surface-dark rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-4xl text-slate-400">search_off</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nenhum exercício encontrado</h3>
          <p className="text-slate-500 dark:text-text-secondary mt-2">Tente buscar por outro termo ou limpe os filtros.</p>
          <button
            onClick={() => { setSearchTerm(""); setActiveFilters([]); }}
            className="mt-6 text-[#16a34a] font-bold hover:underline"
          >
            Limpar busca
          </button>
        </div>
      )}

      {/* Simplified Pagination */}
      {filteredExercises.length > 0 && (
        <div className="mt-auto flex items-center justify-center border-t border-slate-200 dark:border-border-dark pt-8">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              Anterior
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              Próximo
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;