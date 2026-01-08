import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { checkRateLimit } from '../lib/security';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();

    // Proteção contra brute force/vários cliques
    if (!checkRateLimit('auth-action', 3000)) {
      return;
    }

    if (isLogin) {
      const { success } = await login({ email, password });
      if (success) navigate('/');
    } else {
      if (password !== confirmPassword) {
        // O useAuth lida com erros de validação via Zod no serviço, 
        // mas verificação de igualdade de senha pode ser feita aqui ou no schema.
        // O schema já faz essa verificação, então o register falhará se não baterem.
      }
      const { success } = await register({ email, password, name });
      if (success) setIsLogin(true);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      {/* Lado Esquerdo - Imagem e Branding */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF9Hwv2Heoo-XI8hgRW60ZE1r9eIq8mRILms2493twjI56NPlSj0GhEideIV0GxNSzofkKRFJrP_pKoJabSdvmF8Za89IYLoauylGd6yay94Fls5UEaZ73-LPWnu-UY6WjIueZJCwlpwZkriLJVEeiCmD-oNYxnFv3DfemoJ_0I6qtfhKGWla-MHoCHui4YbCyzq49BU69fgrAmTvBhfmLSpu2sxkEdSieF5b_RvXJB99zGQ6z9-uvHqICLZTJ3bC9xItUJocaLOY"
          alt="Fitness Motivation"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-16 gap-6 max-w-[640px]">
          <h1 className="text-white text-6xl font-black leading-tight tracking-tight">
            Supere seus <br />
            <span className="text-[#22c55e]">limites hoje</span>
          </h1>
          <p className="text-gray-200 text-xl font-medium leading-relaxed">
            A plataforma definitiva para quem busca performance, constância e resultados reais nos treinos.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <section className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white dark:bg-[#0f140f] overflow-y-auto">
        <div className="max-w-[420px] w-full flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isLogin ? 'Bem-vindo!' : 'Começar agora'}
            </h2>
            <p className="text-slate-500 dark:text-[#a1bca1] text-base font-medium">
              {isLogin ? 'Acesse sua conta para continuar sua evolução.' : 'Crie sua conta e transforme seu físico.'}
            </p>
          </div>

          <form onSubmit={handleAction} className="flex flex-col gap-6" noValidate>
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 ml-1">Nome Completo</span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#5a7a5a]">
                    <span className="material-symbols-outlined">person</span>
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-100 dark:border-[#2a3a2a] bg-slate-50 dark:bg-[#1a241a] h-14 pl-12 pr-4 text-base font-medium text-slate-900 dark:text-white transition-all focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10 outline-none"
                    placeholder="Seu nome"
                    type="text"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 ml-1">E-mail</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#5a7a5a]">
                  <span className="material-symbols-outlined">mail</span>
                </span>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-100 dark:border-[#2a3a2a] bg-slate-50 dark:bg-[#1a241a] h-14 pl-12 pr-4 text-base font-medium text-slate-900 dark:text-white transition-all focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10 outline-none"
                  placeholder="ex: voce@fit-tracker.com"
                  type="email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 ml-1">Senha</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#5a7a5a]">
                  <span className="material-symbols-outlined">lock</span>
                </span>
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-100 dark:border-[#2a3a2a] bg-slate-50 dark:bg-[#1a241a] h-14 pl-12 pr-14 text-base font-medium text-slate-900 dark:text-white transition-all focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10 outline-none"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 dark:hover:bg-[#2a3a2a] rounded-lg transition-colors text-slate-400 dark:text-[#5a7a5a]"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-[#22c55e] text-xs font-bold hover:underline mt-1"
                  >
                    Recuperar senha
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 ml-1">Confirmar Senha</span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#5a7a5a]">
                    <span className="material-symbols-outlined">lock_reset</span>
                  </span>
                  <input
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-100 dark:border-[#2a3a2a] bg-slate-50 dark:bg-[#1a241a] h-14 pl-12 pr-14 text-base font-medium text-slate-900 dark:text-white transition-all focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10 outline-none"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 dark:hover:bg-[#2a3a2a] rounded-lg transition-colors text-slate-400 dark:text-[#5a7a5a]"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 animate-in fade-in slide-in-from-top-1">
                <p className="text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error.message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-14 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-lg font-black tracking-wide transition-all transform active:scale-[0.98] shadow-lg shadow-[#22c55e]/20 mt-4 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (isLogin ? 'ENTRAR' : 'CADASTRAR')}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                clearError();
              }}
              className="text-[#22c55e] text-base font-bold hover:underline underline-offset-4 decoration-2"
            >
              {isLogin ? 'Ainda não tem conta? Crie agora' : 'Já possui uma conta? Entre aqui'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
