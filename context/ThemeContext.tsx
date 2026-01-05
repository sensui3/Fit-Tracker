import React from 'react';
import { useUIStore } from '../stores/useUIStore';

export const useTheme = () => {
  const { theme, setTheme } = useUIStore();
  return { theme, setTheme };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};