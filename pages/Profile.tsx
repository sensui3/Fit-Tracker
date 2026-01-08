import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { OptimizedImage } from '../components/ui/OptimizedImage';
import { useAuthStore } from '../stores/useAuthStore';
import { dbService } from '../services/databaseService';
import { sanitize, profileSchema } from '../lib/security';
import { useToast } from '../components/ui/Toast';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dados do perfil
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    birthDate: '',
    gender: 'Masculino',
    location: '',
    weight: '',
    height: '',
    bodyFat: '',
    goal: 'Hipertrofia',
    activityLevel: 'Ativo (3-5 dias/sem)',
    bio: '',
    createdAt: null
  });

  // Estatísticas do usuário
  const [userStats, setUserStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    avgSessionTime: 0,
    currentStreak: 0
  });

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Carregar dados básicos do usuário e informações complementares
        const userResult = await dbService.query`
          SELECT name, email, birth_date, gender, location, goal, activity_level, bio, created_at
          FROM users
          WHERE id = ${user.id}
        `;

        if (userResult[0]) {
          const u = userResult[0];
          setProfileData(prev => ({
            ...prev,
            name: u.name || user.name || '',
            email: u.email || user.email || '',
            birthDate: u.birth_date ? new Date(u.birth_date).toISOString().split('T')[0] : '',
            gender: u.gender || 'Masculino',
            location: u.location || '',
            goal: u.goal || 'Hipertrofia',
            activityLevel: u.activity_level || 'Ativo (3-5 dias/sem)',
            bio: u.bio || '',
            createdAt: u.created_at || null
          }));
        } else {
          // Caso não encontre no banco, usa dados do auth
          setProfileData(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || ''
          }));
        }

        // Carregar métricas corporais mais recentes
        const metricsResult = await dbService.query`
          SELECT weight, height, body_fat
          FROM user_metrics
          WHERE user_id = ${user.id}
          ORDER BY recorded_at DESC
          LIMIT 1
        `;

        let hasMetrics = false;
        if (metricsResult[0]) {
          hasMetrics = true;
          setProfileData(prev => ({
            ...prev,
            weight: metricsResult[0].weight?.toString() || '',
            height: metricsResult[0].height?.toString() || '',
            bodyFat: metricsResult[0].body_fat?.toString() || ''
          }));
        }

        // Se não tiver métricas nem data de nascimento, assume que é novo usuário e habilita edição
        if (!hasMetrics && !userResult[0]?.birth_date) {
          setIsEditing(true);
        }

        // Carregar estatísticas do usuário
        const statsResult = await dbService.query`
          SELECT
            COUNT(DISTINCT ws.id) as total_workouts,
            COALESCE(SUM(ws.total_volume), 0) as total_volume,
            COALESCE(AVG(EXTRACT(EPOCH FROM (ws.end_time - ws.start_time))/60), 0) as avg_session_time
          FROM workout_sessions ws
          WHERE ws.user_id = ${user.id}
        `;

        if (statsResult[0]) {
          setUserStats({
            totalWorkouts: parseInt(statsResult[0].total_workouts) || 0,
            totalVolume: parseFloat(statsResult[0].total_volume) || 0,
            avgSessionTime: Math.round(parseFloat(statsResult[0].avg_session_time) || 0),
            currentStreak: 0
          });
        }

      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadUserData();
    }
  }, [user?.id, user?.email, user?.name, isAuthenticated]);

  // Função para salvar alterações
  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);

      // Sanitização básica
      const sanitizedName = sanitize(profileData.name);
      const sanitizedLocation = sanitize(profileData.location);

      // Validação simplificada com profileSchema
      profileSchema.parse({
        name: sanitizedName,
      });

      // Salvar informações na tabela users
      await dbService.query`
        UPDATE users
        SET
            name = ${sanitizedName},
            birth_date = ${profileData.birthDate || null},
            gender = ${profileData.gender},
            location = ${sanitizedLocation},
            goal = ${profileData.goal},
            activity_level = ${profileData.activityLevel},
            updated_at = NOW()
        WHERE id = ${user.id}
      `;

      // Salvar métricas corporais em nova entrada para histórico
      if (profileData.weight || profileData.height || profileData.bodyFat) {
        await dbService.query`
          INSERT INTO user_metrics (user_id, weight, height, body_fat)
          VALUES (${user.id}, ${profileData.weight ? parseFloat(profileData.weight) : null}, ${profileData.height ? parseFloat(profileData.height) : null}, ${profileData.bodyFat ? parseFloat(profileData.bodyFat) : null})
        `;
      }

      setIsEditing(false);
      addToast({
        type: 'success',
        title: 'Perfil Atualizado',
        message: 'Suas informações foram salvas com sucesso!',
        duration: 3000
      });

    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      if (error.name === 'ZodError') {
        addToast({
          type: 'error',
          title: 'Erro de Validação',
          message: error.errors[0]?.message || 'Dados inválidos',
          duration: 4000
        });
      } else {
        addToast({
          type: 'error',
          title: 'Erro ao Salvar',
          message: 'Ocorreu um erro ao salvar as informações.',
          duration: 4000
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Calcular IMC
  const calculateBMI = () => {
    const weight = parseFloat(profileData.weight);
    const height = parseFloat(profileData.height) / 100; // converter cm para m
    if (weight && height) {
      const bmi = weight / (height * height);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Baixo peso', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-500', bg: 'bg-green-500/10' };
    if (bmi < 30) return { text: 'Sobrepeso', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    return { text: 'Obesidade', color: 'text-red-500', bg: 'bg-red-500/10' };
  };

  const stats = [
    { label: 'Treinos', value: userStats.totalWorkouts.toString(), icon: 'fitness_center', color: 'text-primary-DEFAULT' },
    { label: 'Sequência', value: userStats.currentStreak.toString(), icon: 'local_fire_department', color: 'text-orange-500' },
    { label: 'Volume (kg)', value: userStats.totalVolume.toLocaleString(), icon: 'weight', color: 'text-blue-500' },
    { label: 'Tempo Médio', value: userStats.avgSessionTime > 0 ? `${Math.floor(userStats.avgSessionTime / 60)}h ${userStats.avgSessionTime % 60}m` : '--', icon: 'schedule', color: 'text-yellow-500' },
  ];

  const badges = [
    { id: 1, name: 'Madrugador', icon: 'wb_sunny', color: 'bg-amber-100 text-amber-600', tooltip: 'Treinou antes das 7h por 5 dias seguidos' },
    { id: 2, name: 'Fera do Supino', icon: 'fitness_center', color: 'bg-primary-DEFAULT/10 text-primary-DEFAULT', tooltip: 'Levantou +100kg no supino' },
    { id: 3, name: 'Maratonista', icon: 'directions_run', color: 'bg-blue-100 text-blue-600', tooltip: 'Correu 42km no total' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight mb-2">Meu Perfil</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">Personalize sua experiência e acompanhe seu nível de atleta.</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>Cancelar</Button>
              <Button onClick={handleSave} className="shadow-lg shadow-primary-DEFAULT/20" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} leftIcon={<span className="material-symbols-outlined">edit</span>}>
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Stats */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="flex flex-col items-center text-center relative overflow-hidden shadow-sm pt-12">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary-DEFAULT/20 to-green-600/5 dark:from-primary-neon/20 dark:to-transparent"></div>

            <div className="relative mb-6 group">
              <div className="relative size-40 sm:size-48 flex items-center justify-center">
                {user?.image ? (
                  <OptimizedImage
                    src={user.image}
                    alt="Profile"
                    className="h-full w-full rounded-full border-4 border-white dark:border-surface-dark shadow-xl object-cover transition-all duration-300 group-hover:brightness-50"
                  />
                ) : (
                  <div className="h-full w-full rounded-full border-4 border-white dark:border-surface-dark shadow-xl bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center text-white text-5xl font-black">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <button className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-4xl">camera_alt</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Alterar Foto</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="z-10 relative">
              <h2 className="text-slate-900 dark:text-white text-2xl font-black mb-1">
                {loading ? 'Carregando...' : (profileData.name || 'Usuário')}
              </h2>
              <div className="flex flex-col items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-primary-DEFAULT/10 text-primary-DEFAULT dark:text-primary-neon text-[10px] font-black uppercase tracking-widest">
                  Plano Free
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Membro desde {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : '--'}
                </span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm px-6 mb-8 italic leading-relaxed">
              {profileData.bio ? `"${profileData.bio}"` : '"Pronto para esmagar mais um treino!"'}
            </p>

            <div className="grid grid-cols-1 gap-3 w-full border-t border-border-light dark:border-border-dark pt-6 px-6 pb-6 mt-2">
              {stats.map((stat) => (
                <div key={stat.label} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-between gap-4 border border-slate-100 dark:border-white/5 hover:border-primary-DEFAULT/20 transition-all cursor-default group">
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <span className={`material-symbols-outlined ${stat.color} text-2xl`}>{stat.icon}</span>
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest mb-0.5">{stat.label}</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 dark:text-white/10 text-xl group-hover:text-primary-DEFAULT transition-colors">chevron_right</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Badges */}
          <Card className="p-6">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-500">military_tech</span>
              Conquistas
            </h3>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`size-12 rounded-xl flex items-center justify-center cursor-help transition-all hover:scale-110 shadow-sm border border-transparent hover:border-white/20 ${badge.color}`}
                  title={badge.tooltip}
                >
                  <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
                </div>
              ))}
              <div className="size-12 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-300">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Info */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-8 text-slate-900 dark:text-white border-b border-border-light dark:border-border-dark pb-4">
              <span className="material-symbols-outlined text-[#16a34a]">person</span>
              <h3 className="text-xl font-bold">Informações Pessoais</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <Input
                label="Nome Completo"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                className="h-12"
              />
              <Input
                label="E-mail"
                type="email"
                value={profileData.email || user?.email || ''}
                disabled={true}
                className="h-12"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Data de Nasc."
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                  disabled={!isEditing}
                  className="h-12"
                />
                <div className="flex flex-col gap-2">
                  <span className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">Gênero</span>
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
                    disabled={!isEditing}
                    className="h-12 px-4 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a]/50 focus:border-[#16a34a] outline-none disabled:opacity-60 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option>Masculino</option>
                    <option>Feminino</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>
              <Input
                label="Localização"
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                disabled={!isEditing}
                className="h-12"
              />
            </div>
          </Card>

          {/* Biometrics */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-8 text-slate-900 dark:text-white border-b border-border-light dark:border-border-dark pb-4">
              <span className="material-symbols-outlined text-[#16a34a]">straighten</span>
              <h3 className="text-xl font-bold">Biometria e Metas</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="relative">
                <Input
                  label="Peso (kg)"
                  type="number"
                  value={profileData.weight}
                  onChange={(e) => setProfileData(prev => ({ ...prev, weight: e.target.value }))}
                  disabled={!isEditing}
                  className="h-12 pr-12"
                />
                {profileData.weight && (
                  <span className="absolute bottom-[14px] right-4 text-[10px] text-green-500 font-bold">
                    kg
                  </span>
                )}
              </div>
              <Input
                label="Altura (cm)"
                type="number"
                value={profileData.height}
                onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                disabled={!isEditing}
                className="h-12"
              />
              <Input
                label="Gordura (%)"
                type="number"
                value={profileData.bodyFat}
                onChange={(e) => setProfileData(prev => ({ ...prev, bodyFat: e.target.value }))}
                disabled={!isEditing}
                className="h-12"
              />
              <div className="flex flex-col gap-2">
                <span className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">IMC Atual</span>
                <div className="h-12 px-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {calculateBMI() || '--'}
                  </span>
                  {(() => {
                    const bmi = calculateBMI();
                    if (bmi) {
                      const category = getBMICategory(parseFloat(bmi));
                      return (
                        <span className={`text-[10px] font-black uppercase tracking-tight ${category.bg} px-2 py-0.5 rounded ${category.color}`}>
                          {category.text}
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-primary-DEFAULT/5 dark:bg-primary-neon/5 rounded-2xl border border-primary-DEFAULT/10">
              <div className="flex flex-col gap-2">
                <span className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">Objetivo Principal</span>
                <select
                  value={profileData.goal}
                  onChange={(e) => setProfileData(prev => ({ ...prev, goal: e.target.value }))}
                  disabled={!isEditing}
                  className="h-12 px-4 bg-white dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a]/50 focus:border-[#16a34a] outline-none transition-all font-medium appearance-none cursor-pointer"
                >
                  <option>Perda de Peso</option>
                  <option>Hipertrofia</option>
                  <option>Resistência / Cardio</option>
                  <option>Manutenção</option>
                  <option>Flexibilidade</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">Nível de Atividade</span>
                <select
                  value={profileData.activityLevel}
                  onChange={(e) => setProfileData(prev => ({ ...prev, activityLevel: e.target.value }))}
                  disabled={!isEditing}
                  className="h-12 px-4 bg-white dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a]/50 focus:border-[#16a34a] outline-none transition-all font-medium appearance-none cursor-pointer"
                >
                  <option>Sedentário</option>
                  <option>Leve (1-2 dias/sem)</option>
                  <option>Ativo (3-5 dias/sem)</option>
                  <option>Muito Ativo (6-7 dias/sem)</option>
                  <option>Atleta Profissional</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
