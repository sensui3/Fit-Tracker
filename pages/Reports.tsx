import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { dbService } from '../services/databaseService';

type PeriodType = 'week' | 'month' | 'quarter' | 'semester' | 'year';
type ProgressPeriodType = 'week' | 'month' | 'year';
type ExerciseType = 'all' | 'strength' | 'cardio' | 'flexibility';

// Custom Tooltip Component para o gráfico de linha (Enhanced)
const Reports: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<PeriodType>('month');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('all');
  const [progressPeriod, setProgressPeriod] = useState<ProgressPeriodType>('month');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const mainChartRef = useRef<HTMLDivElement>(null);
  const progressChartRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const [dbHistory, setDbHistory] = useState<any[]>([]);
  const [dbStats, setDbStats] = useState({ totalWorkouts: 0, totalVolume: 0, avgDuration: 0 });

  // Load report data from database
  useEffect(() => {
    const loadReportsData = async () => {
      if (!user) return;
      try {
        // Load sessions
        const historyData = await dbService.query`
          SELECT
            ws.id,
            ws.start_time,
            ws.end_time,
            ws.total_volume,
            ws.notes,
            tp.name as plan_name
          FROM workout_sessions ws
          LEFT JOIN training_plans tp ON tp.id = ws.plan_id
          WHERE ws.user_id = ${user.id}
          ORDER BY ws.start_time DESC
          LIMIT 20
        `;

        const mappedHistory = historyData.map((item: any) => ({
          id: item.id,
          date: item.start_time ? new Date(item.start_time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'Hoje',
          time: item.start_time ? new Date(item.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
          exercise: item.plan_name || 'Treino Livre',
          sets: '-', // We would need more queries for sets/reps in a real app, keeping it simple for now
          reps: '-',
          maxLoad: `${item.total_volume}kg`,
          status: item.end_time ? 'Concluído' : 'Incompleto',
          isExample: false
        }));

        setDbHistory(mappedHistory);

        // Load summary stats
        const statsData = await dbService.query`
          SELECT
            COUNT(id) as total_workouts,
            COALESCE(SUM(total_volume), 0) as total_volume,
            COALESCE(AVG(EXTRACT(EPOCH FROM (end_time - start_time))), 0) as avg_duration
          FROM workout_sessions
          WHERE user_id = ${user.id} AND end_time IS NOT NULL
        `;

        if (statsData[0]) {
          setDbStats({
            totalWorkouts: parseInt(statsData[0].total_workouts || '0'),
            totalVolume: parseFloat(statsData[0].total_volume || '0'),
            avgDuration: Math.round(parseFloat(statsData[0].avg_duration || '0') / 60)
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados dos relatórios:', error);
      }
    };

    loadReportsData();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportToCSV = () => {
    const headers = ['Data', 'Exercício', 'Séries', 'Repetições', 'Carga Máx', 'Status'];
    const rows = dbHistory.map(item => [
      item.date,
      item.exercise,
      item.sets,
      item.reps,
      item.maxLoad,
      item.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_treino_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportOptions(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Relatório de Evolução - FitTrack Pro', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Data', 'Exercício', 'Séries', 'Reps', 'Carga', 'Status']],
      body: dbHistory.map(item => [
        `${item.date} (${item.time})`,
        item.exercise,
        item.sets,
        item.reps,
        item.maxLoad,
        item.status
      ]),
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] },
      margin: { top: 40 },
    });

    doc.save(`relatorio_treino_${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportOptions(false);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'week': return 'Últimos 7 dias';
      case 'month': return 'Últimos 30 dias';
      case 'quarter': return 'Últimos 3 meses';
      case 'semester': return 'Últimos 6 meses';
      case 'year': return 'Este Ano';
      default: return '';
    }
  };

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    setTimeout(() => {
      mainChartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  const handleProgressPeriodChange = (newPeriod: ProgressPeriodType) => {
    setProgressPeriod(newPeriod);
    setTimeout(() => {
      progressChartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
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

          <div className="bg-slate-200 dark:bg-surface-dark p-1 rounded-lg flex items-center overflow-x-auto max-w-full">
            {(['week', 'month', 'quarter', 'semester', 'year'] as PeriodType[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${period === p ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
              >
                {p === 'week' ? 'Semana' : p === 'month' ? 'Mês' : p === 'quarter' ? 'Trimestre' : p === 'semester' ? 'Semestre' : 'Ano'}
              </button>
            ))}
          </div>

          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              disabled={dbHistory.length === 0}
              className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg transition-all shadow-lg shadow-green-600/20 font-bold h-[38px]"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>Exportar</span>
            </button>

            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 flex flex-col gap-1">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors w-full text-left"
                  >
                    <span className="material-symbols-outlined text-green-600">table_view</span>
                    Planilha (CSV)
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors w-full text-left"
                  >
                    <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                    Documento (PDF)
                  </button>
                </div>
              </div>
            )}
          </div>
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
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{dbStats.totalWorkouts}</p>
          </div>
          <p className="text-xs text-slate-400 mt-1">Total acumulado</p>
        </div>

        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col gap-2 group hover:border-primary-DEFAULT/50 transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Volume Acumulado</p>
            <span className="material-symbols-outlined text-primary-DEFAULT bg-primary-DEFAULT/10 p-1.5 rounded-md">weight</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {dbStats.totalVolume.toLocaleString()}
              <span className="text-lg text-slate-500 ml-1">kg</span>
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-1">Total levantado</p>
        </div>

        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col gap-2 group hover:border-primary-DEFAULT/50 transition-colors">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Duração Média</p>
            <span className="material-symbols-outlined text-primary-DEFAULT bg-primary-DEFAULT/10 p-1.5 rounded-md">timer</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{dbStats.avgDuration}<span className="text-lg text-slate-500 ml-1">min</span></p>
          </div>
          <p className="text-xs text-slate-400 mt-1">Por sessão</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-24">
        {/* Main Chart (Area) - Show Empty State if no data */}
        <div ref={mainChartRef} className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8 scroll-mt-32 min-h-[400px] flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Volume de Treino</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{exerciseType === 'all' ? 'Geral' : exerciseType} • {getPeriodLabel()}</p>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[250px] relative">
            {dbStats.totalWorkouts > 0 ? (
              /* Graph would go here with real series data */
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
                <span className="material-symbols-outlined text-5xl">bar_chart</span>
                <p>Dados suficientes para gerar gráfico em breve.</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
                <span className="material-symbols-outlined text-5xl">monitoring</span>
                <p>Nenhum dado disponível para o período selecionado.</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Trend Chart (Line) - Show Empty State */}
        <div ref={progressChartRef} className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8 scroll-mt-32 min-h-[400px] flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tendência de Progresso</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Intensidade Real vs Meta</p>
            </div>

            <div className="bg-slate-100 dark:bg-black/20 p-1 rounded-lg flex items-center">
              {(['week', 'month', 'year'] as ProgressPeriodType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handleProgressPeriodChange(p)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${progressPeriod === p ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
                >
                  {p === 'week' ? 'Sem' : p === 'month' ? 'Mês' : 'Ano'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full min-h-[250px] relative">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
              <span className="material-symbols-outlined text-5xl">show_chart</span>
              <p>Registre seus treinos para visualizar sua evolução.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Histórico Detalhado</h3>
          <button onClick={() => navigate('/workouts')} className="text-sm text-primary-DEFAULT hover:text-primary-hover font-medium hover:underline">Ver tudo</button>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden min-h-[200px] flex flex-col">
          {dbHistory.length > 0 ? (
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
                  {dbHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{item.date}</span>
                          <span className="text-xs text-slate-500">{item.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-DEFAULT/20 flex items-center justify-center text-primary-DEFAULT">
                            <span className="material-symbols-outlined text-[18px]">fitness_center</span>
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.exercise}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-300">{item.sets}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-300">{item.reps}</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">{item.maxLoad}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Concluído'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-2">history_toggle_off</span>
              <p className="font-bold">Histórico limpo</p>
              <p className="text-sm">Os treinos registrados aparecerão aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
