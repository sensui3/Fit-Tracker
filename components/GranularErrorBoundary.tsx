import React, { Component, ErrorInfo, ReactNode } from 'react';
import LogRocket from 'logrocket';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Erro Boundary granular para envolver partes específicas da UI.
 * Permite que falhas em um componente não derrubem a aplicação inteira.
 */
export class GranularErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const errorName = this.props.name || 'GranularErrorBoundary';
        console.error(`[${errorName}] Error caught:`, error, errorInfo);
        LogRocket.captureException(error, {
            extra: {
                ...errorInfo,
                boundaryName: errorName
            }
        });
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 text-center">
                    <div className="size-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                        <span className="material-symbols-outlined">error</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        Algo deu errado neste bloco
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Não foi possível carregar este conteúdo.
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all"
                    >
                        Tentar Novamente
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
