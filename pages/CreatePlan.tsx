import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePlan: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full flex justify-center py-8 px-4 lg:px-8">
      <div className="flex flex-col w-full max-w-[1024px] gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Criar Novo Plano</h1>
          <p className="text-slate-500 dark:text-text-secondaryDark text-base font-normal">Monte seu treino personalizado selecionando exercícios e definindo as metas.</p>
        </div>

        {/* Plan Details Inputs */}
        <div className="bg-white dark:bg-surface-darker border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-slate-700 dark:text-white text-sm font-semibold">Nome do Plano</span>
              <input className="w-full rounded-lg bg-slate-50 dark:bg-[#1c271c] border border-slate-300 dark:border-[#3b543b] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5a6b5a] px-4 py-3 focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none transition-all" placeholder="Ex: Treino A - Hipertrofia Peito" type="text" defaultValue="Treino de Força - Membros Superiores"/>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-slate-700 dark:text-white text-sm font-semibold">Foco Muscular (Opcional)</span>
              <select className="w-full rounded-lg bg-slate-50 dark:bg-[#1c271c] border border-slate-300 dark:border-[#3b543b] text-slate-900 dark:text-white px-4 py-3 focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none appearance-none cursor-pointer transition-all">
                <option>Peito e Tríceps</option>
                <option>Costas e Bíceps</option>
                <option>Pernas Completo</option>
                <option>Ombros</option>
                <option>Full Body</option>
              </select>
            </label>
          </div>
        </div>

        {/* Exercises Builder Area */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-900 dark:text-white text-xl font-bold">Exercícios do Plano</h3>
            <span className="text-slate-500 dark:text-text-secondaryDark text-sm">3 exercícios adicionados</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-border-light dark:border-[#3b543b] bg-white dark:bg-surface-darker">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-slate-50 dark:bg-[#1c271c] px-6 py-3 border-b border-border-light dark:border-[#3b543b] text-sm font-medium text-slate-500 dark:text-text-secondaryDark">
              <div className="col-span-1">Ordem</div>
              <div className="col-span-4">Exercício</div>
              <div className="col-span-2 text-center">Séries</div>
              <div className="col-span-2 text-center">Reps</div>
              <div className="col-span-2 text-center">Carga (kg)</div>
              <div className="col-span-1 text-right">Ações</div>
            </div>
            {/* Exercises Rows */}
            <div className="divide-y divide-border-light dark:divide-border-dark">
              {/* Row 1 */}
              <div className="group flex flex-col md:grid md:grid-cols-12 gap-4 p-4 md:px-6 md:py-4 items-center hover:bg-slate-50 dark:hover:bg-[#162016] transition-colors">
                <div className="flex w-full md:hidden justify-between items-center mb-2">
                  <span className="text-sm text-[#16a34a] font-bold">#1</span>
                  <button className="text-red-500">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
                <div className="col-span-1 hidden md:flex items-center text-slate-400 dark:text-text-secondaryDark">
                  <span className="material-symbols-outlined cursor-grab hover:text-slate-900 dark:hover:text-white">drag_indicator</span>
                </div>
                <div className="col-span-4 w-full flex items-center gap-3">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYmC0rPib7YXizNo1HV2gleXNd_QBIIsW63ljv5wGV4DiJTsWtk0CKhIGL6qbylH6tPbCd_OGZcJH8O4KYzmF7fcIAOwFcRlsvgMgXyPG6K6fYQks-2GFXJ4Np0tTU77q7eKx9ie2fO7HO6x9f5gF7-8o6noeaG88dbPB5SJvmHxYicv-FDIWUNRD6FN1ayAn7MDm-iC2FQjM0Mfw40Ky9xpwPVZQep1PiBKHDDuyoEYf60N-kwoWGO9sREBUAqrtL4Jdj43K83Z0" 
                    className="size-10 rounded object-cover hidden sm:block bg-slate-200 dark:bg-[#283928]" 
                    alt="Supino Reto" 
                  />
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium text-base">Supino Reto</p>
                    <p className="text-slate-500 dark:text-text-secondaryDark text-xs">Peitoral • Barra</p>
                  </div>
                </div>
                <div className="col-span-6 md:col-span-6 w-full grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="md:hidden text-xs text-slate-500 dark:text-text-secondaryDark">Séries</label>
                    <input className="w-full bg-slate-50 dark:bg-[#1c271c] border border-slate-300 dark:border-[#3b543b] rounded p-2 text-center text-slate-900 dark:text-white focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none" type="number" defaultValue="4"/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="md:hidden text-xs text-slate-500 dark:text-text-secondaryDark">Reps</label>
                    <input className="w-full bg-slate-50 dark:bg-[#1c271c] border border-slate-300 dark:border-[#3b543b] rounded p-2 text-center text-slate-900 dark:text-white focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none" type="text" defaultValue="8-12"/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="md:hidden text-xs text-slate-500 dark:text-text-secondaryDark">Carga</label>
                    <input className="w-full bg-slate-50 dark:bg-[#1c271c] border border-slate-300 dark:border-[#3b543b] rounded p-2 text-center text-slate-900 dark:text-white focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none" type="number" defaultValue="60"/>
                  </div>
                </div>
                <div className="col-span-1 hidden md:flex justify-end">
                  <button className="text-slate-400 dark:text-text-secondaryDark hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Add Button */}
          <button className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#3b543b] text-slate-500 dark:text-text-secondaryDark hover:text-slate-900 dark:hover:text-white hover:border-[#16a34a] dark:hover:border-[#13ec13] hover:bg-slate-50 dark:hover:bg-[#1c271c] transition-all group">
            <span className="material-symbols-outlined group-hover:text-[#16a34a] transition-colors">add_circle</span>
            <span className="font-bold">Adicionar Exercício</span>
          </button>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white dark:bg-[#1c271c] border border-border-light dark:border-transparent rounded-lg p-4 flex flex-col shadow-sm">
            <span className="text-slate-500 dark:text-text-secondaryDark text-xs uppercase tracking-wider font-semibold">Volume Total</span>
            <span className="text-slate-900 dark:text-white text-lg font-bold">2.450 kg</span>
          </div>
          {/* ... other stats */}
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
           <button onClick={() => navigate('/workouts')} className="px-6 py-3 rounded-lg text-slate-900 dark:text-white font-bold bg-slate-200 dark:bg-[#1c271c] hover:opacity-90 transition-colors">Cancelar</button>
           <button onClick={() => navigate('/workouts')} className="px-6 py-3 rounded-lg text-white dark:text-black font-bold bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#13ec13] dark:hover:bg-[#0fd60f] shadow-lg shadow-green-600/20 dark:shadow-green-500/20 transition-all">Salvar Plano</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlan;