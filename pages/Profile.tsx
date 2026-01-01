import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { OptimizedImage } from '../components/ui/OptimizedImage';

const Profile: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight mb-2">Perfil do Usuário</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">Gerencie suas informações pessoais, estatísticas e configurações da conta.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <Card className="flex flex-col items-center text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#16a34a]/10 to-transparent opacity-80"></div>
            <div className="relative group cursor-pointer mb-4">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200"
                alt="Profile"
                className="size-32 rounded-full border-4 border-white dark:border-surface-dark shadow-lg"
              />
            </div>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold mb-1">Alex Silva</h2>
            <p className="text-[#16a34a] font-medium text-sm mb-4">Membro Pro</p>
            <div className="grid grid-cols-2 gap-3 w-full border-t border-border-light dark:border-border-dark pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">124</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Treinos</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">42</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nível</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          <Card className="p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-900 dark:text-white text-xl font-bold">Dados Básicos</h3>
              <Button variant="ghost" size="sm" className="text-[#16a34a] dark:text-[#13ec13]">Editar</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nome Completo" defaultValue="Alex Silva" />
              <Input label="E-mail" type="email" defaultValue="alex.silva@email.com" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;