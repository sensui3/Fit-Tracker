import React from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { signOut } from '../lib/auth-client';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, logout: storeLogout } = useAuthStore();

  const logout = async () => {
    await signOut();
    storeLogout();
    window.location.href = '/login';
  };

  return { user, isAuthenticated, isLoading, logout };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};