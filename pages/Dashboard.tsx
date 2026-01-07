import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

// ... imports

// ... inside Component

{/* Stats */ }
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card className="flex flex-col">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
        <span className="material-symbols-outlined">timer</span>
      </div>
      <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/20 text-green-500">
        {userStats.totalWorkouts > 0 ? '+12%' : 'Novo'}
      </span>
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
      <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/20 text-green-500">
        {userStats.totalWorkouts > 0 ? '+5%' : 'Novo'}
      </span>
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
      <span className="text-xs font-medium px-2 py-1 rounded bg-slate-500/20 text-slate-500">
        {userStats.totalVolume > 0 ? '0%' : 'Novo'}
      </span>
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

{/* Chart Section */ }
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
        <div className="w-full h-full flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      }>
        <WorkoutVolumeChart />
      </Suspense>
    </div>
  </Card>

  {/* ... */}

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
      ) : personalRecords.length > 0 ? personalRecords.map((record, i, arr) => (
        <div key={record.label} className={`flex items-center justify-between ${i !== arr.length - 1 ? 'border-b border-border-light dark:border-border-dark pb-2' : ''}`}>
          <span className="text-slate-500 dark:text-slate-400 text-sm">{record.label}</span>
          <span className="text-slate-900 dark:text-white font-bold text-sm">{record.value}</span>
        </div>
      )) : (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">emoji_events</span>
          <p className="text-sm">Comece seus treinos para ver seus recordes aqui!</p>
        </div>
      )}
    </div>
  </Card>
</div>
      </div >

  {/* Workout History Section */ }
  < Card className = "!p-0 shadow-sm overflow-hidden" >
    {/* ... header ... */ }
    < div className = "divide-y divide-border-light dark:divide-border-dark text-slate-900 dark:text-white" >
    {
      loading?(
            <div className = "p-6 space-y-4" >
               <Skeleton className="h-16 w-full rounded-xl" />
               <Skeleton className="h-16 w-full rounded-xl" />
               <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : recentSessions.length > 0 ? recentSessions.map((session) => (
        // ... session item ...
        <div
          key={session.title + session.time}
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
      )) : (
  <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
    <span className="material-symbols-outlined text-4xl mb-2 block">history</span>
    <p className="text-sm">Nenhum treino registrado ainda.</p>
    <p className="text-xs mt-1">Comece seu primeiro treino para ver o histórico aqui!</p>
  </div>
)}
        </div >
      </Card >
    </div >
  );
};

export default Dashboard;
