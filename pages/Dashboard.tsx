import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Lazy load heavy chart component
const WorkoutVolumeChart = lazy(() => import('../components/dashboard/WorkoutVolumeChart'));

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
        <Card className="flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
              <span className="material-symbols-outlined">timer</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/20 text-green-500">+12%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Tempo de Treino</p>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4h 32m</h4>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500">
              <span className="material-symbols-outlined">local_fire_department</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/20 text-green-500">+5%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Calorias Queimadas</p>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2,450 kcal</h4>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-[#16a34a]/10 text-[#16a34a] dark:text-[#13ec13]">
              <span className="material-symbols-outlined">fitness_center</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-slate-500/20 text-slate-500">0%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Volume Total</p>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12,500 kg</h4>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 !p-0 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Volume de Treino</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-[#16a34a] dark:text-[#13ec13] text-2xl font-bold">15,400kg</p>
              <p className="text-slate-500 text-sm">nos últimos 30 dias</p>
            </div>
          </div>
          <div className="h-[250px] w-full mt-4 min-w-0 px-4">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-lg animate-pulse">
                <span className="text-slate-400 text-sm">Carregando gráfico...</span>
              </div>
            }>
              <WorkoutVolumeChart />
            </Suspense>
          </div>
        </Card>

        {/* Quick Actions / Personal Best */}
        <div className="flex flex-col gap-4">
          <Card
            onClick={() => navigate('/timer')}
            className="p-6 bg-gradient-to-br from-green-50 to-white dark:from-surface-dark dark:to-surface-darker relative overflow-hidden group cursor-pointer shadow-sm border-none"
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <span className="material-symbols-outlined text-8xl text-[#16a34a] dark:text-[#13ec13]">timer</span>
            </div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold z-10 relative">Iniciar Cronômetro</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-4 z-10 relative">Comece um treino livre agora mesmo.</p>
            <Button variant="outline" size="sm" className="w-fit z-10">
              Iniciar
            </Button>
          </Card>

          <Card className="flex-1 shadow-sm">
            <h3 className="text-slate-900 dark:text-white text-base font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#16a34a] dark:text-[#13ec13] text-xl">emoji_events</span>
              Recordes Pessoais
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Supino Reto', value: '100kg' },
                { label: 'Agachamento', value: '140kg' },
                { label: 'Lev. Terra', value: '180kg' }
              ].map((record, i, arr) => (
                <div key={record.label} className={`flex items-center justify-between ${i !== arr.length - 1 ? 'border-b border-border-light dark:border-border-dark pb-2' : ''}`}>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{record.label}</span>
                  <span className="text-slate-900 dark:text-white font-bold text-sm">{record.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Workout History Section */}
      <Card className="!p-0 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#16a34a] dark:text-[#13ec13]">history</span>
            <h4 className="font-bold text-slate-900 dark:text-white">Histórico de Treinos</h4>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/workouts')} className="text-[#16a34a] dark:text-[#13ec13]">
            Ver todos
          </Button>
        </div>
        <div className="divide-y divide-border-light dark:divide-border-dark text-slate-900 dark:text-white">
          {[
            { title: 'Treino de Cardio', time: 'Hoje, 08:30', tag: 'HIIT', duration: '45 min', value: '350 kcal', icon: 'directions_run', color: 'blue' },
            { title: 'Superiores (Peito e Tríceps)', time: 'Ontem, 18:00', tag: 'Força', duration: '1h 10m', value: '8.500 kg', icon: 'fitness_center', color: 'orange' },
            { title: 'Inferiores (Agachamento Foco)', time: 'Seg, 19:30', tag: 'Hipertrofia', duration: '1h 30m', value: '12.200 kg', icon: 'accessibility_new', color: 'purple' }
          ].map((item) => (
            <div
              key={item.title}
              onClick={() => navigate('/log-workout')}
              className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`size-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400' :
                    item.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400' :
                      'bg-purple-50 dark:bg-purple-900/20 text-purple-500 dark:text-purple-400'
                  }`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.time}</p>
                    <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 rounded text-slate-500 dark:text-slate-400">{item.tag}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.duration}</span>
                <span className="text-xs text-slate-400">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;