import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { useUIStore } from '../stores/useUIStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Theme } from '../types';
import { dbService } from '../services/databaseService';

// Lazy load heavy chart component
const WorkoutVolumeChart = lazy(() => import('../components/dashboard/WorkoutVolumeChart'));

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useUIStore();
  const { user } = useAuthStore();

  // Queries otimizadas com React Query (Cache + Validations)
  const { data: rawStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: () => dbService.getDashboardStats(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10,
  });

  const { data: rawRecentSessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['dashboard-recent-workouts', user?.id],
    queryFn: () => dbService.getRecentWorkouts(user!.id, 5),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const { data: rawRecords, isLoading: isLoadingRecords } = useQuery({
    queryKey: ['dashboard-records', user?.id],
    queryFn: () => dbService.getPersonalRecords(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60 * 24,
  });

  // Transformação de dados
  const userStats = {
    totalWorkouts: parseInt(rawStats?.total_workouts || '0'),
    totalVolume: parseFloat(rawStats?.total_volume || '0'),
    avgSessionTime: Math.round((parseFloat(rawStats?.avg_duration || '0') / 60)),
  };

  const recentSessions = rawRecentSessions?.map((session: any) => ({
    id: session.id,
    title: session.plan_name || 'Treino Livre',
    time: new Date(session.start_time).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }),
    tag: session.plan_name ? 'Planejado' : 'Livre',
    duration: `${Math.round(parseFloat(session.duration_minutes || '0'))} min`,
    value: `${session.total_volume} kg`,
    icon: session.plan_name ? 'fitness_center' : 'directions_run',
    color: session.plan_name ? 'orange' : 'blue'
  })) || [];

  const personalRecords = rawRecords?.map((record: any) => ({
    label: record.name,
    value: `${record.max_weight}kg`
  })) || [];

  const loading = isLoadingStats || isLoadingSessions || isLoadingRecords;

  const toggleTheme = () => {
    setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
            Bem-vindo de volta, {user?.name?.split(' ')[0] || 'Usuário'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {loading ? (
              <Skeleton className="h-4 w-64 mt-2" />
            ) : userStats.totalWorkouts > 0 ? (
              `Você realizou ${userStats.totalWorkouts} treinos. Continue assim!`
            ) : (
              'Comece seus treinos e veja suas estatísticas aqui.'
            )}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-[#16a34a] dark:hover:text-[#13ec13] transition-all duration-300 border border-transparent hover:border-primary-DEFAULT/20"
            title={theme === Theme.Dark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            <span className="material-symbols-outlined text-2xl">
              {theme === Theme.Dark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-[#16a34a] dark:hover:text-[#13ec13] transition-all duration-300 border border-transparent hover:border-primary-DEFAULT/20"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
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
            {!loading && userStats.totalWorkouts > 0 && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/20 text-green-500">
                +12%
              </span>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Tempo Médio</p>
          {loading ? (
            <Skeleton className="h-8 w-32 mt-1" />
          ) : (
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {userStats.avgSessionTime > 0
                ? `${Math.floor(userStats.avgSessionTime / 60)}h ${userStats.avgSessionTime % 60}m`
                : '--'
              }
            </h4>
          )}
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500">
              <span className="material-symbols-outlined">directions_run</span>
            </div>
            {!loading && userStats.totalWorkouts > 0 && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/20 text-green-500">
                +5%
              </span>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total de Treinos</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {userStats.totalWorkouts}
            </h4>
          )}
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-[#16a34a]/10 text-[#16a34a] dark:text-[#13ec13]">
              <span className="material-symbols-outlined">fitness_center</span>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Volume Total</p>
          {loading ? (
            <Skeleton className="h-8 w-40 mt-1" />
          ) : (
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {userStats.totalVolume > 0 ? `${userStats.totalVolume.toLocaleString()} kg` : '--'}
            </h4>
          )}
        </Card>
      </div>

      {/* Chart & Records Section */}
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
            <Suspense fallback={<Skeleton className="w-full h-full" />}>
              <WorkoutVolumeChart />
            </Suspense>
          </div>
        </Card>

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
            <Button
              variant="primary"
              size="md"
              className="w-fit z-10 !bg-[#16a34a] !text-white hover:!bg-[#15803d] shadow-xl shadow-green-600/30 px-10"
            >
              Iniciar
            </Button>
          </Card>

          <Card className="flex-1 shadow-sm">
            <h3 className="text-slate-900 dark:text-white text-base font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#16a34a] dark:text-[#13ec13] text-xl">emoji_events</span>
              Recordes Pessoais
            </h3>
            <div className="flex flex-col gap-3">
              {loading ? (
                <>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </>
              ) : personalRecords.length > 0 ? (
                personalRecords.map((record, i, arr) => (
                  <div key={record.label} className={`flex items-center justify-between ${i !== arr.length - 1 ? 'border-b border-border-light dark:border-border-dark pb-2' : ''}`}>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">{record.label}</span>
                    <span className="text-slate-900 dark:text-white font-bold text-sm">{record.value}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 block">emoji_events</span>
                  <p className="text-sm">Comece seus treinos para ver seus recordes aqui!</p>
                </div>
              )}
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
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : recentSessions.length > 0 ? (
            recentSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => navigate('/log-workout')}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`size-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${session.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400' :
                      session.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400' :
                        'bg-purple-50 dark:bg-purple-900/20 text-purple-500 dark:text-purple-400'
                    }`}>
                    <span className="material-symbols-outlined">{session.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{session.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{session.time}</p>
                      <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 rounded text-slate-500 dark:text-slate-400">{session.tag}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{session.duration}</span>
                  <span className="text-xs text-slate-400">{session.value}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 block">history</span>
              <p className="text-sm">Nenhum treino registrado ainda.</p>
              <p className="text-xs mt-1">Comece seu primeiro treino para ver o histórico aqui!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
