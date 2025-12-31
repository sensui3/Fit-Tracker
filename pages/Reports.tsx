import React, { useState, useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Dados simulados para diferentes períodos
const MOCK_DATA = {
  week: [
    { name: 'Seg', val: 4500 },
    { name: 'Ter', val: 5200 },
    { name: 'Qua', val: 3800 },
    { name: 'Qui', val: 6100 },
    { name: 'Sex', val: 5900 },
    { name: 'Sab', val: 7200 },
    { name: 'Dom', val: 2000 },
  ],
  month: [
    { name: 'Sem 1', val: 30000 },
    { name: 'Sem 2', val: 70000 },
    { name: 'Sem 3', val: 75000 },
    { name: 'Sem 4', val: 110000 },
    { name: 'Sem 5', val: 130000 },
  ],
  year: [
    { name: 'Jan', val: 120000 },
    { name: 'Fev', val: 135000 },
    { name: 'Mar', val: 110000 },
    { name: 'Abr', val: 140000 },
    { name: 'Mai', val: 155000 },
    { name: 'Jun', val: 170000 },
    { name: 'Jul', val: 165000 },
    { name: 'Ago', val: 180000 },
    { name: 'Set', val: 195000 },
    { name: 'Out', val: 190000 },
    { name: 'Nov', val: 210000 },
    { name: 'Dez', val: 230000 },
  ]
};

const progressData = [
  { week: 'Ponto 1', real: 65, meta: 70 },
  { week: 'Ponto 2', real: 68, meta: 72 },
  { week: 'Ponto 3', real: 75, meta: 74 },
  { week: 'Ponto 4', real: 79, meta: 76 },
  { week: 'Ponto 5', real: 85, meta: 80 },
];

type PeriodType = 'week' | 'month' | 'year';
type ExerciseType = 'all' | 'strength' | 'cardio' | 'flexibility';

// Custom Tooltip Component para o gráfico de linha
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1c271c] border border-slate-200 dark:border-[#283928] p-4 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <p className="text-slate-900 dark:text-white font-bold mb-3 text-sm border-b border-slate-100 dark:border-white/10 pb-2">{label}</p>
        <div className="flex flex-col gap-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 min-w-[140px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-white/5 px-1.5 rounded">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<PeriodType>('month');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('all');

  // Lógica para filtrar/transformar os dados com base na seleção
  const chartData = useMemo(() => {
    let data = [...MOCK_DATA[period]];

    // Simulação de alteração de valores baseada no tipo (apenas visual)
    if (exerciseType === 'cardio') {
      data = data.map(d => ({ ...d, val: Math.round(d.val * 0.4) })); // Menor volume em cardio (ex: kcals/metros)
    } else if (exerciseType === 'strength') {
      data = data.map(d => ({ ...d, val: Math.round(d.val * 0.9) })); // Maioria do volume
    } else if (exerciseType === 'flexibility') {
        data = data.map(d => ({ ...d, val: Math.round(d.val * 0.1) })); // Baixo volume numérico
    }

    return data;
  }, [period, exerciseType]);

  const getPeriodLabel = () => {
    switch(period) {
        case 'week': return 'Últimos 7 dias';
        case 'month': return 'Últimos 30 dias';
        case 'year': return 'Este Ano';
        default: return '';
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Relatórios de Exercícios</h2>
          <p className="text-slate-500 dark:text-text-secondaryDark text-base">Acompanhe seu progresso e histórico de atividades.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Exercise Type Filter */}
          <div className="relative">
             <select 
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value as ExerciseType)}
                className="appearance-none bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white pl-4 pr-10 py-2 rounded-lg text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] cursor-pointer min-w-[160px]"
             >
                <option value="all">Todos os Tipos</option>
                <option value="strength">Musculação</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibilidade</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
             </div>
          </div>

          {/* Time Period Filter */}
          <div className="bg-slate-200 dark:bg-surface-dark p-1 rounded-lg flex items-center">
            <button 
                onClick={() => setPeriod('week')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${period === 'week' ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
            >
                Semana
            </button>
            <button 
                onClick={() => setPeriod('month')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${period === 'month' ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
            >
                Mês
            </button>
            <button 
                onClick={() => setPeriod('year')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${period === 'year' ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
            >
                Ano
            </button>
          </div>
          
          <button className="hidden md:flex items-center gap-2 bg-slate-900 dark:bg-surface-dark hover:bg-slate-800 dark:hover:bg-border-dark border border-transparent dark:border-gray-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm h-[38px]">
            <span className="material-symbols-outlined text-[20px]">download</span>
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
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{period === 'week' ? '4' : period === 'month' ? '18' : '142'}</p>
            <p className="text-primary-DEFAULT text-sm font-bold flex items-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +12%
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-1">Neste período</p>
        </div>

        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col gap-2 group hover:border-primary-DEFAULT/50 transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Volume Acumulado</p>
            <span className="material-symbols-outlined text-primary-DEFAULT bg-primary-DEFAULT/10 p-1.5 rounded-md">weight</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {exerciseType === 'cardio' ? '2.4k' : (period === 'week' ? '12k' : period === 'month' ? '45k' : '520k')}
                <span className="text-lg text-slate-500 ml-1">{exerciseType === 'cardio' ? 'kcal' : 'kg'}</span>
            </p>
            <p className="text-primary-DEFAULT text-sm font-bold flex items-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +5%
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-1">Total levantado/gasto</p>
        </div>

        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col gap-2 group hover:border-primary-DEFAULT/50 transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Duração Média</p>
            <span className="material-symbols-outlined text-primary-DEFAULT bg-primary-DEFAULT/10 p-1.5 rounded-md">timer</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">55<span className="text-lg text-slate-500 ml-1">min</span></p>
            <p className="text-primary-DEFAULT text-sm font-bold flex items-center">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +2min
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-1">Por sessão</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart (Area) */}
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Volume de Treino</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{exerciseType === 'all' ? 'Geral' : exerciseType} • {getPeriodLabel()}</p>
            </div>
          </div>
          
          <div className="w-full h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#283928" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} interval={period === 'year' ? 1 : 0} />
                <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c271c', borderColor: '#283928', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#16a34a' }}
                  formatter={(value: number) => [`${value.toLocaleString()}`, exerciseType === 'cardio' ? 'Kcal' : 'Kg']}
                />
                <Area 
                    type="monotone" 
                    dataKey="val" 
                    stroke="#16a34a" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#gradientPrimary)" 
                    animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Trend Chart (Line) */}
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tendência de Progresso</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Intensidade Real vs Meta</p>
            </div>
          </div>
          
          <div className="w-full h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#283928" />
                <XAxis dataKey="week" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
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