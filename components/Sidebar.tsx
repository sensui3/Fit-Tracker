import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { icon: 'dashboard', label: 'Painel', path: '/' },
    { icon: 'fitness_center', label: 'Treinos', path: '/workouts' },
    { icon: 'flag', label: 'Metas', path: '/goals' },
    { icon: 'assignment', label: 'Planos', path: '/create-plan' },
    { icon: 'bar_chart', label: 'Relatórios', path: '/reports' },
    { icon: 'menu_book', label: 'Exercícios', path: '/exercise/1' }, 
  ];

  const systemItems = [
    { icon: 'notifications', label: 'Notificações', path: '/notifications', count: 3 },
    { icon: 'person', label: 'Perfil', path: '/profile' },
    { icon: 'settings', label: 'Configurações', path: '/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-surface-light dark:bg-surface-darker border-r border-border-light dark:border-border-dark shrink-0 transition-colors duration-200 z-20">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 gap-3 shrink-0">
        <div className="size-10 rounded-xl bg-gradient-to-br from-primary-DEFAULT to-green-600 dark:from-primary-neon dark:to-green-600 flex items-center justify-center shadow-lg shadow-primary-DEFAULT/20 text-white dark:text-black">
          <span className="material-symbols-outlined font-bold text-2xl">fitness_center</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight leading-none text-slate-900 dark:text-white">FitTrack</h1>
          <p className="text-xs text-slate-500 dark:text-text-secondaryDark font-medium mt-1">Pro Dashboard</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 py-4 shrink-0">
        <button 
          onClick={() => navigate('/log-workout')}
          className="group w-full flex items-center justify-center gap-3 bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#13ec13] dark:hover:bg-[#0fd60f] text-white dark:text-black h-12 rounded-xl transition-all duration-200 shadow-md transform hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined font-semibold">add_circle</span>
          <span className="font-bold text-sm tracking-wide">NOVO TREINO</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
        <div className="px-3 mb-2 mt-2">
          <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">Principal</span>
        </div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200
              ${isActive 
                ? 'bg-primary-DEFAULT/10 dark:bg-primary-neon/10 text-primary-DEFAULT dark:text-primary-neon' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            <span className={`material-symbols-outlined ${item.icon === 'dashboard' ? 'fill-1' : ''}`}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="my-4 h-px bg-slate-200 dark:bg-border-dark mx-3"></div>

        <div className="px-3 mb-2">
          <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">Sistema</span>
        </div>

        {systemItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 relative
              ${isActive 
                ? 'bg-primary-DEFAULT/10 dark:bg-primary-neon/10 text-primary-DEFAULT dark:text-primary-neon' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.count && (
               <span className="bg-[#16a34a] text-[#102210] text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                 {item.count}
               </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-border-light dark:border-border-dark bg-slate-50 dark:bg-black/20">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-white/5 cursor-pointer transition-colors group">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzah6RHgTQs1E5A-ZbDUGXw5szSloOWeof78uX7bOMTCDcMX3ouYvjDr8iK5NZePv2VXkX3ePZ9-CrG5xjSMwfCfiR2VeqkZh2OGoIgR1E0j1GRT8klfwV42hlnHPibND0arPqA53BPA_x1IHE9H7fbCQ8m9VpaGWLupYxtDcohh6sSYWKvLvt1Oc2J-JkGLpn4xw54fql6O0mx8YiDV2hjQl6zXa0INlNzCyF4UyGL3sAveZv1tWmGPdDW80b9noy9cZEAhhgBa4" 
            alt="User Avatar"
            className="size-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary-DEFAULT/50 dark:group-hover:ring-primary-neon/50 transition-all"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">João Silva</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">Plano Pro • Ativo</span>
          </div>
          <button onClick={handleLogout} className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Sair">
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;