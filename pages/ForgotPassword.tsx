import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../lib/auth-client';
import { checkRateLimit } from '../lib/security';
import { useToast } from '../components/ui/Toast';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!checkRateLimit('forgot-password', 5000)) {
            setError('Muitas tentativas. Por favor, aguarde alguns segundos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error: authError } = await forgotPassword(email);
            if (authError) throw authError;

            setSuccess(true);
            addToast({
                type: 'success',
                title: 'E-mail enviado!',
                message: 'Verifique sua caixa de entrada para resetar sua senha.',
                duration: 5000
            });
        } catch (err: any) {
            console.error('Forgot password error:', err);
            setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
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
                            Esqueceu a senha?
                        </h2>
                        <p className="text-slate-600 dark:text-[#9db99d] text-sm font-normal">
                            Insira o seu e-mail e enviaremos um link para você criar uma nova senha.
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                                    />
                                </div>
                            </label>

                            {error && <p className="text-red-500 text-xs">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center rounded-lg h-12 px-4 bg-[#15803d] hover:bg-[#166534] text-white text-base font-bold tracking-[0.015em] transition-all shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-4 text-center">
                            <div className="size-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200">
                                Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá instruções em instantes.
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="text-[#16a34a] text-sm font-medium hover:underline"
                            >
                                Tentar outro e-mail
                            </button>
                        </div>
                    )}

                    <div className="text-center mt-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Voltar para o Login
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ForgotPassword;
