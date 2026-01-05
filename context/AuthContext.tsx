import React from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { signOut } from '../lib/auth-client';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, logout: storeLogout } = useAuthStore();

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
    } finally {
      storeLogout();
      // Com HashRouter, precisamos redirecionar para o hash correto
      window.location.href = '/#/login';
      // Recarrega para garantir limpeza total de estados residuais
      window.location.reload();
    }
  };

  return { user, isAuthenticated, isLoading, logout };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};