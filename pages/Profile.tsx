import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 md:p-8 lg:p-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight mb-2">Perfil do Usuário</h1>
          <p className="text-text-secondary text-base">Gerencie suas informações pessoais, estatísticas e configurações da conta.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary-DEFAULT/10 to-transparent opacity-80"></div>
            <div className="relative group cursor-pointer mb-4">
              <div className="size-32 rounded-full border-4 border-white dark:border-border-dark overflow-hidden bg-slate-200">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmiO6-cETedZg3ErWYV8S8VaEQnlOs7aU433Psn-53LBUfnftI3NzID-SAm4nLR7_paiFRTpdgBQPiGw7oHInRJEt5nKbsLX-njwjQunp9aJ9JSvwIcx6bw7kKTqdP-08KjHDvz773rPJ_QdoA_iLbonvuUKeqjkn8xwLmBu6O1PiTq_rkpQn_nwpUenwabxG0QlrUxqgdm4z2gXQ_9YAWaQEiGNTR6aTD8ikPEDTjuSk1Zp6MHQQLfMCWsfuxL3anoBqBxxIQaoI" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold mb-1">Alex Silva</h2>
            <p className="text-primary-DEFAULT font-medium text-sm mb-4">Membro Pro</p>
            <div className="grid grid-cols-2 gap-3 w-full border-t border-border-light dark:border-border-dark pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">124</span>
                <span className="text-xs text-text-secondary uppercase tracking-wider">Treinos</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">42</span>
                <span className="text-xs text-text-secondary uppercase tracking-wider">Nível</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-900 dark:text-white text-xl font-bold">Dados Básicos</h3>
              <button className="text-primary-DEFAULT text-sm font-bold hover:underline">Editar</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm font-medium">Nome Completo</span>
                <input className="bg-slate-50 dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg h-12 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary-DEFAULT focus:ring-1 focus:ring-primary-DEFAULT transition-colors" type="text" defaultValue="Alex Silva"/>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm font-medium">E-mail</span>
                <input className="w-full bg-slate-50 dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg h-12 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary-DEFAULT focus:ring-1 focus:ring-primary-DEFAULT transition-colors" type="email" defaultValue="alex.silva@email.com"/>
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;