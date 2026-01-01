import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExerciseDetails: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Estado para configuração do exercício
  const [workoutConfig, setWorkoutConfig] = useState({
    plan: 'Treino A - Superiores',
    sets: 4,
    reps: '10-12',
    weight: 20
  });

  // URL base da imagem
  const exerciseImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCrTzRI2ONEYwjZ8K9_UoS0UNn3OGGHDSkTllT9zFTEXKmfripVEW8lsJkgWTmePAu_yOXemoH4RftsmtpdmCsUvOTk85Nj-J5SsT6HqplNmEZjxUZiutCTZUuUeycu0rW3gjlqck_723hZV7Tn3KjYmgiR1zTNaByM-oszdbLK6I3uxIv8X2bQgm_4N2auV_HP-nRxe-aXOuAgicUmmXKiNbBV-Pqj3Uskzx4-O1T2eNn-txJtHKQR3awj9qs2dduPCWeimHog6XQ";

  const handleSave = () => {
    // Aqui iria a lógica real de salvar no backend/contexto
    alert(`Exercício adicionado ao plano "${workoutConfig.plan}" com sucesso!\nConfiguração: ${workoutConfig.sets} séries de ${workoutConfig.reps} repetições.`);
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col items-center px-4 py-6 md:px-10 lg:px-40 relative">
      
      {/* Modal de Configuração */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAddModal(false)}
          ></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#1c271c] rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-50 dark:bg-[#152015] px-6 py-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-DEFAULT">edit_calendar</span>
                Configurar Exercício
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-5">
              
              {/* Seleção de Plano */}
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Selecionar Plano</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                  </span>
                  <select 
                    value={workoutConfig.plan}
                    onChange={(e) => setWorkoutConfig({...workoutConfig, plan: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-DEFAULT outline-none appearance-none font-medium cursor-pointer"
                  >
                    <option>Treino A - Superiores</option>
                    <option>Treino B - Inferiores</option>
                    <option>Treino C - Full Body</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </span>
                </div>
              </label>

              {/* Grid de Configuração */}
              <div className="grid grid-cols-3 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Séries</span>
                  <input 
                    type="number" 
                    value={workoutConfig.sets}
                    onChange={(e) => setWorkoutConfig({...workoutConfig, sets: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-DEFAULT outline-none font-bold"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Reps</span>
                  <input 
                    type="text" 
                    value={workoutConfig.reps}
                    onChange={(e) => setWorkoutConfig({...workoutConfig, reps: e.target.value})}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-DEFAULT outline-none font-bold"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Carga (kg)</span>
                  <input 
                    type="number" 
                    value={workoutConfig.weight}
                    onChange={(e) => setWorkoutConfig({...workoutConfig, weight: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-DEFAULT outline-none font-bold"
                  />
                </label>
              </div>

              {/* Preview */}
              <div className="bg-primary-DEFAULT/10 rounded-xl p-3 flex items-center gap-3">
                 <div className="size-10 bg-primary-DEFAULT rounded-lg flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined">fitness_center</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-primary-DEFAULT uppercase tracking-wider">Resumo</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Adicionar <strong>{workoutConfig.sets}x{workoutConfig.reps}</strong> ao {workoutConfig.plan.split('-')[0]}
                    </span>
                 </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-2 flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 dark:bg-[#0a160a] hover:bg-slate-200 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-3 px-4 bg-primary-DEFAULT hover:bg-primary-hover text-white dark:text-black font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all transform active:scale-[0.98]"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1200px] flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span 
                onClick={() => navigate('/workouts')} 
                className="hover:text-primary-DEFAULT transition-colors cursor-pointer"
              >
                Biblioteca
              </span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-primary-DEFAULT font-medium">Detalhes</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Supino Reto
            </h1>
            <p className="text-slate-500 dark:text-[#9db99d] text-lg">Barbell Bench Press</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-[#1c2e1c] group">
              <img 
                src={`${exerciseImageUrl}=s1200`}
                srcSet={`
                  ${exerciseImageUrl}=s480 480w,
                  ${exerciseImageUrl}=s768 768w,
                  ${exerciseImageUrl}=s1200 1200w
                `}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Exercise Video Placeholder" 
                loading="lazy"
                decoding="async"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary-DEFAULT animate-pulse"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Composto</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1c2e1c] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/5">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-primary-DEFAULT">menu_book</span>
                Instruções de Execução
              </h3>
              <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-8">
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-[#283928] rounded-full -left-4 ring-4 ring-white dark:ring-[#1c2e1c] text-primary-DEFAULT font-bold text-sm">1</span>
                  <h4 className="font-semibold text-lg mb-1 text-slate-900 dark:text-white">Posicionamento</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Deite-se no banco plano com os olhos diretamente abaixo da barra. Mantenha os pés firmes no chão e a coluna levemente arqueada.</p>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-[#283928] rounded-full -left-4 ring-4 ring-white dark:ring-[#1c2e1c] text-primary-DEFAULT font-bold text-sm">2</span>
                  <h4 className="font-semibold text-lg mb-1 text-slate-900 dark:text-white">Movimento</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Desça a barra de forma controlada até tocar o meio do peito. Empurre a barra de volta à posição inicial.</p>
                </li>
              </ol>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Botão de Adicionar ao Treino */}
            <div className="bg-white dark:bg-[#1c2e1c] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="w-full flex items-center justify-center gap-3 bg-primary-DEFAULT hover:bg-primary-hover text-white dark:text-black py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-600/20 group transform hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
                  Adicionar aos Meus Treinos
                </button>
                <p className="text-center text-xs text-slate-500 dark:text-gray-400 mt-3">
                  Adicione este exercício a um plano existente para monitorar sua progressão.
                </p>
            </div>

            <div className="bg-surface-light dark:bg-[#162616] p-6 rounded-2xl border-2 border-primary-DEFAULT/20 shadow-lg relative overflow-hidden">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-primary-DEFAULT">body_system</span>
                Músculos Trabalhados
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase text-gray-500 font-bold mb-2 tracking-wider">Primário</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-DEFAULT text-white dark:text-black font-bold text-sm">
                      Peitoral Maior
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetails;