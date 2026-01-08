import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { checkRateLimit } from '../lib/security';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const { forgotPassword, isLoading, error, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!checkRateLimit('forgot-password', 5000)) {
            return;
        }

        const { success: isOk } = await forgotPassword(email);
        if (isOk) {
            setSuccess(true);
        }
    };

    return (
        <main className="flex min-h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            <section className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white dark:bg-[#0f140f]">
                <div className="max-w-[420px] w-full flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Recuperar acesso
                        </h2>
                        <p className="text-slate-500 dark:text-[#a1bca1] text-base font-medium">
                            Não se preocupe! Insira seu e-mail abaixo e enviaremos as instruções para você redefinir sua senha.
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
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
                                        placeholder="ex: seu@email.com"
                                        type="email"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
                                    <p className="text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">error</span>
                                        {error.message}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full h-14 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-lg font-black tracking-wide transition-all transform active:scale-[0.98] shadow-lg shadow-[#22c55e]/20 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : 'ENVIAR INSTRUÇÕES'}
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-6 text-center animate-in fade-in zoom-in duration-300">
                            <div className="size-20 bg-[#22c55e]/10 text-[#22c55e] rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <span className="material-symbols-outlined text-5xl">mark_email_read</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Confira seu e-mail</h3>
                                <p className="text-slate-600 dark:text-[#a1bca1] font-medium leading-relaxed">
                                    Enviamos um link de recuperação para <br /><span className="text-slate-900 dark:text-white font-bold">{email}</span>.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    clearError();
                                }}
                                className="text-[#22c55e] text-base font-bold hover:underline"
                            >
                                Não recebeu? Tentar novamente
                            </button>
                        </div>
                    )}

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

export default ForgotPassword;
