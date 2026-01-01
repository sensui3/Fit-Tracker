import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../types';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display selection:bg-primary-DEFAULT dark:selection:bg-primary-neon selection:text-white dark:selection:text-black">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-surface-light dark:bg-surface-darker transition-transform duration-300 ease-out shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <Sidebar onItemClick={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 bg-surface-light dark:bg-background-dark z-30 shrink-0">
          <div className="flex items-center gap-3">
            <div onClick={() => navigate('/')} className="size-8 rounded-lg bg-gradient-to-br from-primary-DEFAULT to-green-600 dark:from-primary-neon flex items-center justify-center text-white dark:text-black cursor-pointer transform active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-lg">fitness_center</span>
            </div>
            <span className="font-bold text-lg tracking-tight select-none">FitTrack</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary-DEFAULT transition-colors rounded-xl"
              aria-label="Alternar tema"
            >
              <span className="material-symbols-outlined leading-none block">
                {theme === Theme.Dark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary-DEFAULT transition-colors rounded-xl relative"
              aria-label="Ver notificações"
            >
              <span className="material-symbols-outlined leading-none block">notifications</span>
              <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-surface-light dark:border-background-dark"></span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-primary-DEFAULT transition-colors rounded-xl ml-1"
              aria-label="Abrir menu"
            >
              <span className="material-symbols-outlined leading-none block">menu</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;