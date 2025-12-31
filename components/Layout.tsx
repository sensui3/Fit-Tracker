import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display selection:bg-primary-DEFAULT dark:selection:bg-primary-neon selection:text-white dark:selection:text-black">
      <Sidebar />
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 h-full bg-surface-light dark:bg-surface-darker" onClick={e => e.stopPropagation()}>
             <Sidebar />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 bg-surface-light dark:bg-background-dark z-30 shrink-0">
          <div className="flex items-center gap-3">
             <div className="size-8 rounded-lg bg-gradient-to-br from-primary-DEFAULT to-green-600 dark:from-primary-neon flex items-center justify-center text-white dark:text-black">
              <span className="material-symbols-outlined text-lg">fitness_center</span>
            </div>
            <span className="font-bold text-lg">FitTrack</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;