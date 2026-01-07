import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInValidated, signUpValidated } from '../lib/auth-client';
import { checkRateLimit } from '../lib/security';
import { useToast } from '../components/ui/Toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limit check
    if (!checkRateLimit('auth-action', 3000)) {
      setError('Muitas tentativas. Por favor, aguarde alguns segundos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data, error: authError } = await signInValidated({ email, password });
        if (authError) throw authError;
        navigate('/');
      } else {
        const { data, error: authError } = await signUpValidated({ email, password, passwordConfirmation: confirmPassword }, name);
        if (authError) throw authError;
        setIsLogin(true); // Após cadastrar, muda para login
        addToast({
          type: 'success',
          title: 'Conta criada!',
          message: 'Conta criada com sucesso! Agora você pode entrar.',
          duration: 5000
        });
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.name === 'ZodError') {
        const issues = err.issues || err.errors;
        setError(issues?.[0]?.message || 'Dados inválidos');
      } else {
        setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      {/* Left side image */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF9Hwv2Heoo-XI8hgRW60ZE1r9eIq8mRILms2493twjI56NPlSj0GhEideIV0GxNSzofkKRFJrP_pKoJabSdvmF8Za89IYLoauylGd6yay94Fls5UEaZ73-LPWnu-UY6WjIueZJCwlpwZkriLJVEeiCmD-oNYxnFv3DfemoJ_0I6qtfhKGWla-MHoCHui4YbCyzq49BU69fgrAmTvBhfmLSpu2sxkEdSieF5b_RvXJB99zGQ6z9-uvHqICLZTJ3bC9xItUJocaLOY"
          alt="Fitness Background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-12 gap-4 max-w-[580px]">
          <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em]">
            Construa a sua<br />
            <span className="text-[#22c55e]">melhor versão</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Registre seus treinos, acompanhe sua evolução e faça parte de uma comunidade focada em superar limites.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-10 sm:px-12 md:px-16 lg:px-24 bg-white dark:bg-[#111811] overflow-y-auto">
        <div className="max-w-[400px] w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2 mt-2">
            <h2 className="tracking-tight text-3xl font-bold text-slate-900 dark:text-white">
              {isLogin ? 'Bem-vindo de volta!' : 'Criar sua conta'}
            </h2>
            <p className="text-slate-600 dark:text-[#9db99d] text-sm font-normal">
              {isLogin ? 'Insira seus dados para acessar seus treinos.' : 'Preencha os dados abaixo para começar sua jornada.'}
            </p>
          </div>

          <form onSubmit={handleAction} className="flex flex-col gap-5">
            {!isLogin && (
              <label className="flex flex-col flex-1 gap-2">
                <span className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-200">Nome Completo</span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9db99d]">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-[#3b543b] bg-slate-50 dark:bg-[#1c271c] h-12 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5a6b5a] focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] outline-none transition-all"
                    placeholder="Seu nome"
                    type="text"
                    aria-label="Nome Completo"
                  />
                </div>
              </label>
            )}

            <label className="flex flex-col flex-1 gap-2">
              <span className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-200">E-mail</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9db99d]">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </span>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-[#3b543b] bg-slate-50 dark:bg-[#1c271c] h-12 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5a6b5a] focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] outline-none transition-all"
                  placeholder="ex: seu@email.com"
                  type="email"
                  aria-label="E-mail"
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-[#3b543b] bg-slate-50 dark:bg-[#1c271c] h-12 pl-11 pr-14 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5a6b5a] focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] outline-none transition-all"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  aria-label="Senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 dark:text-[#9db99d] hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-[#16a34a] text-xs font-medium hover:underline mt-1"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
              )}
            </label>

            {!isLogin && (
              <label className="flex flex-col flex-1 gap-2">
                <span className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-200">Confirmar Senha</span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9db99d]">
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                  </span>
                  <input
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-[#3b543b] bg-slate-50 dark:bg-[#1c271c] h-12 pl-11 pr-14 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5a6b5a] focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] outline-none transition-all"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    aria-label="Confirmar Senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 dark:text-[#9db99d] hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>
            )}

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-[#15803d] hover:bg-[#166534] text-white text-base font-bold tracking-[0.015em] transition-all transform active:scale-[0.98] shadow-md mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span className="truncate">{loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}</span>
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#16a34a] text-sm font-medium hover:underline p-2"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
            </button>
          </div>
        </div>
      </section>
    </main >
  );
};

export default Login;
