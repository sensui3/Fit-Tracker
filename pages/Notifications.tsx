import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/databaseService';
import { Notification } from '../types';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('todas');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const result = await dbService.query<Notification>`
        SELECT * FROM notifications 
        WHERE user_id = ${user.id}
        ORDER BY created_at DESC
      `;
      setNotifications(result);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  const markAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await dbService.query`
        UPDATE notifications 
        SET read = true 
        WHERE user_id = ${user.id}
      `;
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await dbService.query`
        DELETE FROM notifications WHERE id = ${id}
      `;
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'todas') return true;
    if (activeTab === 'menções') return n.type === 'social'; // Assuming 'social' covers mentions
    if (activeTab === 'sistema') return n.type === 'system';
    if (activeTab === 'amigos') return n.type === 'friend'; // Assuming 'friend' type exists or mapping needed
    return true;
  });

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isYesterday = (dateString: string) => {
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
  };

  const todayNotifications = filteredNotifications.filter(n => isToday(n.created_at));
  const yesterdayNotifications = filteredNotifications.filter(n => isYesterday(n.created_at));
  const olderNotifications = filteredNotifications.filter(n => !isToday(n.created_at) && !isYesterday(n.created_at));

  const getIconForType = (type: string | undefined) => {
    switch (type) {
      case 'achievement': return 'emoji_events';
      case 'workout_reminder': return 'fitness_center';
      case 'social': return 'chat_bubble';
      case 'system': return 'update';
      case 'friend': return 'person_add';
      default: return 'notifications';
    }
  };

  const getColorForType = (type: string | undefined) => {
    switch (type) {
      case 'achievement': return 'text-[#16a34a] bg-[#16a34a]/10 border-[#16a34a]';
      case 'workout_reminder': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-500';
      case 'social': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20 border-purple-500';
      case 'friend': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 border-orange-500';
      default: return 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateFull = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const icon = getIconForType(notification.type);
    const colorClass = getColorForType(notification.type);

    // Extract border color for hover effect
    const borderColor = colorClass.split(' ').find(c => c.startsWith('border-'))?.replace('border-', '') || 'slate-200';

    return (
      <div className={`group flex flex-col sm:flex-row gap-4 bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border ${notification.read ? 'border-slate-200 dark:border-border-dark opacity-75' : 'border-slate-300 dark:border-slate-600'} hover:border-${borderColor} transition-all relative overflow-hidden`}>
        {!notification.read && <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorClass.split(' ')[0].replace('text-', 'bg-')}`}></div>}
        <div className="flex items-start gap-4 flex-1">
          <div className={`flex items-center justify-center rounded-xl shrink-0 size-12 shadow-sm ${colorClass.split(' ').slice(0, 2).join(' ')}`}>
            <span className={`material-symbols-outlined ${notification.type === 'achievement' ? 'filled' : ''}`}>{icon}</span>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex justify-between items-start w-full">
              <p className={`text-slate-900 dark:text-white text-base font-bold leading-tight ${!notification.read ? 'font-black' : ''}`}>{notification.title}</p>
              {!notification.read && <span className="text-[#16a34a] text-[10px] font-bold bg-[#16a34a]/10 px-2 py-0.5 rounded-full ml-2 shrink-0">NOVO</span>}
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-normal">
              {notification.message}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-slate-400 dark:text-text-secondary text-xs font-medium">
                {isToday(notification.created_at) ? `Hoje às ${formatDate(notification.created_at)}` :
                  isYesterday(notification.created_at) ? `Ontem às ${formatDate(notification.created_at)}` :
                    formatDateFull(notification.created_at)}
              </span>
              {notification.type === 'workout_reminder' && (
                <button onClick={() => navigate('/create-plan')} className="text-xs font-bold text-[#16a34a] hover:underline transition-colors">Ver Treino</button>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => deleteNotification(notification.id)}
          className="absolute top-4 right-4 sm:static sm:flex items-center justify-center text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    );
  };

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
            <button
              onClick={markAllAsRead}
              className="flex items-center justify-center gap-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-bold text-sm"
            >
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
                  className={`flex flex-col items-center justify-center pb-3 pt-2 min-w-[60px] relative capitalize text-sm font-bold tracking-wide transition-colors ${activeTab === tab
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
          <div className="flex flex-col gap-4 pb-20">

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="size-10 border-4 border-primary-DEFAULT border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              // Empty State
              <div className="mt-8 mb-10 flex flex-col items-center justify-center text-center opacity-50">
                <div className="bg-slate-200 dark:bg-white/10 rounded-full p-4 mb-3">
                  <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500">notifications_off</span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nenhuma notificação por enquanto</p>
              </div>
            ) : (
              <>
                {todayNotifications.length > 0 && (
                  <>
                    <p className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider mt-2 pl-1">Hoje</p>
                    {todayNotifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                  </>
                )}

                {yesterdayNotifications.length > 0 && (
                  <>
                    <p className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider mt-6 pl-1">Ontem</p>
                    {yesterdayNotifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                  </>
                )}

                {olderNotifications.length > 0 && (
                  <>
                    <p className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider mt-6 pl-1">Antigas</p>
                    {olderNotifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                  </>
                )}
              </>
            )}

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