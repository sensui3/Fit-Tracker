import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from './ui/Button';
import { OptimizedImage } from './ui/OptimizedImage';

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '', onItemClick }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();


  const handleLogout = async () => {
    await logout();
    if (onItemClick) onItemClick();
  };

  const navItems = [
    { icon: 'dashboard', label: 'Painel', path: '/' },
    { icon: 'fitness_center', label: 'Treinos', path: '/workouts' },
    { icon: 'flag', label: 'Metas', path: '/goals' },
    { icon: 'assignment', label: 'Criar Treino', path: '/create-plan' },
    { icon: 'bar_chart', label: 'Relatórios', path: '/reports' },
    { icon: 'menu_book', label: 'Exercícios', path: '/exercises' },
  ];

  const systemItems = [
    { icon: 'notifications', label: 'Notificações', path: '/notifications', count: 3 },
    { icon: 'person', label: 'Perfil', path: '/profile' },
    { icon: 'settings', label: 'Configurações', path: '/settings' },
  ];

  return (
    <aside
      role="navigation"
      aria-label="Menu Principal"
      className={`flex flex-col w-64 h-screen bg-surface-light dark:bg-surface-darker border-r border-border-light dark:border-border-dark shrink-0 transition-colors duration-200 z-20 ${className}`}
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-6 gap-3 shrink-0">
        <div className="size-10 rounded-xl bg-gradient-to-br from-primary-DEFAULT to-green-600 dark:from-primary-neon dark:to-green-600 flex items-center justify-center shadow-lg shadow-primary-DEFAULT/20 text-white dark:text-black">
          <span className="material-symbols-outlined font-bold text-2xl" aria-hidden="true">fitness_center</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight leading-none text-slate-900 dark:text-white">FitTrack</h1>
          <p className="text-xs text-slate-500 dark:text-text-secondaryDark font-medium mt-1">Pro Dashboard</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 py-4 shrink-0">
        <Button
          onClick={() => {
            navigate('/log-workout');
            if (onItemClick) onItemClick();
          }}
          fullWidth
          aria-label="Registrar novo treino"
          className="group shadow-md transform hover:-translate-y-0.5"
          leftIcon={<span className="material-symbols-outlined font-semibold" aria-hidden="true">add_circle</span>}
        >
          <span className="font-bold text-sm tracking-wide">NOVO TREINO</span>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
        <div className="px-3 mb-2 mt-2">
          <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500" aria-hidden="true">Principal</span>
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            aria-label={item.label}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200
              ${isActive
                ? 'bg-primary-DEFAULT/10 dark:bg-primary-neon/10 text-primary-DEFAULT dark:text-primary-neon'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            <span className={`material-symbols-outlined ${item.icon === 'dashboard' ? 'fill-1' : ''}`} aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="my-4 h-px bg-slate-200 dark:bg-border-dark mx-3" role="separator"></div>

        <div className="px-3 mb-2">
          <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500" aria-hidden="true">Sistema</span>
        </div>

        {systemItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            aria-label={item.label}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 relative
              ${isActive
                ? 'bg-primary-DEFAULT/10 dark:bg-primary-neon/10 text-primary-DEFAULT dark:text-primary-neon'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.count && (
              <span className="bg-[#16a34a] text-[#102210] text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto" aria-label={`${item.count} notificações não lidas`}>
                {item.count}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="mt-auto p-4 border-t border-border-light dark:border-border-dark">
        <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group overflow-hidden">
          <div
            onClick={() => {
              navigate('/profile');
              if (onItemClick) onItemClick();
            }}
            className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
          >
            <OptimizedImage
              src={user?.image || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=120&h=120"}
              alt={`Foto de perfil de ${user?.name || 'usuário'}`}
              className="size-10 rounded-full shrink-0 ring-2 ring-white dark:ring-white/10 group-hover:ring-primary-DEFAULT transition-all"
            />
            <div className="flex flex-col flex-1 min-w-0 pr-1">
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-DEFAULT transition-colors">
                {user?.name || 'Usuário'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-tight">PLANO PRO</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
            aria-label="Encerrar sessão"
            className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
            title="Sair"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;