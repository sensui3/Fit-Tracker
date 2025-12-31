import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ExerciseData {
  name: string;
  muscle: string;
  image: string;
}

// Lista enriquecida de exercícios com imagens e grupos musculares
const EXERCISE_DB: ExerciseData[] = [
  { name: "Supino Reto (Barra)", muscle: "Peitoral", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw" },
  { name: "Supino Inclinado (Halteres)", muscle: "Peitoral Superior", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw" },
  { name: "Crucifixo na Máquina", muscle: "Peitoral", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw" },
  { name: "Agachamento Livre", muscle: "Pernas (Quadríceps)", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYmC0rPib7YXizNo1HV2gleXNd_QBIIsW63ljv5wGV4DiJTsWtk0CKhIGL6qbylH6tPbCd_OGZcJH8O4KYzmF7fcIAOwFcRlsvgMgXyPG6K6fYQks-2GFXJ4Np0tTU77q7eKx9ie2fO7HO6x9f5gF7-8o6noeaG88dbPB5SJvmHxYicv-FDIWUNRD6FN1ayAn7MDm-iC2FQjM0Mfw40Ky9xpwPVZQep1PiBKHDDuyoEYf60N-kwoWGO9sREBUAqrtL4Jdj43K83Z0" },
  { name: "Leg Press 45", muscle: "Pernas", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYmC0rPib7YXizNo1HV2gleXNd_QBIIsW63ljv5wGV4DiJTsWtk0CKhIGL6qbylH6tPbCd_OGZcJH8O4KYzmF7fcIAOwFcRlsvgMgXyPG6K6fYQks-2GFXJ4Np0tTU77q7eKx9ie2fO7HO6x9f5gF7-8o6noeaG88dbPB5SJvmHxYicv-FDIWUNRD6FN1ayAn7MDm-iC2FQjM0Mfw40Ky9xpwPVZQep1PiBKHDDuyoEYf60N-kwoWGO9sREBUAqrtL4Jdj43K83Z0" },
  { name: "Cadeira Extensora", muscle: "Quadríceps", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYmC0rPib7YXizNo1HV2gleXNd_QBIIsW63ljv5wGV4DiJTsWtk0CKhIGL6qbylH6tPbCd_OGZcJH8O4KYzmF7fcIAOwFcRlsvgMgXyPG6K6fYQks-2GFXJ4Np0tTU77q7eKx9ie2fO7HO6x9f5gF7-8o6noeaG88dbPB5SJvmHxYicv-FDIWUNRD6FN1ayAn7MDm-iC2FQjM0Mfw40Ky9xpwPVZQep1PiBKHDDuyoEYf60N-kwoWGO9sREBUAqrtL4Jdj43K83Z0" },
  { name: "Levantamento Terra", muscle: "Costas / Posterior", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYmC0rPib7YXizNo1HV2gleXNd_QBIIsW63ljv5wGV4DiJTsWtk0CKhIGL6qbylH6tPbCd_OGZcJH8O4KYzmF7fcIAOwFcRlsvgMgXyPG6K6fYQks-2GFXJ4Np0tTU77q7eKx9ie2fO7HO6x9f5gF7-8o6noeaG88dbPB5SJvmHxYicv-FDIWUNRD6FN1ayAn7MDm-iC2FQjM0Mfw40Ky9xpwPVZQep1PiBKHDDuyoEYf60N-kwoWGO9sREBUAqrtL4Jdj43K83Z0" },
  { name: "Puxada Alta", muscle: "Dorsais", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYmC0rPib7YXizNo1HV2gleXNd_QBIIsW63ljv5wGV4DiJTsWtk0CKhIGL6qbylH6tPbCd_OGZcJH8O4KYzmF7fcIAOwFcRlsvgMgXyPG6K6fYQks-2GFXJ4Np0tTU77q7eKx9ie2fO7HO6x9f5gF7-8o6noeaG88dbPB5SJvmHxYicv-FDIWUNRD6FN1ayAn7MDm-iC2FQjM0Mfw40Ky9xpwPVZQep1PiBKHDDuyoEYf60N-kwoWGO9sREBUAqrtL4Jdj43K83Z0" },
  { name: "Remada Curvada", muscle: "Costas", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYmC0rPib7YXizNo1HV2gleXNd_QBIIsW63ljv5wGV4DiJTsWtk0CKhIGL6qbylH6tPbCd_OGZcJH8O4KYzmF7fcIAOwFcRlsvgMgXyPG6K6fYQks-2GFXJ4Np0tTU77q7eKx9ie2fO7HO6x9f5gF7-8o6noeaG88dbPB5SJvmHxYicv-FDIWUNRD6FN1ayAn7MDm-iC2FQjM0Mfw40Ky9xpwPVZQep1PiBKHDDuyoEYf60N-kwoWGO9sREBUAqrtL4Jdj43K83Z0" },
  { name: "Rosca Direta", muscle: "Bíceps", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw" },
  { name: "Rosca Martelo", muscle: "Bíceps / Antebraço", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw" },
  { name: "Tríceps Corda", muscle: "Tríceps", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw" },
  { name: "Tríceps Testa", muscle: "Tríceps", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw" },
  { name: "Desenvolvimento Militar", muscle: "Ombros", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw" },
  { name: "Elevação Lateral", muscle: "Ombros (Lateral)", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw" },
  { name: "Abdominal Supra", muscle: "Abdômen", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw" },
  { name: "Prancha Isométrica", muscle: "Core", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw" },
];

const LogWorkout: React.FC = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estados para o Autocomplete
  const [exerciseInput, setExerciseInput] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<ExerciseData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Manipula a digitação no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setExerciseInput(userInput);

    // Filtra a lista
    if (userInput.length > 0) {
      const filtered = EXERCISE_DB.filter(
        (exercise) => exercise.name.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredExercises(filtered);
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  };

  // Manipula navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  // Seleciona um item da lista
  const handleSelectExercise = (exercise: ExerciseData) => {
    setExerciseInput(exercise.name);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

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
  }, []);

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
              <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm p-6 md:p-8">
                <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                  {/* Exercise Input com Autocomplete */}
                  <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
                    <label className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">Exercício</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 dark:text-text-secondary group-focus-within:text-[#16a34a] transition-colors">search</span>
                      </div>
                      <input 
                        className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:ring-2 focus:ring-[#16a34a]/50 focus:border-[#16a34a] transition-all text-lg font-medium" 
                        placeholder="Ex: Supino Reto, Agachamento..." 
                        type="text" 
                        value={exerciseInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                           if(exerciseInput) setShowSuggestions(true);
                        }}
                      />
                    </div>

                    {/* Dropdown de Sugestões */}
                    {showSuggestions && filteredExercises.length > 0 && (
                      <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-surface-darker border border-slate-200 dark:border-border-dark rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredExercises.map((exercise, index) => (
                          <div 
                            key={index}
                            className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-4 group ${index === highlightedIndex ? 'bg-slate-100 dark:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                            onClick={() => handleSelectExercise(exercise)}
                          >
                            <img 
                              src={exercise.image} 
                              alt={exercise.name} 
                              className="size-10 rounded-md object-cover bg-slate-200 dark:bg-white/10 shrink-0"
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

                  {/* Sets Reps Weight */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sets */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">Séries</label>
                        <div className="flex items-center h-14 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl px-2">
                        <button className="size-10 flex items-center justify-center text-slate-500 hover:text-[#16a34a] hover:bg-[#16a34a]/10 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">remove</span>
                        </button>
                        <input className="flex-1 w-full bg-transparent text-center border-none focus:ring-0 text-slate-900 dark:text-white font-bold text-xl p-0" type="number" defaultValue="4"/>
                        <button className="size-10 flex items-center justify-center text-slate-500 hover:text-[#16a34a] hover:bg-[#16a34a]/10 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">add</span>
                        </button>
                        </div>
                    </div>
                    {/* Reps */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">Repetições</label>
                        <div className="flex items-center h-14 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl px-2">
                        <button className="size-10 flex items-center justify-center text-slate-500 hover:text-[#16a34a] hover:bg-[#16a34a]/10 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">remove</span>
                        </button>
                        <input className="flex-1 w-full bg-transparent text-center border-none focus:ring-0 text-slate-900 dark:text-white font-bold text-xl p-0" type="number" defaultValue="12"/>
                        <button className="size-10 flex items-center justify-center text-slate-500 hover:text-[#16a34a] hover:bg-[#16a34a]/10 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">add</span>
                        </button>
                        </div>
                    </div>
                    {/* Weight */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide flex justify-between">
                                                                    Carga
                                                                    <span className="text-xs text-[#16a34a] bg-[#16a34a]/10 px-2 py-0.5 rounded uppercase">KG</span>
                        </label>
                        <div className="relative h-14">
                        <input className="w-full h-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl px-4 text-slate-900 dark:text-white font-bold text-xl focus:ring-2 focus:ring-[#16a34a]/50 focus:border-[#16a34a] transition-all" placeholder="0" type="number"/>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">weight</span>
                        </div>
                        </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-border-dark mt-2">
                    <button onClick={() => navigate('/workouts')} className="bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#13ec13] dark:hover:bg-[#0fd60f] text-white dark:text-black font-bold h-12 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-green-600/25 dark:shadow-green-500/25">
                      <span className="material-symbols-outlined">check</span>
                      Salvar Registro
                    </button>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="text-slate-500 dark:text-text-secondary hover:text-red-600 dark:hover:text-red-400 font-medium h-12 px-6 rounded-lg transition-colors ml-auto"
                    >
                      Excluir
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-border-dark flex justify-between items-center">
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg">Últimos Registros</h3>
                    <button onClick={() => navigate('/workouts')} className="text-[#16a34a] text-sm font-medium hover:underline">Ver tudo</button>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex gap-4 p-4 border-b border-slate-100 dark:border-border-dark/50 hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors cursor-pointer">
                            <img 
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw"
                              alt="Supino Reto" 
                              className="size-14 rounded-lg object-cover shrink-0"
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
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl shadow-2xl p-8 flex flex-col gap-6 items-center text-center ring-1 ring-white/10 overflow-hidden transform transition-all scale-100 opacity-100">
            <div className="size-20 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-4xl">delete</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Excluir Registro?</h3>
              <p className="text-slate-500 dark:text-text-secondary leading-relaxed">
                Você está prestes a remover o exercício <span className="font-bold text-slate-900 dark:text-white">{exerciseInput || "Selecionado"}</span>. Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full pt-2">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="h-12 rounded-xl font-bold text-slate-500 dark:text-text-secondary hover:bg-slate-50 dark:hover:bg-background-dark hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-border-dark"
              >
                Cancelar
              </button>
              <button 
                onClick={() => { setShowDeleteModal(false); navigate('/dashboard'); }}
                className="h-12 rounded-xl font-bold bg-red-600 text-white shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogWorkout;