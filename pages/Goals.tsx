import React, { useState } from 'react';
import { useGoalFilters, Goal, GoalTab, ViewMode } from '../hooks/useGoalFilters';

const INITIAL_GOALS: Goal[] = [
  {
    id: 1,
    title: 'Supino Reto',
    category: 'Força • Curto Prazo',
    icon: 'fitness_center',
    current: 92,
    target: 100,
    unit: 'kg',
    progress: 92,
    statusIcon: 'schedule',
    statusText: 'Restam 14 dias',
    trend: '+2kg esta semana',
    trendColor: 'text-green-600 dark:text-green-400',
    shimmer: true
  },
  {
    id: 2,
    title: 'VO2 Max',
    category: 'Cardio • Longo Prazo',
    icon: 'monitor_heart',
    current: 48,
    target: 55,
    unit: 'ml/kg',
    progress: 65,
    statusIcon: 'schedule',
    statusText: '3 meses',
    trend: 'Estagnado',
    trendColor: 'text-orange-500',
    shimmer: false
  },
  {
    id: 3,
    title: 'Peso Corporal',
    category: 'Estética • Curto Prazo',
    icon: 'accessibility_new',
    current: 78.5,
    target: 75,
    unit: 'kg',
    progress: 40,
    statusIcon: 'trending_down',
    statusText: 'Baixando',
    trend: '-0.5kg esta semana',
    trendColor: 'text-green-600 dark:text-green-400',
    shimmer: false,
    reverse: true
  },
  {
    id: 4,
    title: 'Barra Fixa',
    category: 'Habilidade • Longo Prazo',
    icon: 'sports_gymnastics',
    current: 12,
    target: 20,
    unit: 'reps',
    progress: 60,
    statusIcon: 'schedule',
    statusText: 'Indefinido',
    trend: 'Semana passada: 11',
    trendColor: 'text-slate-500',
    shimmer: false
  },
  {
    id: 5,
    title: 'Corrida 5km',
    category: 'Cardio • Curto Prazo',
    icon: 'directions_run',
    current: 20,
    target: 20,
    unit: 'min',
    progress: 100,
    statusIcon: 'check_circle',
    statusText: 'Concluído em 12/12',
    trend: 'Meta Atingida!',
    trendColor: 'text-[#16a34a]',
    completed: true,
    shimmer: false
  }
];

const Goals: React.FC = () => {
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const {
    activeTab,
    viewMode,
    filteredGoals,
    handleTabChange,
    handleViewModeChange
  } = useGoalFilters(INITIAL_GOALS);

  const stats = [
    { label: 'Metas Ativas', value: '8', badge: 'Active', badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: 'flag' },
    { label: 'Concluídas (2023)', value: '12', sub: '+3 este mês', subColor: 'text-[#16a34a]', icon: 'emoji_events' },
    { label: 'Taxa de Sucesso', value: '87%', sub: '+2.4%', subColor: 'text-[#16a34a]', icon: 'trending_up' },
    { label: 'Sequência Atual', value: '5 dias', sub: 'Recorde: 21 dias', subColor: 'text-slate-400', icon: 'local_fire_department' },
  ];

  const weeklyConsistency = [
    { day: 'Seg', val: 60, target: 100 },
    { day: 'Ter', val: 85, target: 100 },
    { day: 'Qua', val: 0, target: 100 },
    { day: 'Qui', val: 70, target: 100 },
    { day: 'Sex', val: 90, target: 100, active: true },
    { day: 'Sab', val: 40, target: 100, future: true },
    { day: 'Dom', val: 0, target: 100, future: true },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Metas de Fitness</h1>
          <p className="text-slate-500 dark:text-text-secondary text-lg">Defina limites e supere seus recordes pessoais.</p>
        </div>
        <button
          onClick={() => setShowAddGoalModal(true)}
          className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-5 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-green-600/20"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Nova Meta
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-slate-200 dark:border-border-dark shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
              <span className="material-symbols-outlined text-[#16a34a]">{stat.icon}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
              {stat.badge ? (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${stat.badgeColor}`}>{stat.badge}</span>
              ) : (
                <span className={`text-sm font-medium mb-1 ${stat.subColor}`}>{stat.sub}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Consistency Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl p-6 border border-slate-200 dark:border-border-dark shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Consistência Semanal</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Frequência de treinos vs Meta</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-[#16a34a]"></div>
                Realizado
              </div>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                Meta
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between h-48 gap-2 sm:gap-4">
            {weeklyConsistency.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 gap-2 group cursor-pointer h-full justify-end">
                <div className="relative w-full max-w-[40px] h-full rounded-t-sm bg-slate-100 dark:bg-white/5 overflow-hidden">
                  <div
                    className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-500 ${day.future ? 'bg-[#16a34a]/30' : 'bg-[#16a34a]'}`}
                    style={{ height: `${day.val}%` }}
                  ></div>
                  <div className="absolute inset-0 bg-[#16a34a]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className={`text-xs font-medium ${day.active ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'}`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Goal Card (Marathon) */}
        <div className="lg:col-span-1 relative overflow-hidden rounded-xl bg-[#102210] p-6 shadow-lg flex flex-col group">
          <div className="absolute -top-10 -right-10 size-64 bg-[#16a34a]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
              <span className="inline-block bg-[#16a34a] text-[#102210] text-xs font-bold px-2 py-1 rounded mb-2">Foco Principal</span>
              <h3 className="text-white text-xl font-bold">Maratona 42k</h3>
            </div>
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm text-[#16a34a]">
              <span className="material-symbols-outlined">directions_run</span>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center mb-6">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">32.5</span>
              <span className="text-slate-400 text-lg">/ 42 km</span>
            </div>
            <p className="text-slate-400 text-sm">Distância máxima alcançada</p>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
              <span>Progresso</span>
              <span>77%</span>
            </div>
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#16a34a] w-[77%] rounded-full shadow-[0_0_10px_rgba(22,163,74,0.5)]"></div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
              <span className="material-symbols-outlined text-[#16a34a] text-base">event</span>
              <span>Meta para 15 de Nov</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-slate-200 dark:border-border-dark">
        <div className="flex gap-8 overflow-x-auto no-scrollbar">
          {(['Todas as Metas', 'Curto Prazo', 'Longo Prazo', 'Concluídas'] as GoalTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative pb-4 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-900 dark:bg-[#16a34a] rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Minhas Metas</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleViewModeChange('grid')}
            className={`size-10 flex items-center justify-center rounded-xl transition-all ${viewMode === 'grid'
              ? 'bg-[#16a34a] text-white shadow-lg shadow-green-600/20'
              : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-xl">grid_view</span>
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={`size-10 flex items-center justify-center rounded-xl transition-all ${viewMode === 'list'
              ? 'bg-[#16a34a] text-white shadow-lg shadow-green-600/20'
              : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-xl">list</span>
          </button>
        </div>
      </div>

      {/* Goals Content */}
      <div className={`
        ${viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'flex flex-col gap-4'
        }
      `}>
        {filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className={`
              group bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm hover:shadow-md transition-all
              ${viewMode === 'grid'
                ? 'flex flex-col rounded-xl p-5'
                : 'flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl relative overflow-hidden'
              }
            `}
          >
            {/* Action Bar for List View (Background indicator) */}
            {viewMode === 'list' && (
              <div className="absolute left-0 top-0 w-1.5 h-full bg-[#16a34a]"></div>
            )}

            <div className={`flex items-center gap-4 ${viewMode === 'list' ? 'flex-1 md:min-w-[200px]' : 'mb-4'}`}>
              <div className="size-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                <span className="material-symbols-outlined text-2xl">{goal.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg truncate">{goal.title}</h4>
                <p className="text-xs text-slate-500 dark:text-text-secondary font-medium tracking-wide uppercase">{goal.category}</p>
              </div>
            </div>

            <div className={`flex flex-col gap-2 ${viewMode === 'list' ? 'flex-[2]' : 'mb-3'}`}>
              <div className="flex items-end justify-between text-sm mb-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{goal.current}</span>
                  <span className="text-slate-500 font-bold">{goal.unit}</span>
                </div>
                <div className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                  Meta: {goal.target}{goal.unit}
                </div>
              </div>
              <div className={`h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden ${goal.reverse ? 'flex justify-end' : ''}`}>
                <div
                  className="h-full bg-[#16a34a] rounded-full relative overflow-hidden transition-all duration-1000"
                  style={{ width: `${goal.progress}%` }}
                >
                  {goal.shimmer && (
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                  )}
                </div>
              </div>
            </div>

            <div className={`
              ${viewMode === 'grid'
                ? 'pt-4 border-t border-slate-100 dark:border-border-dark flex items-center justify-between'
                : 'flex flex-row md:flex-col lg:flex-row items-center gap-4 md:items-end lg:items-center justify-between'
              }
            `}>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium text-xs">
                <span className="material-symbols-outlined text-base text-[#16a34a]">{goal.statusIcon}</span>
                <span>{goal.statusText}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-opacity-10 ${goal.trendColor} ${goal.trendColor.replace('text-', 'bg-')}`}>
                  {goal.trend}
                </span>
                {viewMode === 'list' && (
                  <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                )}
              </div>
            </div>

            {viewMode === 'grid' && (
              <button className="absolute top-4 right-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            )}
          </div>
        ))}

        {/* Add New Goal Card */}
        <button
          onClick={() => setShowAddGoalModal(true)}
          className={`
            group flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-border-dark transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 hover:border-[#16a34a]
            ${viewMode === 'grid'
              ? 'flex-col gap-4 rounded-2xl min-h-[220px]'
              : 'flex-row gap-6 p-6 rounded-2xl min-h-[80px]'
            }
          `}
        >
          <div className="size-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#16a34a] group-hover:text-white transition-all transform group-hover:scale-110">
            <span className="material-symbols-outlined text-2xl">add</span>
          </div>
          <p className="font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white text-lg">Adicionar Nova Meta</p>
        </button>
      </div>

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAddGoalModal(false)}
          ></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#1c271c] rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 dark:bg-[#152015] px-6 py-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#16a34a]">flag</span>
                Nova Meta
              </h3>
              <button
                onClick={() => setShowAddGoalModal(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome da Meta</span>
                <input
                  type="text"
                  placeholder="Ex: Supino 100kg"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Categoria</span>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a] outline-none appearance-none">
                    <option>Força</option>
                    <option>Cardio</option>
                    <option>Estética</option>
                    <option>Habilidade</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Prazo</span>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a] outline-none appearance-none">
                    <option>Curto Prazo</option>
                    <option>Longo Prazo</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Alvo</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Unidade</span>
                  <input
                    type="text"
                    placeholder="kg, km..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </label>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setShowAddGoalModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 dark:bg-[#0a160a] hover:bg-slate-200 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    alert('Meta criada com sucesso!');
                    setShowAddGoalModal(false);
                  }}
                  className="flex-1 py-3 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all transform active:scale-[0.98]"
                >
                  Criar Meta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Goals;