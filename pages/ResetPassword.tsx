import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../lib/auth-client';
import { checkRateLimit } from '../lib/security';
import { useToast } from '../components/ui/Toast';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addToast } = useToast();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const t = searchParams.get('token');
        if (!t) {
            setError('Token de recuperação inválido ou expirado.');
        } else {
            setToken(t);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Token inválido.');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.');
            return;
        }

        if (!checkRateLimit('reset-password', 5000)) {
            setError('Muitas tentativas. Por favor, aguarde alguns segundos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error: authError } = await resetPassword(password, token);
            if (authError) throw authError;

            addToast({
                type: 'success',
                title: 'Senha alterada!',
                message: 'Sua senha foi atualizada com sucesso. Você já pode entrar!',
                duration: 5000
            });
            navigate('/login');
        } catch (err: any) {
            console.error('Reset password error:', err);
            setError(err.message || 'Ocorreu um erro ao resetar sua senha.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            <section className="flex-1 flex flex-col justify-center items-center px-6 py-10 bg-white dark:bg-[#111811]">
                <div className="max-w-[400px] w-full flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="tracking-tight text-3xl font-bold text-slate-900 dark:text-white">
                            Nova Senha
                        </h2>
                        <p className="text-slate-600 dark:text-[#9db99d] text-sm font-normal">
                            Crie uma senha forte para proteger sua conta.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <label className="flex flex-col flex-1 gap-2">
                            <span className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-200">Nova Senha</span>
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
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 dark:text-[#9db99d] hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>
                        </label>

                        <label className="flex flex-col flex-1 gap-2">
                            <span className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-200">Confirmar Nova Senha</span>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9db99d]">
                                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                                </span>
                                <input
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 dark:border-[#3b543b] bg-slate-50 dark:bg-[#1c271c] h-12 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5a6b5a] focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] outline-none transition-all"
                                    placeholder="••••••••"
                                    type="password"
                                />
                            </div>
                        </label>

                        {error && <p className="text-red-500 text-xs">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading || !token}
                            className={`w-full flex items-center justify-center rounded-lg h-12 px-4 bg-[#15803d] hover:bg-[#166534] text-white text-base font-bold tracking-[0.015em] transition-all shadow-md ${loading || !token ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Salvando...' : 'Redefinir Senha'}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:underline"
                        >
                            Voltar ao Login
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ResetPassword;
