import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { OptimizedImage } from '../components/ui/OptimizedImage';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    { label: 'Treinos', value: '124', icon: 'fitness_center', color: 'text-primary-DEFAULT' },
    { label: 'Sequência', value: '12', icon: 'local_fire_department', color: 'text-orange-500' },
    { label: 'Volume (t)', value: '84.2', icon: 'weight', color: 'text-blue-500' },
    { label: 'Nível', value: '42', icon: 'emoji_events', color: 'text-yellow-500' },
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
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
              <Button onClick={() => setIsEditing(false)} className="shadow-lg shadow-primary-DEFAULT/20">Salvar Alterações</Button>
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

            <div className="relative mb-4 group">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200"
                alt="Profile"
                className="size-36 rounded-full border-4 border-white dark:border-surface-dark shadow-xl object-cover transition-transform group-hover:scale-105"
              />
              <button className="absolute bottom-1 right-1 size-10 bg-[#16a34a] text-white rounded-full border-4 border-white dark:border-surface-dark flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg">
                <span className="material-symbols-outlined text-lg">camera_alt</span>
              </button>
            </div>

            <div className="z-10 relative">
              <h2 className="text-slate-900 dark:text-white text-2xl font-black mb-1">João Silva</h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded bg-primary-DEFAULT/10 text-primary-DEFAULT dark:text-primary-neon text-[10px] font-black uppercase tracking-widest">Plano Pro</span>
                <span className="text-slate-400 text-sm font-medium">•</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Desde Out 2024</span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm px-4 mb-8 italic">
              "Focado em hipertrofia e performance. Em busca dos 100kg no supino."
            </p>

            <div className="grid grid-cols-2 gap-4 w-full border-t border-border-light dark:border-border-dark pt-6 px-2">
              {stats.map((stat) => (
                <div key={stat.label} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl flex flex-col items-center gap-1">
                  <span className={`material-symbols-outlined ${stat.color} text-lg`}>{stat.icon}</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white leading-none">{stat.value}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-tighter">{stat.label}</span>
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
                  className={`size-12 rounded-xl flex items-center justify-center cursor-help transition-transform hover:scale-110 shadow-sm ${badge.color}`}
                  title={badge.tooltip}
                >
                  <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
                </div>
              ))}
              <div className="size-12 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-300">
                <span className="material-symbols-outlined">lock</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Info */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white border-b border-border-light dark:border-border-dark pb-4">
              <span className="material-symbols-outlined text-[#16a34a]">person</span>
              <h3 className="text-xl font-bold">Informações Pessoais</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nome Completo" defaultValue="João Silva" disabled={!isEditing} />
              <Input label="E-mail" type="email" defaultValue="joao.silva@email.com" disabled={!isEditing} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Data de Nasc." type="date" defaultValue="1995-05-15" disabled={!isEditing} />
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Gênero</span>
                  <select
                    disabled={!isEditing}
                    className="h-11 px-4 bg-slate-50 dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a] outline-none disabled:opacity-60 transition-all"
                    defaultValue="Masculino"
                  >
                    <option>Masculino</option>
                    <option>Feminino</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>
              <Input label="Localização" defaultValue="São Paulo, SP" disabled={!isEditing} />
            </div>
          </Card>

          {/* Biometrics */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white border-b border-border-light dark:border-border-dark pb-4">
              <span className="material-symbols-outlined text-[#16a34a]">straighten</span>
              <h3 className="text-xl font-bold">Biometria e Metas</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="relative">
                <Input label="Peso (kg)" type="number" defaultValue="82.5" disabled={!isEditing} />
                <span className="absolute bottom-3 right-3 text-[10px] text-green-500 font-bold">-0.5kg</span>
              </div>
              <Input label="Altura (cm)" type="number" defaultValue="185" disabled={!isEditing} />
              <Input label="Gordura Corporal (%)" type="number" defaultValue="14" disabled={!isEditing} />
              <div className="flex flex-col bg-slate-50 dark:bg-white/5 p-3 rounded-xl justify-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider leading-none mb-1">IMC Atual</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">24.1</span>
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-tight">Normal</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-primary-DEFAULT/5 dark:bg-primary-neon/5 rounded-2xl border border-primary-DEFAULT/10">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Objetivo Principal</span>
                <select
                  disabled={!isEditing}
                  className="h-11 px-4 bg-white dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a] outline-none transition-all"
                  defaultValue="Hipertrofia"
                >
                  <option>Perda de Peso</option>
                  <option>Hipertrofia</option>
                  <option>Resistência / Cardio</option>
                  <option>Manutenção</option>
                  <option>Flexibilidade</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Nível de Atividade</span>
                <select
                  disabled={!isEditing}
                  className="h-11 px-4 bg-white dark:bg-[#0a160a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a] outline-none transition-all"
                  defaultValue="Ativo (3-5 dias/sem)"
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