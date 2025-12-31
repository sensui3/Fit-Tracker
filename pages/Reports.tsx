import React from 'react';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: '01 Ago', val: 30000 },
  { name: '08 Ago', val: 70000 },
  { name: '15 Ago', val: 75000 },
  { name: '22 Ago', val: 110000 },
  { name: '29 Ago', val: 130000 },
];

const progressData = [
  { week: 'Semana 1', real: 65, meta: 70 },
  { week: 'Semana 2', real: 68, meta: 72 },
  { week: 'Semana 3', real: 75, meta: 74 },
  { week: 'Semana 4', real: 79, meta: 76 },
  { week: 'Semana 5', real: 85, meta: 80 },
];

const Reports: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Relatórios de Exercícios</h2>
          <p className="text-slate-500 dark:text-text-secondaryDark text-base">Acompanhe seu progresso e histórico de atividades.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-200 dark:bg-surface-dark p-1 rounded-lg flex items-center">
            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-text-secondaryDark dark:hover:text-white transition-all">Hoje</button>
            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-text-secondaryDark dark:hover:text-white transition-all">Semana</button>
            <button className="bg-white dark:bg-primary-DEFAULT text-slate-900 dark:text-black shadow-sm px-4 py-1.5 rounded-md text-sm font-bold transition-all">Mês</button>
            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-text-secondaryDark dark:hover:text-white transition-all">Custom</button>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 dark:bg-surface-dark hover:bg-slate-800 dark:hover:bg-border-dark border border-transparent dark:border-gray-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span className="text-sm font-bold">Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col gap-2 group hover:border-primary-DEFAULT/50 transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total de Treinos</p>
            <span className="material-symbols-outlined text-primary-DEFAULT bg-primary-DEFAULT/10 p-1.5 rounded-md">fitness_center</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">12</p>
            <p className="text-primary-DEFAULT text-sm font-bold flex items-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +20%
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-1">Comparado ao mês anterior</p>
        </div>

        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col gap-2 group hover:border-primary-DEFAULT/50 transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Carga Total Levantada</p>
            <span className="material-symbols-outlined text-primary-DEFAULT bg-primary-DEFAULT/10 p-1.5 rounded-md">weight</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">45.000<span className="text-lg text-slate-500 ml-1">kg</span></p>
            <p className="text-primary-DEFAULT text-sm font-bold flex items-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +5%
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-1">Volume acumulado</p>
        </div>

        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col gap-2 group hover:border-primary-DEFAULT/50 transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Tempo Médio</p>
            <span className="material-symbols-outlined text-primary-DEFAULT bg-primary-DEFAULT/10 p-1.5 rounded-md">timer</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">55<span className="text-lg text-slate-500 ml-1">min</span></p>
            <p className="text-primary-DEFAULT text-sm font-bold flex items-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +2min
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-1">Duração por sessão</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart (Area) */}
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Volume de Treino vs Tempo</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Consistência (30 dias)</p>
            </div>
          </div>
          
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#283928" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c271c', borderColor: '#283928', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#16a34a' }}
                />
                <Area type="monotone" dataKey="val" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#gradientPrimary)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Progress Trend Chart (Line) */}
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tendência de Progresso</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Intensidade Real vs Meta</p>
            </div>
          </div>
          
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#283928" />
                <XAxis dataKey="week" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c271c', borderColor: '#283928', color: '#fff', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{paddingTop: '20px'}} />
                <Line 
                  name="Intensidade Real"
                  type="monotone" 
                  dataKey="real" 
                  stroke="#16a34a" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  name="Meta Planejada"
                  type="monotone" 
                  dataKey="meta" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Histórico Detalhado</h3>
          <button onClick={() => navigate('/workouts')} className="text-sm text-primary-DEFAULT hover:text-primary-hover font-medium hover:underline">Ver tudo</button>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-border-light dark:border-border-dark">
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Exercício</th>
                  <th className="px-6 py-4 text-center">Séries</th>
                  <th className="px-6 py-4 text-center">Repetições</th>
                  <th className="px-6 py-4 text-right">Carga Máx</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Hoje</span>
                      <span className="text-xs text-slate-500">10:30 AM</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-DEFAULT/20 flex items-center justify-center text-primary-DEFAULT">
                        <span className="material-symbols-outlined text-[18px]">fitness_center</span>
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Supino Reto</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-300">4</td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-300">8-12</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">80kg</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Concluído
                    </span>
                  </td>
                </tr>
                {/* More rows... */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;