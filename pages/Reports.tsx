import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { dbService } from '../services/databaseService';

// Dados simulados para diferentes períodos (Gráfico de Área)
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
  quarter: [
    { name: 'Sem 1', val: 32000 }, { name: 'Sem 2', val: 35000 },
    { name: 'Sem 3', val: 28000 }, { name: 'Sem 4', val: 38000 },
    { name: 'Sem 5', val: 42000 }, { name: 'Sem 6', val: 45000 },
    { name: 'Sem 7', val: 41000 }, { name: 'Sem 8', val: 48000 },
    { name: 'Sem 9', val: 52000 }, { name: 'Sem 10', val: 55000 },
    { name: 'Sem 11', val: 51000 }, { name: 'Sem 12', val: 59000 },
  ],
  semester: [
    { name: 'Mês 1', val: 140000 },
    { name: 'Mês 2', val: 155000 },
    { name: 'Mês 3', val: 138000 },
    { name: 'Mês 4', val: 162000 },
    { name: 'Mês 5', val: 175000 },
    { name: 'Mês 6', val: 180000 },
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

// Dados simulados para o gráfico de progresso (Linha)
const PROGRESS_MOCK_DATA = {
  week: [
    { name: 'Seg', real: 60, meta: 65 },
    { name: 'Ter', real: 65, meta: 65 },
    { name: 'Qua', real: 55, meta: 68 },
    { name: 'Qui', real: 70, meta: 68 },
    { name: 'Sex', real: 72, meta: 70 },
    { name: 'Sab', real: 75, meta: 70 },
    { name: 'Dom', real: 40, meta: 40 },
  ],
  month: [
    { name: 'Sem 1', real: 65, meta: 70 },
    { name: 'Sem 2', real: 68, meta: 72 },
    { name: 'Sem 3', real: 75, meta: 74 },
    { name: 'Sem 4', real: 79, meta: 76 },
    { name: 'Sem 5', real: 85, meta: 80 },
  ],
  year: [
    { name: 'Jan', real: 60, meta: 65 },
    { name: 'Fev', real: 62, meta: 66 },
    { name: 'Mar', real: 65, meta: 68 },
    { name: 'Abr', real: 68, meta: 70 },
    { name: 'Mai', real: 70, meta: 72 },
    { name: 'Jun', real: 74, meta: 75 },
    { name: 'Jul', real: 72, meta: 76 },
    { name: 'Ago', real: 78, meta: 78 },
    { name: 'Set', real: 80, meta: 80 },
    { name: 'Out', real: 82, meta: 82 },
    { name: 'Nov', real: 85, meta: 84 },
    { name: 'Dez', real: 88, meta: 85 },
  ]
};

type PeriodType = 'week' | 'month' | 'quarter' | 'semester' | 'year';
type ProgressPeriodType = 'week' | 'month' | 'year';
type ExerciseType = 'all' | 'strength' | 'cardio' | 'flexibility';

// Custom Tooltip Component para o gráfico de linha (Enhanced)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Encontrar os valores específicos baseados na dataKey
    const realEntry = payload.find((p: any) => p.dataKey === 'real');
    const metaEntry = payload.find((p: any) => p.dataKey === 'meta');

    const realVal = realEntry ? realEntry.value : 0;
    const metaVal = metaEntry ? metaEntry.value : 0;

    const diff = realVal - metaVal;
    const isPositive = diff >= 0;

    return (
      <div className="bg-white dark:bg-[#1c271c] border border-slate-200 dark:border-[#283928] p-4 rounded-xl shadow-xl backdrop-blur-md bg-opacity-95 dark:bg-opacity-95 min-w-[200px]">
        <p className="text-slate-500 dark:text-slate-400 font-bold mb-4 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-white/5 pb-2">{label}</p>

        <div className="flex flex-col gap-4">
          {/* Comparação Visual */}
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#16a34a]"></div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Realizado</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{realVal}%</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Meta</p>
              </div>
              <span className="text-xl font-bold text-slate-400 dark:text-slate-500">{metaVal}%</span>
            </div>
          </div>

          {/* Badge de Delta */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isPositive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
            <span className="material-symbols-outlined text-lg">
              {isPositive ? 'trending_up' : 'trending_down'}
            </span>
            <span className="text-xs font-bold leading-tight">
              {Math.abs(diff)}% {isPositive ? 'acima' : 'abaixo'} do planejado
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Dados simulados para a tabela de histórico
// Dados de exemplo para quando não houver histórico
const EXAMPLE_HISTORY_ITEM = {
  id: 'example-1',
  date: 'Hoje',
  time: '10:30 AM',
  exercise: 'Supino Reto (Exemplo)',
  sets: 4,
  reps: '8-12',
  maxLoad: '80kg',
  status: 'Concluído',
  isExample: true
};

const Reports: React.FC = () => {

  const { user } = useAuth();
  const navigate = useNavigate();
  // Estado para o gráfico principal (Área)
  const [period, setPeriod] = useState<PeriodType>('month');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('all');

  // Estado para o gráfico de progresso (Linha)
  const [progressPeriod, setProgressPeriod] = useState<ProgressPeriodType>('month');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const mainChartRef = useRef<HTMLDivElement>(null);
  const progressChartRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Estado para dados do banco
  const [dbWorkouts, setDbWorkouts] = useState<any[]>([]);
  const [dbHistory, setDbHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load workout data from database
  useEffect(() => {
    const loadReportsData = async () => {
      if (!user) return;
      try {
        // Load workout sessions for history table
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
          LIMIT 10
        `;

        const mappedHistory = historyData.map((item: any) => ({
          id: item.id,
          date: item.start_time ? new Date(item.start_time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'Hoje',
          time: item.start_time ? new Date(item.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '10:30 AM',
          exercise: item.plan_name || 'Treino Personalizado',
          sets: 4,
          reps: '8-12',
          maxLoad: `${item.total_volume}kg`,
          status: item.end_time ? 'Concluído' : 'Incompleto',
          isExample: false
        }));

        if (mappedHistory.length > 0) {
          setDbHistory(mappedHistory);
        } else {
          setDbHistory([EXAMPLE_HISTORY_ITEM]);
        }
      } catch (error) {
        console.error('Erro ao carregar dados dos relatórios:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportsData();
  }, [user]);

  // Fechar menu ao clicar fora
  React.useEffect(() => {
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

    // Título do PDF
    doc.setFontSize(20);
    doc.text('Relatório de Evolução - FitTrack Pro', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

    // Tabela de Histórico
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
      headStyles: { fillColor: [22, 163, 74] }, // Verde FitTrack
      margin: { top: 40 },
    });

    doc.save(`relatorio_treino_${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportOptions(false);
  };

  // Lógica para filtrar/transformar os dados do gráfico de Área
  const chartData = useMemo(() => {
    let data = [...MOCK_DATA[period]];

    if (exerciseType === 'cardio') {
      data = data.map(d => ({ ...d, val: Math.round(d.val * 0.4) }));
    } else if (exerciseType === 'strength') {
      data = data.map(d => ({ ...d, val: Math.round(d.val * 0.9) }));
    } else if (exerciseType === 'flexibility') {
      data = data.map(d => ({ ...d, val: Math.round(d.val * 0.1) }));
    }

    return data;
  }, [period, exerciseType]);

  // Lógica para filtrar os dados do gráfico de Linha (Progresso)
  const currentProgressData = useMemo(() => {
    return PROGRESS_MOCK_DATA[progressPeriod];
  }, [progressPeriod]);

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
          <div className="bg-slate-200 dark:bg-surface-dark p-1 rounded-lg flex items-center overflow-x-auto max-w-full">
            <button
              onClick={() => handlePeriodChange('week')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${period === 'week' ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
            >
              Semana
            </button>
            <button
              onClick={() => handlePeriodChange('month')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${period === 'month' ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
            >
              Mês
            </button>
            <button
              onClick={() => handlePeriodChange('quarter')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${period === 'quarter' ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
            >
              Trimestre
            </button>
            <button
              onClick={() => handlePeriodChange('semester')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${period === 'semester' ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
            >
              Semestre
            </button>
            <button
              onClick={() => handlePeriodChange('year')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${period === 'year' ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
            >
              Ano
            </button>
          </div>

          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-5 py-2 rounded-lg transition-all shadow-lg shadow-green-600/20 font-bold h-[38px]"
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
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {period === 'week' ? '4' : period === 'month' ? '18' : period === 'quarter' ? '48' : period === 'semester' ? '92' : '142'}
            </p>
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
              {exerciseType === 'cardio' ? '2.4k' : (period === 'week' ? '12k' : period === 'month' ? '45k' : period === 'quarter' ? '125k' : period === 'semester' ? '280k' : '520k')}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-24">
        {/* Main Chart (Area) */}
        <div ref={mainChartRef} className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8 scroll-mt-32">
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
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#283928" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} interval={period === 'year' || period === 'quarter' ? 1 : 0} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
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
        <div ref={progressChartRef} className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8 scroll-mt-32">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tendência de Progresso</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Intensidade Real vs Meta</p>
            </div>

            {/* Filtros para o gráfico de progresso */}
            <div className="bg-slate-100 dark:bg-black/20 p-1 rounded-lg flex items-center">
              <button
                onClick={() => handleProgressPeriodChange('week')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${progressPeriod === 'week' ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
              >
                Sem
              </button>
              <button
                onClick={() => handleProgressPeriodChange('month')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${progressPeriod === 'month' ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
              >
                Mês
              </button>
              <button
                onClick={() => handleProgressPeriodChange('year')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${progressPeriod === 'year' ? 'bg-white dark:bg-[#16a34a] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white'}`}
              >
                Ano
              </button>
            </div>
          </div>

          <div className="w-full h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#283928" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} interval={progressPeriod === 'year' ? 1 : 0} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
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
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {item.exercise}
                          {item.isExample && (
                            <span className="ml-2 text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                              Exemplo
                            </span>
                          )}
                        </span>
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
        </div>
      </div>
    </div>
  );
};

export default Reports;
