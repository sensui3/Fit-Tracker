import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { checkRateLimit } from '../lib/security';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { resetPassword, isLoading, error, clearError } = useAuth();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState<string | null>(() => searchParams.get('token'));
    const [validationError, setValidationError] = useState(() => searchParams.get('token') ? '' : 'Link de redefinição inválido ou expirado.');

    useEffect(() => {
        const t = searchParams.get('token');
        if (!t) {
            setValidationError('Link de redefinição inválido ou expirado.');
        } else if (t !== token) {
            setToken(t);
            setValidationError('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');
        clearError();

        if (!token) {
            setValidationError('Token ausente.');
            return;
        }

        if (password !== confirmPassword) {
            setValidationError('As senhas não coincidem.');
            return;
        }

        if (password.length < 8) {
            setValidationError('A senha deve conter no mínimo 8 caracteres.');
            return;
        }

        if (!checkRateLimit('reset-password', 5000)) {
            return;
        }

        const { success } = await resetPassword({ password, token });
        if (success) {
            navigate('/login');
        }
    };

    return (
        <main className="flex min-h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            <section className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white dark:bg-[#0f140f]">
                <div className="max-w-[420px] w-full flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Nova senha
                        </h2>
                        <p className="text-slate-500 dark:text-[#a1bca1] text-base font-medium">
                            Escolha uma senha forte e segura para proteger sua conta e seus dados.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
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
                        </div>

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
                                    className="w-full rounded-xl border-2 border-slate-100 dark:border-[#2a3a2a] bg-slate-50 dark:bg-[#1a241a] h-14 pl-12 pr-4 text-base font-medium text-slate-900 dark:text-white transition-all focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10 outline-none"
                                    placeholder="••••••••"
                                    type="password"
                                />
                            </div>
                        </div>

                        {(error || validationError) && (
                            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
                                <p className="text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">error</span>
                                    {error?.message || validationError}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !token}
                            className={`w-full h-14 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-lg font-black tracking-wide transition-all transform active:scale-[0.98] shadow-lg shadow-[#22c55e]/20 flex items-center justify-center ${isLoading || !token ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'SALVAR NOVA SENHA'}
                        </button>
                    </form>

                    <div className="text-center">
                        <button
                            onClick={() => {
                                clearError();
                                navigate('/login');
                            }}
                            className="text-slate-400 dark:text-[#5a7a5a] text-sm font-bold hover:text-slate-600 dark:hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto decoration-2 underline-offset-4"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            VOLTAR PARA O LOGIN
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ResetPassword;
