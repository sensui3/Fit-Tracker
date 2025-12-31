import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../types';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('general');

  // Mock states for other settings
  const [language, setLanguage] = useState('pt-BR');
  const [units, setUnits] = useState('metric');
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    newsletter: false,
    appSounds: true
  });
  const [publicProfile, setPublicProfile] = useState(false);

  const menuItems = [
    { id: 'general', icon: 'settings', label: 'Geral' },
    { id: 'notifications', icon: 'notifications', label: 'Notificações' },
    { id: 'privacy', icon: 'lock', label: 'Privacidade' },
    { id: 'account', icon: 'person', label: 'Conta' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header
      const headerOffset = 140; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      const scrollContainer = document.getElementById('settings-scroll-container');
      if (scrollContainer) {
          // Calculate relative position inside the scrollable container
          const containerTop = scrollContainer.getBoundingClientRect().top;
          const relativeTop = elementPosition - containerTop + scrollContainer.scrollTop - (headerOffset - 80); // Adjusting for the visual offset
          
          scrollContainer.scrollTo({
            top: relativeTop,
            behavior: "smooth"
          });
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-background-dark overflow-hidden">
      
      {/* Scrollable Main Container */}
      <div id="settings-scroll-container" className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-5xl mx-auto w-full">
            
            {/* Header Area */}
            <div className="px-4 md:px-8 pt-8 pb-6 bg-slate-50 dark:bg-background-dark">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Configurações</h1>
                <p className="text-slate-500 dark:text-text-secondary mt-1">Gerencie suas preferências e opções da conta.</p>
            </div>

            {/* Inline Menu (Sticky) */}
            <div className="sticky top-0 z-30 bg-slate-50/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-border-dark px-4 md:px-8 py-3 mb-6">
                <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                    {menuItems.map((item) => (
                        <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                            activeSection === item.id
                            ? 'bg-[#16a34a] text-white border-[#16a34a] shadow-md shadow-green-600/20'
                            : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border-slate-200 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        >
                        <span className={`material-symbols-outlined text-[18px] ${activeSection === item.id ? 'filled' : ''}`}>{item.icon}</span>
                        {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Sections */}
            <div className="px-4 md:px-8 pb-32 space-y-12">
            
            {/* General Section */}
            <section id="general" className="space-y-6 scroll-mt-32">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-border-dark">
                    <span className="material-symbols-outlined text-[#16a34a] text-2xl">settings</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Geral</h3>
                </div>
                
                <div className="grid gap-6">
                {/* Theme */}
                <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Tema da Interface</h4>
                    <p className="text-sm text-slate-500 dark:text-text-secondary">Selecione a aparência do aplicativo</p>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-black/20 p-1.5 rounded-xl self-start sm:self-auto">
                    {[
                        { value: Theme.Light, icon: 'light_mode', label: 'Claro' },
                        { value: Theme.Dark, icon: 'dark_mode', label: 'Escuro' },
                        { value: Theme.System, icon: 'contrast', label: 'Sistema' },
                    ].map((option) => (
                        <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            theme === option.value
                            ? 'bg-white dark:bg-[#1c271c] shadow-sm text-[#16a34a] dark:text-[#13ec13] ring-1 ring-black/5 dark:ring-white/5'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        >
                        <span className={`material-symbols-outlined text-[18px] ${theme === option.value ? 'filled' : ''}`}>{option.icon}</span>
                        {option.label}
                        </button>
                    ))}
                    </div>
                </div>

                {/* Language */}
                <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                    <div className="hidden sm:flex size-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined">translate</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Idioma</h4>
                        <p className="text-sm text-slate-500 dark:text-text-secondary">Idioma da interface</p>
                    </div>
                    </div>
                    <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm font-medium rounded-lg focus:ring-[#16a34a] focus:border-[#16a34a] block p-2.5 min-w-[140px]"
                    >
                    <option value="pt-BR">Português (BR)</option>
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    </select>
                </div>

                {/* Units */}
                <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm space-y-4">
                    <div className="flex items-center gap-4">
                    <div className="hidden sm:flex size-10 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                        <span className="material-symbols-outlined">straighten</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Unidades de Medida</h4>
                        <p className="text-sm text-slate-500 dark:text-text-secondary">Escolha o sistema de medidas padrão</p>
                    </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:pl-[56px]">
                    {[
                        { id: 'metric', label: 'Métrico (kg, cm, km)' },
                        { id: 'imperial', label: 'Imperial (lbs, in, mi)' }
                    ].map((item) => (
                        <label key={item.id} className="cursor-pointer relative group">
                        <input 
                            type="radio" 
                            name="units" 
                            value={item.id} 
                            checked={units === item.id}
                            onChange={(e) => setUnits(e.target.value)}
                            className="peer sr-only"
                        />
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-black/20 hover:bg-white dark:hover:bg-surface-darker hover:border-slate-300 dark:hover:border-slate-600 peer-checked:border-[#16a34a] dark:peer-checked:border-[#13ec13] peer-checked:bg-[#16a34a]/5 dark:peer-checked:bg-[#13ec13]/10 peer-checked:ring-1 peer-checked:ring-[#16a34a] dark:peer-checked:ring-[#13ec13] transition-all flex items-center gap-3">
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${units === item.id ? 'border-[#16a34a] dark:border-[#13ec13] bg-white dark:bg-black' : 'border-slate-400 dark:border-slate-600 bg-transparent'}`}>
                            {units === item.id && <div className="size-2.5 rounded-full bg-[#16a34a] dark:bg-[#13ec13]"></div>}
                            </div>
                            <span className={`text-sm font-bold ${units === item.id ? 'text-[#16a34a] dark:text-[#13ec13]' : 'text-slate-700 dark:text-slate-300'}`}>
                            {item.label}
                            </span>
                        </div>
                        </label>
                    ))}
                    </div>
                </div>
                </div>
            </section>

            {/* Notifications Section */}
            <section id="notifications" className="space-y-6 scroll-mt-32">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-border-dark">
                    <span className="material-symbols-outlined text-[#16a34a] text-2xl">notifications</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Notificações</h3>
                </div>
                
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-border-dark shadow-sm">
                {[
                    { id: 'workoutReminders', icon: 'fitness_center', label: 'Lembretes de Treino', sub: 'Receba avisos para manter a rotina' },
                    { id: 'newsletter', icon: 'mail', label: 'Newsletter Semanal', sub: 'Resumo do seu progresso por email' },
                    { id: 'appSounds', icon: 'volume_up', label: 'Sons do App', sub: 'Efeitos sonoros durante o uso' },
                ].map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="text-slate-400 dark:text-slate-500">
                        <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">{item.label}</h4>
                        <p className="text-sm text-slate-500 dark:text-text-secondary">{item.sub}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifications[item.id as keyof typeof notifications] ? 'bg-[#16a34a] dark:bg-[#13ec13]' : 'bg-slate-200 dark:bg-gray-700'}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifications[item.id as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    </div>
                ))}
                </div>
            </section>

            {/* Privacy Section */}
            <section id="privacy" className="space-y-6 scroll-mt-32">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-border-dark">
                    <span className="material-symbols-outlined text-[#16a34a] text-2xl">lock</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privacidade & Dados</h3>
                </div>

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                    <h4 className="font-bold text-lg mb-1 flex items-center gap-2 text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">public</span>
                        Perfil Público
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-text-secondary max-w-md leading-relaxed">
                        Ao ativar, outros usuários poderão ver seus treinos e recordes pessoais. Seu peso e notas privadas permanecem ocultos.
                    </p>
                    </div>
                    <button 
                    onClick={() => setPublicProfile(!publicProfile)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mt-2 ${publicProfile ? 'bg-[#16a34a] dark:bg-[#13ec13]' : 'bg-slate-200 dark:bg-gray-700'}`}
                    >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${publicProfile ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-border-dark">
                    <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm font-bold w-full sm:w-auto text-slate-700 dark:text-white">
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    Exportar meus dados
                    </button>
                    <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-bold w-full sm:w-auto sm:ml-auto">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                    Excluir Conta
                    </button>
                </div>
                </div>
            </section>
            
            {/* Account Section - Updated */}
             <section id="account" className="space-y-6 scroll-mt-32">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-border-dark">
                    <span className="material-symbols-outlined text-[#16a34a] text-2xl">person</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Conta</h3>
                </div>
                 <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Plano Atual</h4>
                            <p className="text-slate-500 dark:text-text-secondary">FitTrack Basic (Gratuito)</p>
                        </div>
                        <button 
                            onClick={() => navigate('/subscription')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#13ec13] dark:hover:bg-[#0fd60f] text-white dark:text-[#102210] font-bold rounded-lg transition-colors text-sm shadow-md"
                        >
                            <span className="material-symbols-outlined text-[20px]">stars</span>
                            Gerenciar Assinatura
                        </button>
                    </div>
                 </div>
            </section>

            {/* Bottom Actions */}
            <div className="sticky bottom-4 flex justify-end gap-3 pt-4">
                <div className="bg-white/80 dark:bg-surface-darker/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-slate-200 dark:border-border-dark flex gap-3">
                    <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        Cancelar
                    </button>
                    <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#13ec13] dark:hover:bg-[#0fd60f] text-white dark:text-black shadow-lg shadow-green-600/20 transition-colors">
                        Salvar Alterações
                    </button>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;