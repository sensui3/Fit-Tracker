import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

const data = [
  { day: 'Sem 1', val: 30 },
  { day: 'Sem 2', val: 45 },
  { day: 'Sem 3', val: 35 },
  { day: 'Sem 4', val: 70 },
  { day: 'Sem 5', val: 55 },
  { day: 'Sem 6', val: 80 },
  { day: 'Sem 7', val: 65 },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Bem-vindo de volta, João! 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Você completou 80% do seu objetivo semanal. Mantenha o ritmo.</p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => navigate('/notifications')}
             className="relative p-2 text-slate-500 hover:text-[#16a34a] dark:hover:text-[#13ec13] transition-colors"
           >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#162e16] border border-white/5 p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-64 bg-[#13ec13]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2">Continue focado!</h3>
          <p className="text-slate-400 max-w-lg">Seus resultados estão melhorando a cada semana. Tente aumentar a carga no próximo treino de perna.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
              <span className="material-symbols-outlined">timer</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/20 text-green-500">+12%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Tempo de Treino</p>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4h 32m</h4>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500">
              <span className="material-symbols-outlined">local_fire_department</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/20 text-green-500">+5%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Calorias Queimadas</p>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2,450 kcal</h4>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-[#16a34a]/10 text-[#16a34a] dark:text-[#13ec13]">
              <span className="material-symbols-outlined">fitness_center</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-slate-500/20 text-slate-500">0%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Volume Total</p>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12,500 kg</h4>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Volume de Treino</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-[#16a34a] dark:text-[#13ec13] text-2xl font-bold">15,400kg</p>
              <p className="text-slate-500 text-sm">nos últimos 30 dias</p>
            </div>
          </div>
          <div className="h-[250px] w-full mt-4 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13ec13" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#13ec13" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#102210', borderColor: '#283928', color: '#fff' }}
                  itemStyle={{ color: '#13ec13' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke="#13ec13" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Personal Best */}
        <div className="flex flex-col gap-4">
          <div 
            onClick={() => navigate('/timer')}
            className="rounded-xl p-6 bg-gradient-to-br from-green-50 to-white dark:from-surface-dark dark:to-surface-darker border border-border-light dark:border-border-dark relative overflow-hidden group cursor-pointer shadow-sm"
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-9xl text-[#16a34a] dark:text-[#13ec13]">timer</span>
            </div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold z-10 relative">Iniciar Cronômetro</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-4 z-10 relative">Comece um treino livre agora mesmo.</p>
            <button className="relative z-10 flex items-center justify-center rounded-lg bg-[#16a34a]/10 dark:bg-[#13ec13]/20 hover:bg-[#16a34a]/20 dark:hover:bg-[#13ec13]/30 text-[#16a34a] dark:text-[#13ec13] text-sm font-bold h-9 px-4 transition-colors">
              Iniciar
            </button>
          </div>

          <div className="flex-1 rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 flex flex-col shadow-sm">
            <h3 className="text-slate-900 dark:text-white text-base font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#16a34a] dark:text-[#13ec13] text-xl">emoji_events</span>
              Recordes Pessoais
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Supino Reto</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm">100kg</span>
              </div>
              <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Agachamento</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm">140kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Lev. Terra</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm">180kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workout History Section */}
      <div className="rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
          <div className="flex items-center gap-2">
             <span className="material-symbols-outlined text-[#16a34a] dark:text-[#13ec13]">history</span>
             <h4 className="font-bold text-slate-900 dark:text-white">Histórico de Treinos</h4>
          </div>
          <button onClick={() => navigate('/workouts')} className="text-sm text-[#16a34a] dark:text-[#13ec13] hover:underline font-medium">Ver todos</button>
        </div>
        <div className="divide-y divide-border-light dark:divide-border-dark">
          <div onClick={() => navigate('/log-workout')} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">directions_run</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Treino de Cardio</p>
                <div className="flex items-center gap-2 mt-0.5">
                   <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hoje, 08:30</p>
                   <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 rounded text-slate-500 dark:text-slate-400">HIIT</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-sm font-bold text-slate-900 dark:text-white">45 min</span>
               <span className="text-xs text-slate-400">350 kcal</span>
            </div>
          </div>

          <div onClick={() => navigate('/log-workout')} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 dark:text-orange-400 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">fitness_center</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Superiores (Peito e Tríceps)</p>
                <div className="flex items-center gap-2 mt-0.5">
                   <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ontem, 18:00</p>
                   <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 rounded text-slate-500 dark:text-slate-400">Força</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-sm font-bold text-slate-900 dark:text-white">1h 10m</span>
               <span className="text-xs text-slate-400">8.500 kg</span>
            </div>
          </div>

          <div onClick={() => navigate('/log-workout')} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 dark:text-purple-400 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">accessibility_new</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Inferiores (Agachamento Foco)</p>
                <div className="flex items-center gap-2 mt-0.5">
                   <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Seg, 19:30</p>
                   <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 rounded text-slate-500 dark:text-slate-400">Hipertrofia</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-sm font-bold text-slate-900 dark:text-white">1h 30m</span>
               <span className="text-xs text-slate-400">12.200 kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;