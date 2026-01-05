import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="flex justify-center py-8 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="flex flex-col w-full max-w-5xl gap-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            onClick={() => navigate('/settings')}
            className="text-slate-500 dark:text-text-secondary hover:underline hover:text-primary-DEFAULT transition-colors"
          >
            Configurações
          </button>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-white font-medium">Assinatura</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Gerenciamento de Assinatura
          </h1>
          <p className="text-slate-500 dark:text-text-secondary text-base md:text-lg">
            Visualize seu plano atual, métodos de pagamento e explore opções de upgrade.
          </p>
        </div>

        {/* Current Plan Status Card */}
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-border-dark overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-center gap-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase tracking-wider border border-green-200 dark:border-green-900/50">Ativo</span>
                <span className="text-sm text-slate-500 dark:text-text-secondary">Desde 12 Out 2023</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-text-secondary mb-1">Seu plano atual</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Plano Básico</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                  Sua assinatura é gratuita e inclui registro de até 3 treinos por semana e acesso ao histórico básico.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold rounded-lg transition-colors text-sm">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                  Histórico de Faturas
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-bold">
                  Cancelar Conta
                </button>
              </div>
            </div>

            {/* Visual Card Representation */}
            <div className="relative w-full md:w-1/3 min-h-[200px] bg-[#16a34a]/10 dark:bg-[#16a34a]/5 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#16a34a]/20 to-transparent"></div>
              <div className="absolute -right-10 -bottom-10 size-48 rounded-full bg-[#16a34a]/30 blur-3xl"></div>
              <div className="relative z-10 p-6 text-center">
                <div className="size-16 bg-white dark:bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-black/5">
                  <span className="material-symbols-outlined text-[#16a34a] text-3xl">fitness_center</span>
                </div>
                <p className="font-black text-slate-900 dark:text-white text-lg">FitTrack Basic</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Validado</p>
              </div>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-5 mix-blend-overlay"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBdmo_eM6lshNS-IXgCO0u1hrL1GOE28AvtcSbHDzYMxPaIBJVlx-Xvt1MPemt9MsqJ_zec6khIyaVhYzvs1LRXJ572bI4PtsOkwO0pu_-VFhhvAl9JcnZICOsfGO6hXXa8uFwFuQLq7GUl_oJVFFgoMkcxj_7kFr7DLiYXxaUmoyo-NTCZ6n_QqgQ26EKjUbUpdRSzqCmC5YQ21fpvnBSYMrwf1VAPMWBzJLWzDOVTTIDWHRMWQK7KCRc5ZVls21lvApwO6X3_UXo')" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Upgrade Section */}
        <div className="mt-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Escolha o plano ideal para sua evolução</h2>
            <p className="text-slate-500 dark:text-text-secondary">Desbloqueie recursos exclusivos para acelerar seus resultados na academia.</p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500'}`}>Mensal</span>
              <button
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-14 h-8 bg-slate-900 dark:bg-white rounded-full p-1 transition-colors focus:outline-none"
              >
                <div
                  className={`w-6 h-6 bg-[#16a34a] rounded-full shadow-md transition-transform duration-300 ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`}
                ></div>
              </button>
              <span className={`text-sm font-bold ${billingCycle === 'annual' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500'}`}>
                Anual <span className="text-[#16a34a] text-xs ml-1 bg-[#16a34a]/10 px-1.5 py-0.5 rounded">-17% OFF</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Basic Plan (Current) */}
            <div className="relative flex flex-col p-6 md:p-8 bg-white dark:bg-surface-dark rounded-xl border border-transparent shadow-sm opacity-70 hover:opacity-100 transition-opacity">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Básico</h3>
                <p className="text-sm text-slate-500 dark:text-text-secondary mt-1">Para iniciantes na jornada.</p>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">R$ 0</span>
                <span className="text-slate-500 dark:text-text-secondary">/mês</span>
              </div>
              <ul className="flex flex-col gap-4 mb-8 flex-1">
                {[
                  { text: "3 treinos por semana", included: true },
                  { text: "Histórico de 30 dias", included: true },
                  { text: "Cronômetro de descanso", included: true },
                  { text: "Gráficos de evolução", included: false },
                ].map((feature, idx) => (
                  <li key={idx} className={`flex items-center gap-3 text-sm ${feature.included ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600 line-through'}`}>
                    <span className={`material-symbols-outlined text-[20px] ${feature.included ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300 dark:text-slate-700'}`}>
                      {feature.included ? 'check' : 'close'}
                    </span>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-4 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold text-sm cursor-not-allowed border border-transparent" disabled>
                Plano Atual
              </button>
            </div>

            {/* Premium Plan */}
            <div className="relative flex flex-col p-6 md:p-8 bg-white dark:bg-surface-dark rounded-xl border-2 border-[#16a34a] shadow-[0_0_20px_rgba(22,163,74,0.15)] transform md:-translate-y-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#16a34a] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Mais Popular
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Premium</h3>
                <p className="text-sm text-slate-500 dark:text-text-secondary mt-1">Para quem leva o treino a sério.</p>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  {billingCycle === 'annual' ? 'R$ 19,90' : 'R$ 24,90'}
                </span>
                <span className="text-slate-500 dark:text-text-secondary">/mês</span>
                {billingCycle === 'annual' && (
                  <span className="ml-2 text-xs font-bold text-[#16a34a] bg-[#16a34a]/10 px-2 py-1 rounded">Cobrado anualmente</span>
                )}
              </div>
              <ul className="flex flex-col gap-4 mb-8 flex-1">
                {[
                  "Treinos ilimitados",
                  "Histórico completo vitalício",
                  "Gráficos avançados de evolução",
                  "Exportação de dados (PDF/CSV)",
                  "Sem anúncios"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-white">
                    <div className="bg-[#16a34a] rounded-full p-0.5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 px-4 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-bold text-sm cursor-not-allowed"
                disabled
              >
                Em Breve
              </button>
              <p className="text-center text-xs text-slate-500 dark:text-text-secondary mt-3">Cancele a qualquer momento.</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-border-dark p-6 md:p-8 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Método de Pagamento</h3>
              <p className="text-sm text-slate-500 dark:text-text-secondary">Gerencie como você paga sua assinatura.</p>
            </div>
            <button
              className="text-sm font-bold text-slate-400 dark:text-slate-600 flex items-center gap-1 transition-colors cursor-not-allowed"
              disabled
              title="Indisponível no momento"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Adicionar Novo
            </button>
          </div>
          <div className="border border-dashed border-slate-300 dark:border-border-dark rounded-lg p-8 flex flex-col items-center justify-center text-center gap-3 bg-slate-50 dark:bg-[#152315]">
            <div className="size-12 bg-slate-200 dark:bg-white/5 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">credit_card_off</span>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Nenhum cartão cadastrado</p>
            <p className="text-xs text-slate-500 dark:text-text-secondary">Adicione um cartão para fazer o upgrade para Premium.</p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="flex flex-col items-center gap-4 py-8 border-t border-slate-200 dark:border-border-dark mt-4">
          <p className="text-sm text-slate-500 dark:text-text-secondary">
            Tem dúvidas sobre os planos? <a className="text-slate-900 dark:text-white font-bold underline decoration-[#16a34a] decoration-2 underline-offset-2 hover:text-[#16a34a] transition-colors" href="#">Fale com nosso suporte</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;