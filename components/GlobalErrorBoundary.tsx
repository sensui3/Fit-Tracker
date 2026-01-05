import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from "@sentry/react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        Sentry.captureException(error, { extra: { ...errorInfo } });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#102210] p-4 text-center">
                    <div className="max-w-md w-full bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-2xl border border-red-500/20">
                        <div className="size-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-400">
                            <span className="material-symbols-outlined text-4xl">error</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ops! Algo deu errado.</h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Ocorreu um erro inesperado na aplicação. Por favor, tente recarregar a página.
                        </p>
                        <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-xl mb-6 text-left overflow-auto max-h-40">
                            <code className="text-xs text-red-500 font-mono">
                                {this.state.error?.message}
                            </code>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-xl transition-all shadow-lg shadow-green-600/20"
                            >
                                Recarregar Aplicação
                            </button>
                            <button
                                onClick={() => Sentry.showReportDialog({ eventId: Sentry.lastEventId() })}
                                className="w-full py-3 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-white/20 transition-all"
                            >
                                Enviar Relatório de Erro
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (this as any).props.children;
    }
}
