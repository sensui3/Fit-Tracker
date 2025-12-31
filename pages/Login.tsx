import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    login();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      {/* Left side image */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF9Hwv2Heoo-XI8hgRW60ZE1r9eIq8mRILms2493twjI56NPlSj0GhEideIV0GxNSzofkKRFJrP_pKoJabSdvmF8Za89IYLoauylGd6yay94Fls5UEaZ73-LPWnu-UY6WjIueZJCwlpwZkriLJVEeiCmD-oNYxnFv3DfemoJ_0I6qtfhKGWla-MHoCHui4YbCyzq49BU69fgrAmTvBhfmLSpu2sxkEdSieF5b_RvXJB99zGQ6z9-uvHqICLZTJ3bC9xItUJocaLOY" 
          alt="Fitness Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-12 gap-4 max-w-[580px]">
          <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em]">
            Construa a sua<br/>
            <span className="text-[#16a34a]">melhor versão</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Registre seus treinos, acompanhe sua evolução e faça parte de uma comunidade focada em superar limites.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 sm:px-12 md:px-16 lg:px-24 bg-white dark:bg-[#111811] overflow-y-auto">
        <div className="max-w-[400px] w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2 mt-2">
            <h2 className="tracking-tight text-3xl font-bold text-slate-900 dark:text-white">Bem-vindo de volta!</h2>
            <p className="text-slate-500 dark:text-[#9db99d] text-sm font-normal">Insira seus dados para acessar seus treinos.</p>
          </div>

          <div className="flex flex-col gap-5">
            <label className="flex flex-col flex-1 gap-2">
              <span className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-200">E-mail ou Usuário</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9db99d]">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </span>
                <input 
                  className="w-full rounded-lg border border-slate-300 dark:border-[#3b543b] bg-slate-50 dark:bg-[#1c271c] h-12 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5a6b5a] focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none transition-all" 
                  placeholder="ex: seu@email.com" 
                  type="email"
                />
              </div>
            </label>
            <label className="flex flex-col flex-1 gap-2">
              <span className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-200">Senha</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9db99d]">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <input 
                  className="w-full rounded-lg border border-slate-300 dark:border-[#3b543b] bg-slate-50 dark:bg-[#1c271c] h-12 pl-11 pr-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5a6b5a] focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none transition-all" 
                  placeholder="••••••••" 
                  type="password"
                />
              </div>
            </label>
          </div>

          <button 
            onClick={handleLogin} 
            className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white dark:text-white text-base font-bold tracking-[0.015em] transition-all transform active:scale-[0.98] shadow-md mt-2"
          >
            <span className="truncate">Entrar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;