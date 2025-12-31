import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('todas');

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 lg:p-10 max-w-5xl mx-auto flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Notificações</h1>
              <p className="text-slate-500 dark:text-text-secondary text-base md:text-lg">
                Fique por dentro das suas atividades e novidades da comunidade.
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-bold text-sm">
              <span className="material-symbols-outlined text-lg">done_all</span>
              Marcar todas como lidas
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 dark:border-border-dark">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {['todas', 'menções', 'sistema', 'amigos'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex flex-col items-center justify-center pb-3 pt-2 min-w-[60px] relative capitalize text-sm font-bold tracking-wide transition-colors ${
                    activeTab === tab 
                      ? 'text-slate-900 dark:text-white' 
                      : 'text-slate-500 dark:text-text-secondary hover:text-slate-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 w-full h-[3px] bg-[#16a34a] rounded-t-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex flex-col gap-4">
            
            {/* Group: Hoje */}
            <p className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider mt-2 pl-1">Hoje</p>
            
            {/* Item 1: Achievement */}
            <div className="group flex flex-col sm:flex-row gap-4 bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark hover:border-[#16a34a] dark:hover:border-[#16a34a] transition-all relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#16a34a]"></div>
              <div className="flex items-start gap-4 flex-1">
                <div className="flex items-center justify-center rounded-xl bg-[#16a34a]/10 text-[#16a34a] shrink-0 size-12 shadow-sm">
                  <span className="material-symbols-outlined filled">emoji_events</span>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex justify-between items-start w-full">
                    <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">Novo Recorde Pessoal!</p>
                    <span className="text-[#16a34a] text-[10px] font-bold bg-[#16a34a]/10 px-2 py-0.5 rounded-full ml-2 shrink-0">NOVO</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-normal">
                    Parabéns! Você superou seu limite no <span className="font-bold text-slate-900 dark:text-white">Supino Reto</span> atingindo <span className="font-bold text-slate-900 dark:text-white">100kg</span>.
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-slate-400 dark:text-text-secondary text-xs font-medium">2 horas atrás</span>
                    <button className="text-xs font-bold text-[#16a34a] hover:underline transition-colors">Ver Detalhes</button>
                  </div>
                </div>
              </div>
              <button className="absolute top-4 right-4 sm:static sm:flex items-center justify-center text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Item 2: Reminder */}
            <div className="group flex flex-col sm:flex-row gap-4 bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark hover:border-blue-500 dark:hover:border-blue-500 transition-all relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div className="flex items-start gap-4 flex-1">
                <div className="flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 shrink-0 size-12 shadow-sm">
                  <span className="material-symbols-outlined">fitness_center</span>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">Hora de treinar!</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-normal">
                    Você tem um treino de <span className="font-bold text-slate-900 dark:text-white">Pernas e Ombros</span> agendado para hoje às 18:00.
                  </p>
                  <p className="text-slate-400 dark:text-text-secondary text-xs font-medium mt-1">4 horas atrás</p>
                </div>
              </div>
              <button className="absolute top-4 right-4 sm:static sm:flex items-center justify-center text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Item 3: Social Mention */}
            <div className="group flex flex-col sm:flex-row gap-4 bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark hover:border-[#16a34a] dark:hover:border-[#16a34a] transition-all relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#16a34a]"></div>
              <div className="flex items-start gap-4 flex-1">
                <div className="rounded-xl size-12 shrink-0 bg-cover bg-center shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_0MLLijd8lFQqWqGG-wAKMlUkLEFEhBzsmyyrX4zkiS8VVaYO7arQ6cArhALjxoNjslLg0zfLsiW2OlJgpgxR4hPqh-2VKnxIxrOXvNWLJO9ysKixRPMnvs3dbz9gpLoyAXoiorZWVOSRMDRk6O2_83doVBq3ANcY3Rs0mfeO679T4aqhtEQ2TRB3eAEzQh8MSlgIdCxMiquTpJuYDlOQ1JC5jmUCVbsA0JiEUoQ9QqvvXDtZvTGv177qVNnfRDVOmwGtp2u3zU0")' }}></div>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-tight">
                    <span className="font-bold">Julia Martins</span> mencionou você em um comentário.
                  </p>
                  <p className="text-slate-500 dark:text-text-secondary text-sm leading-normal italic">
                    "@Alexandre bora bater esse PR semana que vem! 💪"
                  </p>
                  <div className="flex gap-3 mt-2">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                      Responder
                    </button>
                    <span className="text-slate-400 dark:text-text-secondary text-xs font-medium self-center">5 horas atrás</span>
                  </div>
                </div>
              </div>
              <button className="absolute top-4 right-4 sm:static sm:flex items-center justify-center text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Group: Ontem */}
            <p className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider mt-6 pl-1">Ontem</p>

            {/* Item 4: System (Read) */}
            <div className="group flex flex-col sm:flex-row gap-4 bg-slate-50 dark:bg-surface-darker p-5 rounded-2xl border border-transparent hover:bg-white dark:hover:bg-surface-dark hover:shadow-sm hover:border-slate-200 dark:hover:border-border-dark transition-all">
              <div className="flex items-start gap-4 flex-1 opacity-75 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-center rounded-xl bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-slate-400 shrink-0 size-12">
                  <span className="material-symbols-outlined">update</span>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-tight">Atualização do Sistema v2.4</p>
                  <p className="text-slate-500 dark:text-text-secondary text-sm leading-normal">
                    Adicionamos novos exercícios de calistenia e corrigimos bugs no cronômetro.
                  </p>
                  <p className="text-slate-400 dark:text-slate-600 text-xs font-medium mt-1">Ontem às 14:30</p>
                </div>
              </div>
              <button className="absolute top-4 right-4 sm:static sm:flex items-center justify-center text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Item 5: Friend (Read) */}
            <div className="group flex flex-col sm:flex-row gap-4 bg-slate-50 dark:bg-surface-darker p-5 rounded-2xl border border-transparent hover:bg-white dark:hover:bg-surface-dark hover:shadow-sm hover:border-slate-200 dark:hover:border-border-dark transition-all">
              <div className="flex items-start gap-4 flex-1 opacity-75 group-hover:opacity-100 transition-opacity">
                <div className="rounded-xl size-12 shrink-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBr64kMWqL2B8Si9ehj5Mp8plqY2tYSDizSsHC_gG6_R8mxKTCvCXUY2TUCmGTzH2PkU6RexiKl5o5R7_M7XYkURrtYRKIbc21cgS54YAif5A5WUN0A1vm9Mr26DLpfhjPe1cqn01VJh_MKms3Dsj1k64ay9Rtq18hNL4P0FQ8jSFSSXycFR-jE-8uRkhRF7IFFs9YFwtLzrGdMPTV2BG2FD3ILREepwGfFDJTltFZqDB-udRSKX4QyrCQe9whox3gmKf-fU-cVfHs")' }}></div>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-tight">
                    <span className="font-bold">Roberto Carlos</span> começou a seguir você.
                  </p>
                  <p className="text-slate-500 dark:text-text-secondary text-sm leading-normal">Roberto treina na mesma academia que você.</p>
                  <div className="flex gap-3 mt-2">
                    <button className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity">
                      Seguir de volta
                    </button>
                    <span className="text-slate-400 dark:text-slate-600 text-xs font-medium self-center">Ontem às 09:15</span>
                  </div>
                </div>
              </div>
              <button className="absolute top-4 right-4 sm:static sm:flex items-center justify-center text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Empty State */}
            <div className="mt-8 mb-10 flex flex-col items-center justify-center text-center opacity-50">
              <div className="bg-slate-200 dark:bg-white/10 rounded-full p-4 mb-3">
                <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500">mark_email_read</span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Isso é tudo por enquanto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Widget (Desktop Only) */}
      <aside className="hidden xl:flex flex-col w-80 bg-white dark:bg-surface-dark border-l border-slate-200 dark:border-border-dark h-full shrink-0 p-6 overflow-y-auto">
        
        {/* Widget 1: Next Workout */}
        <h3 className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider mb-4">Próximo Treino</h3>
        <div className="bg-slate-50 dark:bg-surface-darker rounded-2xl p-5 mb-8 border border-slate-100 dark:border-transparent">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-white dark:bg-surface-dark text-slate-900 dark:text-white text-xs font-bold px-2 py-1 rounded shadow-sm border border-slate-100 dark:border-transparent">
              Hoje, 18:00
            </span>
            <span className="material-symbols-outlined text-slate-400">more_horiz</span>
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Pernas e Ombros</h4>
          <p className="text-sm text-slate-500 dark:text-text-secondary mb-4">60 min • Intensidade Alta</p>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-[#16a34a]"></div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Agachamento Livre</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-[#16a34a]"></div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Leg Press 45°</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-[#16a34a]/40"></div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">+ 5 exercícios</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/create-plan')}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Ver Detalhes
          </button>
        </div>

        {/* Widget 2: Active Friends */}
        <h3 className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider mb-4">Amigos Ativos</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCbBBLr7VLAoAsqVdXPGXq8V6BWXtwi1JcJKF5mmo0x_uyBQ40uyWLQdiZumyXif1eM59tfA70h0Aqtvy-XjkUPa5IXTMWfnOcff013OvV05lH_jndWcwYlZFfqJj4bEbrwA-O77YcwfrYzFIico5KcNgKxLsWNNWX3OmhvxCzkl7ZDqsVs-qom1QyUdqdhheP49Tsw6A3-7RVFlW1NT1N8vxVjcGQTb9faYWO3ViKxffgS9cGVjnyHsl0-BuWKNEkh62JvAGzXkjg")' }}></div>
                <div className="absolute bottom-0 right-0 size-2.5 bg-[#16a34a] border-2 border-white dark:border-surface-dark rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#16a34a] transition-colors">Carla Dias</p>
                <p className="text-xs text-slate-500 dark:text-text-secondary">Treinando Costas</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg group-hover:text-[#16a34a] transition-colors">chat_bubble</span>
          </div>
          
          <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDbXO0Zx3xBcQ8RNF03yhhX6Y0RYiWoZqQLn4BgCLX1C2tl6sNpxuprOikQF0tZU53hMHLK_hqhQAXtXRdeaSd4sGacJnAafCJ2XliqHvBKNZpcVhypIQLMmxkvMVDxe9MvUfUl1MRg9rOM9l8_T_v2qsnYENS2W9LZdQ8H5CHaSGNEyzIkuf7r_0g9V1A8pDRkfBiZoiJ-D5xi7g_5qmBKcuqT3Bf4SMcoNZTzZfoMhI2XbyvpAjPamFvzz-gy7baNM9lyehOLGaM")' }}></div>
                <div className="absolute bottom-0 right-0 size-2.5 bg-slate-400 border-2 border-white dark:border-surface-dark rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#16a34a] transition-colors">Marcos V.</p>
                <p className="text-xs text-slate-500 dark:text-text-secondary">Visto há 10 min</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Notifications;