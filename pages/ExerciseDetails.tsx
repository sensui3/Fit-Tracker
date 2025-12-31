import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExerciseDetails: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center px-4 py-6 md:px-10 lg:px-40">
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrTzRI2ONEYwjZ8K9_UoS0UNn3OGGHDSkTllT9zFTEXKmfripVEW8lsJkgWTmePAu_yOXemoH4RftsmtpdmCsUvOTk85Nj-J5SsT6HqplNmEZjxUZiutCTZUuUeycu0rW3gjlqck_723hZV7Tn3KjYmgiR1zTNaByM-oszdbLK6I3uxIv8X2bQgm_4N2auV_HP-nRxe-aXOuAgicUmmXKiNbBV-Pqj3Uskzx4-O1T2eNn-txJtHKQR3awj9qs2dduPCWeimHog6XQ" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Exercise Video Placeholder" 
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