import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';

// Criar o cliente para React Query com configurações globais otimizadas
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dados consideramos frescos por 5 minutos
      gcTime: 1000 * 60 * 30, // Manter em cache por 30 minutos (garbage collection)
      retry: 2,
      refetchOnWindowFocus: false, // Evita refetch ao trocar de aba (opcional)
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);