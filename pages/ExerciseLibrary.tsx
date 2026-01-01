import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  image: string;
  description: string;
}

const EXERCISES: Exercise[] = [
  {
    id: "1",
    name: "Supino Reto",
    muscle: "Peitoral",
    equipment: "Barra",
    difficulty: "Intermediário",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJt9p9Ob7rrMqby1AVymzotJS0hWbVDbnj2mJeEojIe-89yedWuIFaBnLTtsYG6Yx-RO3kwD-i7k0L5LLzTwFmeVNxCtOsEGOXmSz8b4pYoPw7gkinsFD3qx3WpweFld-v3yApxzj6R56Kf1CwoHdfQ_7ZUYySy5jJbc_fwxUbwe7ucEgGZ4TMe7KVL4XPNW_nrEQYgvtdD9qQIkpnh3SJRE2kTEkueBO-mQuU5KVS0_qNrHvfHEg5bYPPY3nlDTdbeYHMKfApXG8",
    description: "Exercício composto fundamental para o desenvolvimento da massa muscular do peitoral."
  },
  {
    id: "2",
    name: "Agachamento Livre",
    muscle: "Pernas",
    equipment: "Barra",
    difficulty: "Avançado",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbPX5oo2Sb7KSZkMlJVFnDxuzL0TQcmEjzDDPiJhkXDBHjWG1I1VLkTQkVIm1YIxwnYWqi4cinSNXdLeahmltSmzGBBzuKkwYZX3iEqNu6oAgGUMyZCGtjsR-ay0BY4ebLcz9te5pbeCO_9GA_dmhj-OxyHDI7SHaFctMy_owdCWHa47MtlGbD_TKi0Dj6UfUEnQzrQgYTyghhiPQ3kXzhcCpfyAAS26r8a2DUXrQPiu5RpARApxVrsecRq3S3ppyxk_xbJgatiaE",
    description: "O rei dos exercícios de perna. Trabalha quadríceps, glúteos e core."
  },
  {
    id: "3",
    name: "Levantamento Terra",
    muscle: "Costas",
    equipment: "Barra",
    difficulty: "Avançado",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKGhZmLWyqU8EfDxiNyV2jklL4Jn1r82jF3MXOpVsQzCPzK9LWkI_4x10kuFN5R0-UC8W0duuQ6zbM7h0oBDPjxxunHgzPBNqxdxxAjxQT4OZJshs_krHRXdAH2pk8JgSEWwgZRbQ0nHwh7Nla2b9JyipQZ65JijcsqjPfdZZ05aRIRfZ1XpoEI4WyaZk7KG66f37LMmiERzQSKVCl-FZ10G4-OCCPQS8O1DuZqqOZOGOfoy568zxK4CwNg5vKMRigxaWoDjvuWHw",
    description: "Exercício de força total que recruta toda a cadeia posterior do corpo."
  },
  {
    id: "4",
    name: "Rosca Direta",
    muscle: "Bíceps",
    equipment: "Halteres",
    difficulty: "Iniciante",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC3pJnQ-Img4u0bIBrYPePYWhQGOrxhrTQD4ZWZa3_b1RmNEaVXJxFA3WMh4i4bthUK-nmY_N7JyXJ1WSLRPzoJo6e8IoHepiHBD8sSGWrVl0hL5vokfXoJr6UPT8ZxSriVohAlUvPU3jovZoX-qS_KI4nAU3n6EyVXdHjFeWSBqt7E3hkTTZ_RsMjdFip83wbgHiSRdoR2ZrzqjsUY8E12cg0TxtIVRe1-WaM5OFxfeivuqA174_IMmeRtK6LzlUkQYo9Oj3qDfA",
    description: "Isolamento clássico para bíceps. Mantenha os cotovelos fixos."
  },
  {
    id: "5",
    name: "Desenvolvimento",
    muscle: "Ombros",
    equipment: "Halteres",
    difficulty: "Intermediário",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtNi8rBwhlYdb3ovBee5utnUNc5ZU1pKTqYmdMV8s1b41zqVjrfAdqp6Mn5Ra3aSkxpHyP6Z-erbUzDQoHZLSkf_jOYhz9rjiSQmiFE0IzgYugdP7Mjn8sD8cUzrOLZuARc6jFBoG7RGsxxNEFfRQMaiS1RDASXSLWBln3B3q3J1R0Z0eEExaLMWFFfIpzp_kW_XtEC6vyc3n49fWl_wEnAQ9KWASzmrpQuCu97wqKtAr8hce77olypRJR2b1A8fCzdNVt3RCDNQY",
    description: "Excelente para a porção anterior e medial dos deltoides."
  },
  {
    id: "6",
    name: "Esteira - HIIT",
    muscle: "Cardio",
    equipment: "Máquina",
    difficulty: "Avançado",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUTaMMoLGn0ssCZ4fx1aPaHxNhUrkr9mWmYiA5nzO7um1RGuEUK5OJvnAkmC6YvELPMpR6157RJGDQO83r6kTbQipwVYxhVv-nvpfmf_3gVmxliL-Il8Qg59-mzv9CRpSKmrRM5bXgVF0egShE6nPOml-kVAZ2B2dhbbyqMIeq1h6MdDQmb0wE_hIpQrBI8EkcJCNVUg18QwWjQTnExreEt91XPxbvBATLr4l1G-V04LU-DsAyAmtntYKMURkqc0SFp5FlQO13cGM",
    description: "Treino intervalado de alta intensidade para queima de gordura e resistência."
  },
  {
    id: "7",
    name: "Puxada Alta",
    muscle: "Costas",
    equipment: "Máquina",
    difficulty: "Iniciante",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNkF30GhdYWoP3JSVhOIZNjkO4AF8b2UBb-uIwyMboCx09UR7K63FGb6anqGqko9F8gAfHOSGNxznFWUggqFTaQB9_97NZjOJn-rfZ16YvAREJxGnX8Kwp_ubP3rEfsO7lNJaWRfgHdfecN_W36lBcIUBzKAPQ3Ne8wbByoVlCwwSUvldpppIDK5zoW4MDUCWILEE8aHPJCXrcFktNwQzASkAnyQ4FA5b2bfxScPNX1rYPXJY02fqnODJaLHnneubSKE3guLRsxrE",
    description: "Foca na largura das costas (latíssimo do dorso). Mantenha o tronco estável."
  },
  {
    id: "8",
    name: "Tríceps Corda",
    muscle: "Tríceps",
    equipment: "Polia",
    difficulty: "Iniciante",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-1Ow3_nu_nXWWP4eyH76m_kZMDErv21s2qcPgPGH1xzBuN4dC_eiIAC9oV8vfOIT1aBRIzUeINGNnQoG62tB6OpWnCIRilxygWMHGUm9zeTwJqCUyu5KriSaR5B5X4a5FAN8JKpBQFVBiOqNyOjnzPrKLF7slJgJk_qkfOlHpbIrHeqwtMPqRKhlN3oxgBj2cYEMsjJWxps664aOahKBpjKLTRdwo-b7bTGSHyeX-D8iByBv7Fk7L5kwNQhjG5-JIy55sce4FbQk",
    description: "Isola as cabeças laterais do tríceps. Permite maior amplitude no final do movimento."
  }
];

const MUSCLE_FILTERS = ['Peitoral', 'Costas', 'Pernas', 'Bíceps', 'Ombros', 'Cardio'];
const DIFFICULTY_FILTERS = ['Iniciante', 'Intermediário', 'Avançado'];

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
    
    // Logic: (Match ANY active muscle OR true if no muscle filters) AND (Match ANY active difficulty OR true if no difficulty filters)
    const matchesMuscle = activeMuscleFilters.length === 0 || activeMuscleFilters.includes(exercise.muscle);
    const matchesDifficulty = activeDifficultyFilters.length === 0 || activeDifficultyFilters.includes(exercise.difficulty);
    
    return matchesSearch && matchesMuscle && matchesDifficulty;
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
            Explore nosso catálogo completo. Filtre por grupo muscular ou nível de dificuldade para encontrar o exercício perfeito para seu treino.
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
          </div>
        </div>

        {/* Active Filters (Tags) */}
        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mr-2">Filtros:</span>
            {activeFilters.map(filter => {
                const isDifficulty = DIFFICULTY_FILTERS.includes(filter);
                return (
                  <span key={filter} className={`inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${isDifficulty ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-700/20' : 'bg-[#16a34a]/10 text-[#16a34a] dark:text-[#13ec13] ring-[#16a34a]/20'}`}>
                    {filter}
                    <button 
                      onClick={() => toggleFilter(filter)}
                      className={`group relative -mr-1 h-3.5 w-3.5 rounded-sm ${isDifficulty ? 'hover:bg-blue-600/20' : 'hover:bg-[#16a34a]/20'}`}
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